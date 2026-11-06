import { APIError, type CollectionBeforeValidateHook, type Where } from 'payload'

export function uniquePerSite(
  collection: string,
  field: string,
): CollectionBeforeValidateHook {
  return async ({ data, originalDoc, req }) => {
    const rawSite = data?.site
    const site = typeof rawSite === 'object' ? rawSite?.id : rawSite
    const value = data?.[field]
    if (!site || typeof value !== 'string' || !value.trim()) return data

    const conditions: Where[] = [
      { site: { equals: site } },
      { [field]: { equals: value.trim() } },
    ]
    if (originalDoc?.id) {
      conditions.push({ id: { not_equals: originalDoc.id } })
    }

    const existing = await req.payload.find({
      collection: collection as any,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: { and: conditions },
    })
    if (existing.totalDocs > 0) {
      throw new APIError(`同一站点中 ${field}「${value}」已存在`, 400)
    }
    return data
  }
}
