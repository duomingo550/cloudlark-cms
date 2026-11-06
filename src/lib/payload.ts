import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export async function getPayloadClient() {
  return getPayload({ config })
}

export async function getCurrentSite() {
  const payload = await getPayloadClient()
  const headerStore = await headers()
  const host = (headerStore.get('host') || 'localhost')
    .split(':')[0]
    .toLowerCase()

  const result = await payload.find({
    collection: 'sites',
    depth: 1,
    limit: 200,
    overrideAccess: true,
    pagination: false,
  })

  return (
    result.docs.find((site) => {
      if ((site.publicUrl || '').includes(host)) return true
      return (site.domains || []).some(
        (domain: { host?: string }) => domain.host?.toLowerCase() === host,
      )
    }) ||
    result.docs.find((site) => site.isDefault) ||
    result.docs[0] ||
    null
  )
}
