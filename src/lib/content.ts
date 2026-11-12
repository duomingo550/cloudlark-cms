import type { Where } from 'payload'

import { getCurrentSite, getPayloadClient } from '@/lib/payload'

const DETAIL_ROUTE: Record<string, string> = {
  articles: 'news',
  tutorials: 'tutorials',
  tools: 'tools',
  products: 'products',
  tracks: 'music',
  'learning-paths': 'learning',
  'comic-series': 'comics',
  videos: 'videos',
  skills: 'skills',
}

const SORT_BY_COLLECTION: Record<string, string> = {
  articles: '-publishedDate',
  tutorials: '-createdAt',
  tools: '-featuredRank',
  products: 'statusLabel',
  tracks: '-releaseDate',
  'learning-paths': 'position',
  skills: 'position',
  'comic-series': '-updatedAt',
  videos: '-publishedDate',
}

const SAFE_FILTER_FIELDS: Record<string, Set<string>> = {
  articles: new Set(['featuredRank']),
  tutorials: new Set(['durationMinutes']),
  tools: new Set(['pricing']),
  products: new Set(['kind', 'statusLabel']),
  tracks: new Set(['featuredRank']),
  'learning-paths': new Set(['position']),
  skills: new Set(['group', 'level']),
  'comic-series': new Set(['status']),
  videos: new Set<string>(),
}

export async function getSections(siteId: string | number) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'sections',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    sort: 'position',
    where: {
      and: [
        { site: { equals: siteId } },
        { visible: { equals: true } },
      ],
    },
  })
  return result.docs
}

export async function getSectionByPath(routePath: string) {
  const site = await getCurrentSite()
  if (!site) return null
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'sections',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        { site: { equals: site.id } },
        { routePath: { equals: routePath } },
        { visible: { equals: true } },
      ],
    },
  })
  return { site, section: result.docs[0] || null }
}

export function parseSimpleFilter(
  collection: string,
  filter?: string | null,
): Where {
  if (!filter) return {}
  const [field, value] = filter.split('=').map((part) => part.trim())
  if (!field || !value || !SAFE_FILTER_FIELDS[collection]?.has(field)) return {}
  return { [field]: { equals: value } }
}

export async function getSectionEntries(section: any, limit = 100) {
  if (!section?.sourceCollection) return []
  if (!SAFE_FILTER_FIELDS[section.sourceCollection]) return []
  const payload = await getPayloadClient()
  const filter = parseSimpleFilter(section.sourceCollection, section.filter)
  const where: Where = {
    and: [
      { site: { equals: section.site?.id || section.site } },
      { _status: { equals: 'published' } },
      filter,
    ].filter((entry) => Object.keys(entry).length > 0),
  }
  const result = await payload.find({
    collection: section.sourceCollection,
    depth: 2,
    limit,
    overrideAccess: true,
    pagination: false,
    sort: SORT_BY_COLLECTION[section.sourceCollection] || '-updatedAt',
    where,
  })
  return result.docs
}

/**
 * 按集合直接取已发布条目。
 *
 * 给有独立列表路由、但不依赖 sections 配置的集合用（如 /videos）。
 * 排序沿用 SORT_BY_COLLECTION；集合没有约定时退回 -updatedAt。
 */
export async function getCollectionEntries(
  collection: string,
  siteId: string | number,
  options: { limit?: number; sort?: string } = {},
) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: collection as any,
    depth: 2,
    limit: options.limit ?? 100,
    overrideAccess: true,
    pagination: false,
    sort: options.sort || SORT_BY_COLLECTION[collection] || '-updatedAt',
    where: {
      and: [
        { site: { equals: siteId } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  return result.docs
}

export async function getEntry(
  collection: string,
  slug: string,
  siteId: string | number,
) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: collection as any,
    depth: 2,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        { site: { equals: siteId } },
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  return result.docs[0] || null
}

export async function getPageBySlug(slug: string, siteId: string | number) {
  return getEntry('pages', slug, siteId)
}

export async function getComicChapters(
  seriesId: string | number,
  siteId: string | number,
) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'comic-chapters',
    depth: 2,
    limit: 200,
    overrideAccess: true,
    pagination: false,
    sort: 'chapterNumber',
    where: {
      and: [
        { site: { equals: siteId } },
        { series: { equals: seriesId } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  return result.docs
}

export async function getSectionCounts(siteId: string | number) {
  const payload = await getPayloadClient()
  const collections = [
    'tools',
    'articles',
    'tutorials',
    'products',
    'tracks',
    'comic-series',
  ] as const
  const counts = await Promise.all(
    collections.map(async (collection) => {
      const result = await payload.count({
        collection,
        overrideAccess: true,
        where: {
          and: [
            { site: { equals: siteId } },
            { _status: { equals: 'published' } },
          ],
        },
      })
      return [collection, result.totalDocs] as const
    }),
  )
  return Object.fromEntries(counts)
}

export async function searchSite(
  siteId: string | number,
  keyword: string,
) {
  const payload = await getPayloadClient()
  const term = keyword.trim()
  if (!term) return []
  const specs = [
    { collection: 'articles', fields: ['title', 'excerpt'] },
    { collection: 'tools', fields: ['name', 'summary'] },
    { collection: 'tutorials', fields: ['title', 'excerpt'] },
    { collection: 'products', fields: ['name', 'summary'] },
    { collection: 'tracks', fields: ['title', 'artist'] },
    { collection: 'comic-series', fields: ['title', 'synopsis'] },
    { collection: 'videos', fields: ['title', 'description'] },
    { collection: 'skills', fields: ['name', 'description'] },
    { collection: 'learning-paths', fields: ['title', 'description'] },
  ] as const

  const results = await Promise.all(
    specs.map(async (spec) => {
      const response = await payload.find({
        collection: spec.collection,
        depth: 2,
        limit: 8,
        overrideAccess: true,
        pagination: false,
        where: {
          and: [
            { site: { equals: siteId } },
            { _status: { equals: 'published' } },
            {
              or: spec.fields.map((field) => ({
                [field]: { like: term },
              })),
            },
          ],
        },
      })
      return {
        collection: spec.collection,
        docs: response.docs,
      }
    }),
  )
  return results.filter((group) => group.docs.length > 0)
}

export function detailHref(collection: string, doc: any) {
  const base = DETAIL_ROUTE[collection]
  if (!base) return '#'
  return `/${base}/${doc.slug}`
}

export function formatDate(value?: string | null) {
  if (!value) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).format(new Date(value))
}

/** 秒数 → 5:07 / 1:02:03；无效或非正数返回空串。 */
export function formatDuration(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return ''
  }
  const total = Math.round(value)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const mm = String(minutes).padStart(hours > 0 ? 2 : 1, '0')
  const ss = String(seconds).padStart(2, '0')
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`
}

export function mediaUrl(value: any) {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.url || null
}
