import type { Where } from 'payload'

import { getPayloadClient, getPrimarySite } from '@/lib/payload'
import { absoluteUrl, resolveBaseUrl } from '@/lib/siteUrl'

/**
 * 运行时生成的 /rss.xml（RSS 2.0）。
 *
 * 为什么不 prebuild 成静态文件：文章随时发布/下线，静态 RSS 会立刻过期；这里每次请求
 * 直接读库，只收 `_status = 'published'` 的文章（草稿不会泄漏到订阅源）。
 *
 * 站点根 URL 复用 resolveBaseUrl，与 sitemap/robots/llms.txt 保持同一套
 * 「publicUrl 是本机地址时退回 NEXT_PUBLIC_CMS_URL」的兜底逻辑。
 */
export const dynamic = 'force-dynamic'

/** 只订阅最近 20 篇，避免 feed 越滚越大。 */
const FEED_LIMIT = 20

/** 文章详情页路径前缀，取自 src/app/(frontend)/news/[slug]/page.tsx。 */
const ARTICLE_ROUTE = '/news'

const XML_HEADERS = { 'content-type': 'text/xml; charset=utf-8' }

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/**
 * XML 文本转义。`&` 必须最先替换，否则会把后面生成的 `&lt;` 再转义成 `&amp;lt;`。
 */
function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** RSS 的 pubDate 要求 RFC 822；非法/缺失日期直接不写这一行，不编一个时间。 */
function toRfc822(value: unknown): string | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date.toUTCString()
}

export async function GET() {
  const site = await getPrimarySite()
  const base = resolveBaseUrl(site?.publicUrl)
  const title = text(site?.seo?.title) || text(site?.name) || 'CloudLark CMS'
  const description =
    text(site?.seo?.description) ||
    text(site?.brand?.description) ||
    text(site?.brand?.tagline) ||
    ''

  const payload = await getPayloadClient()
  const where: Where = {
    and: [
      ...(site ? [{ site: { equals: site.id } } as Where] : []),
      { _status: { equals: 'published' } },
    ],
  }

  const { docs } = await payload.find({
    collection: 'articles',
    depth: 0,
    limit: FEED_LIMIT,
    overrideAccess: true,
    pagination: false,
    sort: '-publishedDate',
    where,
  })

  const items = docs.map((doc: any) => {
    const link = absoluteUrl(base, `${ARTICLE_ROUTE}/${doc.slug}`)
    const pubDate = toRfc822(doc.publishedDate || doc.createdAt)
    const summary = text(doc.excerpt) || text(doc.summary)
    return [
      '    <item>',
      `      <title>${escapeXml(doc.title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      pubDate ? `      <pubDate>${pubDate}</pubDate>` : '',
      `      <description>${escapeXml(summary)}</description>`,
      '    </item>',
    ]
      .filter(Boolean)
      .join('\n')
  })

  const lastBuildDate =
    toRfc822(site?.updatedAt) ||
    toRfc822(docs[0]?.publishedDate || docs[0]?.updatedAt) ||
    new Date().toUTCString()

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(absoluteUrl(base, '/'))}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>zh-CN</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(absoluteUrl(base, '/rss.xml'))}" rel="self" type="application/rss+xml" />`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')

  return new Response(xml, { headers: XML_HEADERS })
}
