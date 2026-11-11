import type { MetadataRoute } from 'next'

import {
  getPageBySlug,
  getSectionEntries,
  getSections,
} from '@/lib/content'
import { getPrimarySite } from '@/lib/payload'
import { absoluteUrl, resolveBaseUrl } from '@/lib/siteUrl'

/**
 * 运行时生成的 /sitemap.xml（Next App Router 约定，不放 public/ 静态文件）。
 *
 * 为什么不静态导出：内容在后台随时会改，静态文件会立刻过期；这里直接读库，
 * 每次请求都反映当前已发布内容。
 */
export const dynamic = 'force-dynamic'

/**
 * 有真实详情页的集合 → 详情路径前缀。
 *
 * 取自 src/app/(frontend)/<route>/[slug]/page.tsx 的实际目录，不是 DETAIL_ROUTE 的直接复制：
 * src/lib/content.ts:12 把 `skills` 也映射成 `skills`，但仓库里**没有**
 * src/app/(frontend)/skills/[slug]，写进 sitemap 就是死链，所以这里刻意不收录 skills 详情
 * （/skills 列表页由 [section] 动态路由提供，仍然保留）。
 *
 * `tracks`/`comic-series` 的详情路由(/music/[slug]、/comics/[slug])存在，但它们对应的
 * 栏目在种子数据里是 visible=false（src/seed.ts:324、:335），getSections() 拿不到，
 * 因此不会出现在 sitemap 里 —— 未启用的栏目不该被搜索引擎当成站点正文。
 */
const DETAIL_ROUTE: Record<string, string> = {
  articles: 'news',
  tutorials: 'tutorials',
  tools: 'tools',
  products: 'products',
  tracks: 'music',
  'learning-paths': 'learning',
  'comic-series': 'comics',
}

/** 首页 1.0、列表页 0.8、详情 0.6（与需求约定一致）。 */
const PRIORITY = { home: 1, list: 0.8, detail: 0.6 } as const

type SitemapEntry = MetadataRoute.Sitemap[number]

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date
}

function latest(dates: Array<Date | undefined>): Date | undefined {
  return dates.reduce<Date | undefined>((acc, current) => {
    if (!current) return acc
    return !acc || current > acc ? current : acc
  }, undefined)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getPrimarySite()
  if (!site) {
    console.warn('[sitemap] 未找到 sites 记录，返回空 sitemap.xml')
    return []
  }

  const base = resolveBaseUrl(site.publicUrl)
  const siteUpdatedAt = toDate(site.updatedAt)

  // 用 Map 去重：store 与 agents 两个栏目可能指向同一批 products，
  // 同一个详情 URL 只保留一条（lastModified 取较新的）。
  const entries = new Map<string, SitemapEntry>()

  const add = (
    url: string,
    lastModified: Date | undefined,
    changeFrequency: SitemapEntry['changeFrequency'],
    priority: number,
  ) => {
    const previous = entries.get(url)
    if (previous) {
      const previousDate = toDate(previous.lastModified)
      if (
        lastModified &&
        (!previousDate || lastModified.getTime() > previousDate.getTime())
      ) {
        entries.set(url, { ...previous, lastModified })
      }
      return
    }
    entries.set(url, {
      url,
      changeFrequency,
      priority,
      ...(lastModified ? { lastModified } : {}),
    })
  }

  add(absoluteUrl(base, '/'), siteUpdatedAt, 'daily', PRIORITY.home)

  const sections = await getSections(site.id)

  for (const section of sections) {
    // 外部链接栏目是站外地址，不属于本站 sitemap。
    if (section.kind === 'external') continue
    const routePath = String(section.routePath || '').trim()
    if (!routePath) continue

    if (section.kind === 'page') {
      // 独立页面：先确认页面真的存在，否则不写（避免死链）。
      const page = await getPageBySlug(routePath, site.id)
      if (!page) continue
      add(
        absoluteUrl(base, `/${routePath}`),
        toDate(page.updatedAt),
        'monthly',
        PRIORITY.list,
      )
      continue
    }

    const docs = await getSectionEntries(section, 500)
    const detailBase = DETAIL_ROUTE[String(section.sourceCollection || '')]
    const listUpdatedAt =
      latest(
        docs.map((doc: any) => toDate(doc.updatedAt || doc.publishedDate)),
      ) || siteUpdatedAt

    add(absoluteUrl(base, `/${routePath}`), listUpdatedAt, 'daily', PRIORITY.list)

    // 没有详情路由的集合（skills）只收列表页。
    if (!detailBase) continue
    for (const doc of docs as any[]) {
      if (!doc?.slug) continue
      add(
        absoluteUrl(base, `/${detailBase}/${doc.slug}`),
        toDate(doc.updatedAt || doc.publishedDate) || siteUpdatedAt,
        'weekly',
        PRIORITY.detail,
      )
    }
  }

  // 联系页是静态路由（src/app/(frontend)/contact/page.tsx），不在 sections 表里，
  // 但每个页面的页脚都链到它，属站点正文，单独补一条。
  add(absoluteUrl(base, '/contact'), siteUpdatedAt, 'monthly', PRIORITY.list)

  return [...entries.values()]
}
