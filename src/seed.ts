import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from './payload.config'

type LegacyData = {
  COLORS: string[]
  CATS: Array<{
    name: string
    desc: string
    tools: Array<{ n: string; d: string; u: string }>
  }>
  NEWS: Array<{
    d: string
    m: string
    lbl: string
    t: string
    p: string
    src: string
    body: string
  }>
  COURSES: Array<{ t: string; d: string; s: string }>
  PATHS: Array<{ t: string; d: string; s: string }>
  STORE: Array<{ n: string; d: string; p: string; s: string }>
  AGENTS: Array<{ n: string; d: string; s: string }>
  SKILLS: Array<{
    g: string
    desc: string
    items: Array<{ n: string; d: string; lv: string }>
  }>
  FEAT: Array<{ n: string; d: string; u: string }>
}

const payload = await getPayload({ config })
const legacyPath = path.resolve(process.cwd(), 'data', 'demo-content.json')
const data = JSON.parse(fs.readFileSync(legacyPath, 'utf8')) as LegacyData

const categorySlugs = [
  'chat',
  'image',
  'video',
  'coding',
  'productivity',
  'agents',
  'ecommerce',
  'audio',
]

const productSlugs: Record<string, string> = {
  独立开发者官网模板: 'indie-website-template',
  混合作品展示模板: 'mixed-media-template',
  'AI 入门课程': 'ai-basics-course',
  定制小工具: 'custom-tool',
  知识库问答智能体: 'knowledge-base-agent',
  内容整理智能体: 'content-organizer-agent',
  客户线索整理智能体: 'lead-organizer-agent',
}

const articleSlugs = [
  'ai-agents-at-work',
  'one-person-product-team',
  'mixed-media-personal-brand',
  'small-business-website-trust',
]

