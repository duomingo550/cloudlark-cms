import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { normalizeHost } from '@/lib/host'

export async function getPayloadClient() {
  return getPayload({ config })
}

export const getCurrentSite = cache(async () => {
  const payload = await getPayloadClient()
  const headerStore = await headers()
  const host = normalizeHost(headerStore.get('host'))
  const allowedHosts = (process.env.ALLOWED_HOSTS || '')
    .split(',')
    .map((item) => normalizeHost(item))
    .filter(Boolean)
  const allowUnmatchedFallback =
    process.env.NODE_ENV !== 'production' ||
    process.env.ALLOW_UNMATCHED_HOST_FALLBACK === 'true'

  if (!host || (allowedHosts.length > 0 && !allowedHosts.includes(host))) {
    return null
  }

  const exact = await payload.find({
    collection: 'sites',
    depth: 1,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { 'domains.host': { equals: host } },
  })
  if (exact.docs[0]) return exact.docs[0]

  // 历史数据里可能存着大小写或首尾空格不一致的域名（写入时的归一化只对新数据生效），
  // 这里用归一化后的值再比对一次，避免大小写不同就匹配失败。
  const sites = await payload.find({
    collection: 'sites',
    depth: 1,
    limit: 100,
    overrideAccess: true,
    pagination: false,
  })
  const caseInsensitive = sites.docs.find((candidate) =>
    (candidate.domains || []).some(
      (domain) => normalizeHost(domain?.host ?? null) === host,
    ),
  )
  if (caseInsensitive) return caseInsensitive

  if (!allowUnmatchedFallback) return null

  const fallback = await payload.find({
    collection: 'sites',
    depth: 1,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { isDefault: { equals: true } },
  })
  return fallback.docs[0] || null
})
