import { mediaUrl } from '@/lib/content'
import { absoluteUrl } from '@/lib/siteUrl'

/**
 * 结构化数据（JSON-LD）的渲染组件与节点构造器。
 *
 * 两条硬规则：
 * 1. 只输出数据库里真实存在的字段。取不到的值一律**省略**（不是写空字符串，
 *    空字符串在 schema.org 里是「有值但无效」，比缺字段更容易被判错）。
 * 2. 服务端组件：不引入任何客户端状态，`<script type="application/ld+json">`
 *    随 HTML 一起下发，爬虫（含 AI 爬虫）不执行 JS 也能读到。
 */

type JsonLdNode = Record<string, unknown>

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

/** ISO 8601；非法日期返回 undefined（避免输出 "Invalid Date"）。 */
function isoDate(value: unknown) {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/** 把相对图片地址补成绝对地址。 */
function absoluteMediaUrl(baseUrl: string, value: unknown) {
  const url = mediaUrl(value)
  if (!url) return undefined
  return /^https?:\/\//i.test(url) ? url : absoluteUrl(baseUrl, url)
}

/**
 * 从 priceLabel 里解析数字价格。
 * 只认「纯数字」或「¥/￥ + 数字」两种写法；"待定价""按需报价""可咨询" 一律不产出 offers。
 * 站点语言是 zh-CN（src/app/(frontend)/layout.tsx:46），价格文案都是人民币，故币种固定 CNY。
 */
function parsePrice(priceLabel: unknown): number | undefined {
  const label = cleanText(priceLabel)
  if (!label) return undefined
  const matched = /^[¥￥]?\s*(\d+(?:\.\d+)?)$/.exec(label)
  if (!matched) return undefined
  const price = Number(matched[1])
  return Number.isFinite(price) ? price : undefined
}

/** 渲染一个或多个 JSON-LD 节点；null/空数组时不渲染任何东西。 */
export function JsonLd({
  data,
}: {
  data?: JsonLdNode | null | Array<JsonLdNode | null | undefined>
}) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(
    (node): node is JsonLdNode => Boolean(node),
  )
  if (nodes.length === 0) return null

  const json = JSON.stringify(
    nodes.map((node) => ({ '@context': 'https://schema.org', ...node })),
  ).replace(/</g, '\\u003c')

  return (
    <script
      dangerouslySetInnerHTML={{ __html: json }}
      type="application/ld+json"
    />
  )
}

/** 作者/主体。sites 集合没有独立作者字段，用站点名充当主体名。 */
export function personNode(site: any, baseUrl: string): JsonLdNode | null {
  const name = cleanText(site?.name)
  if (!name) return null

  const node: JsonLdNode = { '@type': 'Person', name }

  const description =
    cleanText(site?.brand?.tagline) || cleanText(site?.brand?.description)
  if (description) node.description = description
  if (baseUrl) node.url = absoluteUrl(baseUrl, '/')

  const sameAs = (Array.isArray(site?.socialLinks) ? site.socialLinks : [])
    .map((link: any) => cleanText(link?.url))
    .filter((url: string) => /^https?:\/\//i.test(url))
  if (sameAs.length > 0) node.sameAs = sameAs

  return node
}

/** 站点节点，含站内搜索的 SearchAction（/search?q={query}）。 */
export function websiteNode(site: any, baseUrl: string): JsonLdNode | null {
  const name = cleanText(site?.name)
  if (!name) return null

  const node: JsonLdNode = {
    '@type': 'WebSite',
    name,
    inLanguage: 'zh-CN',
  }
  if (baseUrl) node.url = absoluteUrl(baseUrl, '/')

  const description =
    cleanText(site?.seo?.description) || cleanText(site?.brand?.description)
  if (description) node.description = description

  if (baseUrl) {
    node.potentialAction = {
      '@type': 'SearchAction',
      target: absoluteUrl(baseUrl, '/search?q={query}'),
      'query-input': 'required name=query',
    }
  }

  return node
}

/** 文章详情（/news/[slug]）。 */
export function articleNode(
  doc: any,
  site: any,
  baseUrl: string,
): JsonLdNode | null {
  const headline = cleanText(doc?.title)
  if (!headline) return null

  const slug = cleanText(doc?.slug)
  const node: JsonLdNode = { '@type': 'Article', headline }

  if (slug && baseUrl) {
    const url = absoluteUrl(baseUrl, `/news/${slug}`)
    node.url = url
    node.mainEntityOfPage = url
  }

  const excerpt = cleanText(doc?.excerpt)
  if (excerpt) node.description = excerpt

  const datePublished = isoDate(doc?.publishedDate)
  if (datePublished) node.datePublished = datePublished

  const dateModified = isoDate(doc?.updatedAt)
  if (dateModified) node.dateModified = dateModified

  const authorName = cleanText(site?.name)
  if (authorName) node.author = { '@type': 'Person', name: authorName }

  const image = absoluteMediaUrl(baseUrl, doc?.cover)
  if (image) node.image = image

  const sourceName = cleanText(doc?.sourceName)
  const sourceUrl = cleanText(doc?.sourceUrl)
  if (sourceUrl && /^https?:\/\//i.test(sourceUrl)) {
    node.isBasedOn = sourceName
      ? { '@type': 'CreativeWork', name: sourceName, url: sourceUrl }
      : sourceUrl
  }

  return node
}

/** 产品/服务详情（/products/[slug]）。只有 priceLabel 能解析成数字时才给 offers。 */
export function productNode(
  doc: any,
  site: any,
  baseUrl: string,
): JsonLdNode | null {
  const name = cleanText(doc?.name)
  if (!name) return null

  const node: JsonLdNode = { '@type': 'Product', name }

  const summary = cleanText(doc?.summary)
  if (summary) node.description = summary

  const slug = cleanText(doc?.slug)
  if (slug && baseUrl) node.url = absoluteUrl(baseUrl, `/products/${slug}`)

  const image = absoluteMediaUrl(baseUrl, doc?.cover)
  if (image) node.image = image

  const price = parsePrice(doc?.priceLabel)
  if (price !== undefined) {
    node.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'CNY',
      ...(slug && baseUrl
        ? { url: absoluteUrl(baseUrl, `/products/${slug}`) }
        : {}),
    }
  }

  return node
}

/** 面包屑（至少两个层级才有意义）。 */
export function breadcrumbNode(
  items: Array<{ name: string; url?: string }>,
): JsonLdNode | null {
  const elements = items
    .filter((item) => cleanText(item?.name))
    .map((item, index) => {
      const element: JsonLdNode = {
        '@type': 'ListItem',
        position: index + 1,
        name: cleanText(item.name),
      }
      if (item.url) element.item = item.url
      return element
    })

  if (elements.length < 2) return null
  return { '@type': 'BreadcrumbList', itemListElement: elements }
}
