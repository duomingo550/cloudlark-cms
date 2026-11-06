import { APIError, type CollectionBeforeChangeHook } from 'payload'

const UPLOAD_COLLECTIONS = ['media', 'audio-assets', 'download-assets'] as const

function idOf(value: unknown) {
  return typeof value === 'object' && value !== null
    ? (value as { id?: number | string }).id
    : (value as number | string | undefined)
}

export const enforceStorageQuota: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const siteId = idOf(data?.site) || idOf(originalDoc?.site)
  const incomingSize = Number(data?.filesize || 0)
  if (!siteId || !Number.isFinite(incomingSize) || incomingSize <= 0) {
    return data
  }

  const site = await req.payload.findByID({
    collection: 'sites',
    id: siteId,
    depth: 0,
    overrideAccess: true,
  })
  const quotaMb = Number(site.storageQuotaMb || 0)
  if (!quotaMb) return data

  let usedBytes = 0
  for (const collection of UPLOAD_COLLECTIONS) {
    let page = 1
    let totalPages = 1
    do {
      const result = await req.payload.find({
        collection,
        depth: 0,
        limit: 100,
        overrideAccess: true,
        page,
        where: { site: { equals: siteId } },
      })
      usedBytes += result.docs.reduce(
        (sum, doc) => sum + Number((doc as { filesize?: number }).filesize || 0),
        0,
      )
      totalPages = result.totalPages || 1
      page += 1
    } while (page <= totalPages)
  }

  const previousSize =
    idOf(originalDoc?.site) === siteId
      ? Number(originalDoc?.filesize || 0)
      : 0
  const projected = usedBytes - previousSize + incomingSize
  if (projected > quotaMb * 1024 * 1024) {
    throw new APIError(`站点存储额度不足（上限 ${quotaMb} MB）`, 413)
  }
  return data
}