function textNode(text: string) {
  return {
    type: 'text',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function lexicalFromParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.filter(Boolean).map((text) => ({
        type: 'paragraph',
        children: [textNode(text)],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function richTextBlock(text: string) {
  return {
    blockType: 'richText',
    content: lexicalFromParagraphs(text.split(/\n+/)),
  }
}

async function findOne(collection: string, where: any) {
  const result = await payload.find({
    collection: collection as any,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where,
  })
  return result.docs[0] as any
}

async function upsert(
  collection: string,
  siteId: string,
  slug: string,
  createData: Record<string, unknown>,
) {
  const existing = await findOne(collection, {
    and: [
      { site: { equals: siteId } },
      { slug: { equals: slug } },
    ],
  })
  if (existing) {
    return payload.update({
      collection: collection as any,
      id: existing.id,
      data: createData as any,
      overrideAccess: true,
    })
  }
  return payload.create({
    collection: collection as any,
    data: {
      ...createData,
      site: siteId,
      slug,
    } as any,
    overrideAccess: true,
  })
}

async function ensureUser() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    console.error(
      '缺少 SEED_ADMIN_EMAIL 或 SEED_ADMIN_PASSWORD：请先自行设置管理员邮箱和口令，再运行 pnpm seed。',
    )
    process.exit(1)
  }
  const existing = await findOne('users', { email: { equals: email } })
  if (existing) {
    if (process.env.SEED_RESET_ADMIN_PASSWORD === 'true') {
      return payload.update({
        collection: 'users',
        id: existing.id,
        data: { password },
        overrideAccess: true,
      })
    }
    return existing
  }
  return payload.create({
    collection: 'users',
    data: {
      email,
      name: '云雀管理员',
      password,
      platformRole: 'admin',
    },
    overrideAccess: true,
  })
}

async function ensureSite() {
  const existing = await findOne('sites', { slug: { equals: 'cloud-lark-demo' } })
  if (existing) return existing
  return payload.create({
    collection: 'sites',
    data: {
      name: '云雀 AI 学堂',
      slug: 'cloud-lark-demo',
      domains: [{ host: 'localhost' }, { host: '127.0.0.1' }],
      isDefault: true,
      publicUrl: 'http://localhost:3000',
      brand: {
        tagline: '少走弯路，先用对工具',
        description:
          '面向 AI 创业者、独立开发者和内容创作者的学习与作品门户。',
        primaryColor: '#1f7a5a',
        footerText: '云雀 CMS · 一个开源演示站点',
      },
      seo: {
        title: '云雀 AI 学堂 - AI 工具、内容与创作者作品',
        description:
          'AI 工具导航、前沿资讯、零基础教程、数字产品与创作者作品。',
      },
      storageQuotaMb: 1024,
    },
    overrideAccess: true,
  })
}

const admin = await ensureUser()
const site = await ensureSite()

const membership = await findOne('memberships', {
  and: [
    { user: { equals: admin.id } },
    { site: { equals: site.id } },
  ],
})
if (!membership) {
  await payload.create({
    collection: 'memberships',
    data: {
      user: admin.id,
      site: site.id,
      role: 'owner',
    },
    overrideAccess: true,
  })
}

const sections = [
  {
    key: 'tools',
    label: '工具导航',
    kind: 'collection',
    sourceCollection: 'tools',
    routePath: 'tools',
    templateKey: 'tool-grid',
    position: 10,
    showOnHome: true,
  },
  {
    key: 'news',
    label: '前沿资讯',
    kind: 'collection',
    sourceCollection: 'articles',
    routePath: 'news',
    templateKey: 'article-list',
    position: 20,
    showOnHome: true,
  },
  {
    key: 'courses',
    label: '我的教程',
    kind: 'collection',
    sourceCollection: 'tutorials',
    routePath: 'tutorials',
    templateKey: 'list',
    position: 30,
    showOnHome: true,
  },
  {
    key: 'learning',
    label: '学习路线',
    kind: 'collection',
    sourceCollection: 'learning-paths',
    routePath: 'learning',
    templateKey: 'list',
    position: 40,
    showOnHome: true,
  },
  {
    key: 'agents',
    label: '智能体',
    kind: 'collection',
    sourceCollection: 'products',
    filter: 'kind=agent',
    routePath: 'agents',
    templateKey: 'product-grid',
    position: 50,
    showOnHome: true,
  },
  {
    key: 'skills',
    label: 'Skill',
    kind: 'collection',
    sourceCollection: 'skills',
    routePath: 'skills',
    templateKey: 'skill-grid',
    position: 60,
    showOnHome: true,
  },
  {
    key: 'store',
    label: '数字商店',
    kind: 'collection',
    sourceCollection: 'products',
    routePath: 'store',
    templateKey: 'product-grid',
    position: 70,
    showOnHome: true,
  },
  {
    key: 'about',
    label: '关于站长',
    kind: 'page',
    routePath: 'about',
    templateKey: 'list',
    position: 80,
    showInNav: false,
    showOnHome: false,
  },
  {
    key: 'music',
    label: '音乐作品',
    kind: 'collection',
    sourceCollection: 'tracks',
    routePath: 'music',
    templateKey: 'track-list',
    position: 90,
    visible: false,
    showOnHome: false,
  },
  {
    key: 'comics',
    label: '漫画',
    kind: 'collection',
    sourceCollection: 'comic-series',
    routePath: 'comics',
    templateKey: 'comic-list',
    position: 100,
    visible: false,
    showOnHome: false,
  },
]

for (const section of sections) {
  const existing = await findOne('sections', {
    and: [
      { site: { equals: site.id } },
      { key: { equals: section.key } },
    ],
  })
  const sectionData = {
    ...section,
    site: site.id,
    visible: section.visible ?? true,
    showInNav: section.showInNav ?? true,
  }
  if (existing) {
    await payload.update({
      collection: 'sections',
      id: existing.id,
      data: sectionData as any,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'sections',
      data: sectionData as any,
      overrideAccess: true,
    })
  }
}

const featured = new Set(data.FEAT.map((item) => item.u))
let toolCount = 0

for (const [categoryIndex, category] of data.CATS.entries()) {
  const categorySlug = categorySlugs[categoryIndex] || `category-${categoryIndex + 1}`
  const term = await upsert('terms', site.id, categorySlug, {
    name: category.name,
    taxonomy: 'category',
    description: category.desc,
  })

  for (const [toolIndex, tool] of category.tools.entries()) {
    const hostnameSlug = new URL(tool.u).hostname
      .replace(/^www\./, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
    const slugBase = hostnameSlug || `tool-${categoryIndex + 1}-${toolIndex + 1}`
    const slug = `${slugBase}-${categorySlug}`
    await upsert('tools', site.id, slug, {
      name: tool.n,
      summary: tool.d,
      url: tool.u,
      pricing: 'unknown',
      terms: [term.id],
      featuredRank: featured.has(tool.u) ? data.FEAT.findIndex((item) => item.u === tool.u) + 1 : 0,
      _status: 'published',
    })
    toolCount += 1
  }
}

for (const [index, article] of data.NEWS.entries()) {
  const slug = articleSlugs[index] || `news-${index + 1}`
  const tag = await upsert('terms', site.id, `tag-${index + 1}`, {
    name: article.lbl,
    taxonomy: 'tag',
  })
  const day = article.d.padStart(2, '0')
  await upsert('articles', site.id, slug, {
    title: article.t,
    excerpt: article.p,
    body: [richTextBlock(article.body)],
    terms: [tag.id],
    sourceUrl: article.src,
    sourceName: 'AI 前沿资讯',
    publishedDate: `2026-10-${day}T08:00:00.000Z`,
    featuredRank: 0,
    _status: 'published',
  })
}

for (const [index, course] of data.COURSES.entries()) {
  await upsert('tutorials', site.id, `tutorial-${index + 1}`, {
    title: course.t,
    excerpt: course.d,
    durationMinutes: 0,
    body: [richTextBlock(course.d)],
    _status: index < 2 ? 'published' : 'draft',
  })
}

for (const [index, route] of data.PATHS.entries()) {
  await upsert('learning-paths', site.id, `path-${index + 1}`, {
    title: route.t,
    description: route.d,
    position: index + 1,
    steps: [
      {
        title: route.t,
        description: route.d,
      },
    ],
    _status: 'published',
  })
}

for (const [index, skillGroup] of data.SKILLS.entries()) {
  for (const [itemIndex, item] of skillGroup.items.entries()) {
    await upsert('skills', site.id, `skill-${index + 1}-${itemIndex + 1}`, {
      name: item.n,
      group: skillGroup.g,
      description: item.d,
      level: item.lv,
      position: index * 100 + itemIndex + 1,
      _status: 'published',
    })
  }
}

const productMap = new Map<
  string,
  {
    name: string
    description: string
    kind: string
    priceLabel?: string
    statusLabel: string
    slug: string
  }
>()

for (const item of data.STORE) {
  productMap.set(item.n, {
    name: item.n,
    description: item.d,
    kind: item.n.includes('课程')
      ? 'course'
      : item.n.includes('社群')
        ? 'membership'
        : item.n.includes('定制')
          ? 'service'
          : 'digital-product',
    priceLabel: item.p,
    statusLabel:
      item.p === '按需报价'
        ? 'consult'
        : item.p === '待上架'
          ? 'coming-soon'
          : 'building',
    slug: productSlugs[item.n] || `product-${productMap.size + 1}`,
  })
}

for (const item of data.AGENTS) {
  const existing = productMap.get(item.n)
  const slug = productSlugs[item.n] || `agent-${productMap.size + 1}`
  const sameProduct = [...productMap.values()].find(
    (product) => product.slug === slug,
  )
  if (sameProduct) {
    sameProduct.kind = 'agent'
    if (item.s === '可咨询') sameProduct.statusLabel = 'consult'
    continue
  }
  productMap.set(item.n, {
    name: item.n,
    description: item.d,
    kind: 'agent',
    priceLabel: existing?.priceLabel || '可咨询',
    statusLabel: item.s === '可咨询' ? 'consult' : 'building',
    slug,
  })
}

for (const product of productMap.values()) {
  await upsert('products', site.id, product.slug, {
    name: product.name,
    kind: product.kind,
    summary: product.description,
    priceLabel: product.priceLabel,
    statusLabel: product.statusLabel,
    body: [richTextBlock(product.description)],
    featuredRank: 0,
    _status: 'published',
  })
}

await upsert('pages', site.id, 'about', {
  title: '关于 Cloud Lark CMS',
  excerpt: '一个面向 AI 创业者和小微企业的轻量混合媒体 CMS。',
  body: [
    richTextBlock(
      'Cloud Lark CMS 是一个开源的轻量内容管理系统，使用 Next.js、Payload、TypeScript 和 PostgreSQL/SQLite 构建。',
    ),
    richTextBlock(
      '它希望解决个人创业者和小微企业官网的常见问题：内容类型单一、混合媒体难管理、后台过重，以及缺少可配置栏目。',
    ),
    richTextBlock(
      '当前版本是 Early Alpha，适合体验、反馈和二次开发，不建议未经验证直接用于生产环境。',
    ),
  ],
  _status: 'published',
})

const demoTrack = await findOne('tracks', {
  and: [
    { site: { equals: site.id } },
    { slug: { equals: 'demo-session' } },
  ],
})
if (!demoTrack) {
  const audioPath = path.resolve(process.cwd(), 'data', 'demo-tone.mp3')
  if (fs.existsSync(audioPath)) {
    const audio = await payload.create({
      collection: 'audio-assets',
      data: {
        title: 'Demo Session',
        artist: 'Cloud Lark',
        site: site.id,
      },
      filePath: audioPath,
      overrideAccess: true,
    })
    await payload.create({
      collection: 'tracks',
      data: {
        site: site.id,
        title: 'Demo Session',
        slug: 'demo-session',
        artist: 'Cloud Lark',
        album: 'Demo Sessions',
        audio: audio.id,
        license: 'CC0 1.0',
        description: [
          richTextBlock(
            '这是一段用于验证音频上传和播放器功能的演示音轨。',
          ),
        ],
        _status: 'published',
      } as any,
      overrideAccess: true,
    })
  }
}

console.log(
  JSON.stringify(
    {
      site: site.slug,
      admin: admin.email,
      tools: toolCount,
      articles: data.NEWS.length,
      tutorials: data.COURSES.length,
      paths: data.PATHS.length,
      skills: data.SKILLS.reduce((total, group) => total + group.items.length, 0),
      products: productMap.size,
      sections: sections.length,
    },
    null,
    2,
  ),
)

process.exit(0)
