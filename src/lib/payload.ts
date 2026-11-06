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

  if (host) {
    const exact = await payload.find({
      collection: 'sites',
      depth: 1,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { 'domains.host': { equals: host } },
    })
    if (exact.docs[0]) return exact.docs[0]
  }

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
