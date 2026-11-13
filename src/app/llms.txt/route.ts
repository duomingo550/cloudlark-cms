import { getSections } from '@/lib/content'
import { getPayloadClient, getPrimarySite } from '@/lib/payload'
import { absoluteUrl, resolveBaseUrl } from '@/lib/siteUrl'

/**
 * 运行时生成的 /llms.txt（llmstxt.org 约定：纯文本、给 AI 读的站点说明）。
 *
 * GEO 的前提是「AI 能拿到结构化、可引用、且真实的事实」。这里的每一条都来自数据库
 * 现有字段：sites 的定位/描述、sections 的已启用栏目、products 的名称与价格文案。
 * 没有的字段就不写，绝不拼一句看起来像事实的话。
 */
export const dynamic = 'force-dynamic'

/** 站点简介只统计这几类对外内容。 */
const COUNTED_COLLECTIONS = [
  { collection: 'tools', label: '工具' },
  { collection: 'articles', label: '资讯' },
  { collection: 'tutorials', label: '教程' },
  { collection: 'products', label: '产品与服务' },
] as const

/** products.kind 的中文名，用于事实条目里的类型说明。 */
const PRODUCT_KIND_LABEL: Record<string, string> = {
  agent: '智能体',
  course: '课程',
  service: '服务',
  'digital-product': '数字产品',
  membership: '会员社群',
}

const TEXT_HEADERS = { 'content-type': 'text/plain; charset=utf-8' }

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** 只保留有内容的行，避免输出里出现只有空白的条目。 */
function bulletLines(lines: string[]): string {
  return lines.filter((line) => line.trim().length > 0).join('\n')
}

export async function GET() {
  const site = await getPrimarySite()
  const updatedAt = new Date().toISOString()

  if (!site) {
    return new Response(
      `# 站点尚未初始化\n\n本文件自动生成，最后更新 ${updatedAt}\n`,
      { headers: TEXT_HEADERS },
    )
  }

  const base = resolveBaseUrl(site.publicUrl)
  const payload = await getPayloadClient()

  const [sections, productResult, ...counts] = await Promise.all([
    getSections(site.id),
    payload.find({
      collection: 'products',
      depth: 0,
      limit: 3,
      overrideAccess: true,
      pagination: false,
      sort: 'statusLabel',
      where: {
        and: [
          { site: { equals: site.id } },
          { _status: { equals: 'published' } },
        ],
      },
    }),
    ...COUNTED_COLLECTIONS.map(({ collection }) =>
      payload.count({
        collection: collection as any,
        overrideAccess: true,
        where: {
          and: [
            { site: { equals: site.id } },
            { _status: { equals: 'published' } },
          ],
        },
      }),
    ),
  ])

  const name = text(site.name)
  const seoTitle = text(site.seo?.title)
  const description = text(site.seo?.description) || text(site.brand?.description)
  const tagline = text(site.brand?.tagline)

  const sectionLinks = sections
    .filter((section) => section.kind !== 'external')
    .map((section) => {
      const routePath = String(section.routePath || '').trim().replace(/^\/+/, '')
      const label = text(section.label) || routePath
      return routePath ? `- [${label}](${absoluteUrl(base, `/${routePath}`)})` : ''
    })
    .filter(Boolean)

  const countFact =
    counts.length > 0
      ? `站点当前已发布${COUNTED_COLLECTIONS.map((item, index) => {
          const total = counts[index]?.totalDocs ?? 0
          return `${item.label} ${total} 条`
        }).join('、')}（仅统计已发布内容）。`
      : ''

  const productFacts = productResult.docs.flatMap((product: any) => {
    const productName = text(product.name)
    if (!productName) return []
    const kindLabel = PRODUCT_KIND_LABEL[product.kind] || '产品/服务'
    const priceLabel = text(product.priceLabel)
    return [
      priceLabel
        ? `「${productName}」是本站的${kindLabel}，价格：${priceLabel}。`
        : `「${productName}」是本站的${kindLabel}。`,
    ]
  })

  // 事实清单：站点描述打头，再接产品与服务前 3 条；不足 3 条时补内容规模一条。
  const facts = [description ? `站点简介：${description}` : '', ...productFacts]
  if (facts.filter(Boolean).length < 3) facts.push(countFact)

  const factLines = facts
    .filter(Boolean)
    .map((fact, index) => `${index + 1}. ${fact}`)
    .join('\n')

  const blocks = [
    `# ${name}`,
    `> ${tagline || seoTitle || description || name}`,
    `## 站点定位\n${bulletLines([
      name ? `- 站点名称：${name}` : '',
      seoTitle ? `- 定位标题：${seoTitle}` : '',
      tagline ? `- 一句话定位：${tagline}` : '',
      description ? `- 站点描述：${description}` : '',
      // sites 集合没有独立的作者字段（src/collections/Sites.ts），按约定回落为站点名。
      name ? `- 作者/主体：${name}` : '',
      base ? `- 站点地址：${absoluteUrl(base, '/')}` : '',
    ])}`,
  ]

  if (sectionLinks.length > 0) {
    blocks.push(`## 主要栏目\n${sectionLinks.join('\n')}`)
  }
  if (factLines) {
    blocks.push(`## 可引用事实\n${factLines}`)
  }
  // AI 要知道「怎么在这站上查东西」，比知道栏目名更有用。
  if (base) {
    blocks.push(
      `## 检索入口\n${bulletLines([
        `- 站内搜索：${absoluteUrl(base, '/search')}?q=关键词（覆盖工具、资讯、教程、技能、产品等已发布内容）`,
        `- 全站索引：${absoluteUrl(base, '/sitemap.xml')}`,
        `- 订阅：${absoluteUrl(base, '/rss.xml')}`,
      ])}`,
    )
  }
  blocks.push(
    `## 抓取说明\n${bulletLines([
      `- 允许各类搜索引擎与 AI 爬虫抓取正文，详见 ${base ? absoluteUrl(base, '/robots.txt') : '/robots.txt'}`,
      '- 后台路径 /admin 与 /api/ 不在抓取范围内',
      '- 本文件随内容更新自动重新生成，无需缓存',
    ])}`,
  )
  blocks.push(`---\n本文件自动生成，最后更新 ${updatedAt}`)

  // 块之间留空行，符合 Markdown 段落规则（爬虫按行读也不会粘成一段）。
  return new Response(`${blocks.join('\n\n')}\n`, { headers: TEXT_HEADERS })
}
