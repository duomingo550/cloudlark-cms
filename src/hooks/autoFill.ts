import type { CollectionBeforeValidateHook } from 'payload'

/**
 * 把标题/名称转成 URL 安全的 slug。
 *
 * 不引入拼音依赖：中文标题会得到空串，由调用方用时间戳兜底。
 * 结果可直接通过 `slugField` 的 `^[a-z0-9]+(?:-[a-z0-9]+)*$` 校验。
 */
function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

function fallbackSlug(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

/**
 * 自动补全 slug 与 site，避免编辑者每次手填。
 *
 * - slug：只在本次提交和原文档都没有 slug 时，由 title（或 name）生成；
 *   已存在的 slug 不会被标题改动覆盖，避免 URL 漂移。
 * - site：只在本次提交和原文档都没有 site 时，取 sites 的第一条；
 *   当前是单站点产品，这里不引入站点选择器。
 */
export const autoFillSlugAndSite: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data

  const source =
    typeof data.title === 'string'
      ? data.title
      : typeof data.name === 'string'
        ? data.name
        : ''

  if (!data.slug && !originalDoc?.slug && source.trim()) {
    data.slug = slugify(source) || fallbackSlug()
  }

  if (!data.site && !originalDoc?.site) {
    const { docs } = await req.payload.find({
      collection: 'sites',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      sort: 'createdAt',
    })
    if (docs[0]) data.site = docs[0].id
  }

  return data
}
