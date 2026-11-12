import crypto from 'crypto'
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

const demoAssetsDir = path.resolve(process.cwd(), 'data', 'demo-assets')

/**
 * 上传集合（media / audio-assets / download-assets）没有 slug，
 * 幂等键改成「站点 + 指定字段」，避免每次 seed 重复上传同一份文件。
 */
async function ensureUpload(
  collection: 'media' | 'audio-assets' | 'download-assets',
  siteId: string | number,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
  filePath: string,
) {
  const existing = await findOne(collection, {
    and: [{ site: { equals: siteId } }, where],
  })
  if (existing) return existing as any
  if (!fs.existsSync(filePath)) return null
  return (await payload.create({
    collection: collection as any,
    data: { ...data, site: siteId } as any,
    filePath,
    overrideAccess: true,
  })) as any
}

function fileSha256(filePath: string) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

async function countForSite(collection: string, siteId: string | number) {
  const result = await payload.count({
    collection: collection as any,
    overrideAccess: true,
    where: { site: { equals: siteId } },
  })
  return result.totalDocs
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
    key: 'videos',
    label: '视频',
    kind: 'collection',
    sourceCollection: 'videos',
    routePath: 'videos',
    templateKey: 'list',
    position: 35,
    visible: true,
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
    visible: true,
    showInNav: true,
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
    visible: true,
    showInNav: true,
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

/*
 * ── 演示内容：音乐 / 漫画 / 视频 / 下载 ─────────────────────────────────────
 *
 * 目标：全新安装跑一次 `pnpm seed`，演示站就能看到每一种内容类型长什么样。
 * 三条硬规则：
 * 1. 幂等：上传集合用「站点 + 业务键」判重，内容集合沿用 upsert，重跑不翻倍。
 * 2. 不往仓库塞大文件：封面一律留空（前台有首字色块兜底），音频复用仓库里
 *    已有的 data/demo-tone.mp3，漫画页与下载文件是 data/demo-assets/ 下的
 *    几 KB 占位文件。
 * 3. 文案全部虚构：没有人名、联系方式、真实客户或支付信息。
 */

const demoTonePath = path.resolve(process.cwd(), 'data', 'demo-tone.mp3')
/** demo-tone.mp3 实测 128kbps / 44.1kHz，约 4.07 秒。 */
const DEMO_TONE_SECONDS = 4

// ── 音乐：3 条 ──────────────────────────────────────────────────────────────
//
// Tracks.audio 是必填关系字段，集合里也没有「外链音频」字段，所以三条音轨
// 只能走 audio-assets 上传；这里**不新增二进制文件**，三条都复用仓库里已有
// 的 4 秒正弦波小样（CC0），只是各建一条带标题/时长的音频记录。
const demoTracks = [
  {
    slug: 'demo-session',
    title: 'Demo Session',
    artist: 'Cloud Lark',
    album: 'Demo Sessions',
    releaseDate: '2026-10-01T08:00:00.000Z',
    description:
      '一段用于验证音频上传与播放器功能的演示音轨，由合成器生成，不包含人声。',
    lyrics: '',
    credits: '生成：Cloud Lark Demo Tone（虚构演示署名）',
  },
  {
    slug: 'paper-moon',
    title: '纸月亮',
    artist: '云雀合成器',
    album: '演示小品集',
    releaseDate: '2026-10-08T08:00:00.000Z',
    description:
      '一首写给深夜通勤的合成器小品：缓慢的琶音、轻微的磁带噪声，以及一段始终没有寄出的旋律。',
    lyrics:
      '纸做的月亮挂在换乘通道\n末班车开走以后 城市才开始呼吸\n我把没说完的话折成小船\n放进你明天要经过的风里',
    credits: '作曲、编曲：云雀合成器（虚构演示署名）\n母带：演示工作室（虚构）',
  },
  {
    slug: 'slow-orbit',
    title: '慢速星球',
    artist: '云雀合成器',
    album: '演示小品集',
    releaseDate: '2026-10-15T08:00:00.000Z',
    description:
      '把节拍放到最慢，只留下低频和呼吸之间的空白。用作音乐栏目列表、详情页与播放器排版的测试素材。',
    lyrics: '',
    credits: '作曲、编曲：云雀合成器（虚构演示署名）',
  },
]

for (const demo of demoTracks) {
  const audio = await ensureUpload(
    'audio-assets',
    site.id,
    { title: { equals: demo.title } },
    {
      title: demo.title,
      artist: demo.artist,
      durationSeconds: DEMO_TONE_SECONDS,
      license: 'CC0 1.0',
      rightsOwner: 'Cloud Lark Demo（虚构演示署名）',
    },
    demoTonePath,
  )
  if (!audio) {
    console.warn(`[seed] 缺少 data/demo-tone.mp3，跳过音轨「${demo.title}」`)
    continue
  }
  // 老版本 seed 建过同名音频但没有时长；补齐一次，重跑不会反复写。
  if (!audio.durationSeconds) {
    await payload.update({
      collection: 'audio-assets',
      id: audio.id,
      data: { durationSeconds: DEMO_TONE_SECONDS },
      overrideAccess: true,
    })
  }
  await upsert('tracks', site.id, demo.slug, {
    title: demo.title,
    artist: demo.artist,
    album: demo.album,
    releaseDate: demo.releaseDate,
    audio: audio.id,
    license: 'CC0 1.0',
    lyrics: demo.lyrics || undefined,
    credits: demo.credits,
    description: [richTextBlock(demo.description)],
    streamingLinks: [
      {
        label: '示例音乐平台',
        url: `https://example.com/cloud-lark/${demo.slug}`,
      },
    ],
    _status: 'published',
  })
}

// ── 漫画：2 个系列 × 3 章 ───────────────────────────────────────────────────
//
// 章节正文用 comicReader 区块。该区块的 images 至少 1 行，所以必须上传页面
// 图片：data/demo-assets/comic/page-{1,2,3}.png 是 600×900 的占位页（每张
// 7–8 KB，调色板 PNG），六个章节共用这三张，alt 文本按章节区分。
// 占位图缺失时退化成富文本，seed 不会因此失败。
const comicPages: any[] = []
for (const page of [1, 2, 3]) {
  const media = await ensureUpload(
    'media',
    site.id,
    { alt: { equals: `示例漫画占位页 ${page}` } },
    { alt: `示例漫画占位页 ${page}` },
    path.join(demoAssetsDir, 'comic', `page-${page}.png`),
  )
  if (media) comicPages.push(media)
}

const demoComicSeries = [
  {
    slug: 'stardust-postman',
    title: '星尘邮差',
    status: 'ongoing',
    synopsis:
      '在废弃空间站之间送信的邮差，发现每一封迟到十年的信，写着的都是尚未发生的未来。',
    chapters: [
      '第一封信 · 迟到的投递',
      '第二封信 · 错位的地址',
      '第三封信 · 无人签收',
    ],
  },
  {
    slug: 'moon-kitchen',
    title: '月亮食堂',
    status: 'completed',
    synopsis:
      '月球背面唯一还在营业的小食堂，只在每个月的最后一晚开门，招待迷路的旅人。',
    chapters: [
      '第一碗 · 月面味增汤',
      '第二碗 · 环形的蛋包饭',
      '第三碗 · 打烊前的甜点',
    ],
  },
]

for (const demo of demoComicSeries) {
  // 封面刻意留空：前台用「漫」字色块兜底，仓库里不放封面图。
  const comicSeriesDoc = await upsert('comic-series', site.id, demo.slug, {
    title: demo.title,
    synopsis: demo.synopsis,
    status: demo.status,
    _status: 'published',
  })

  for (const [index, chapterTitle] of demo.chapters.entries()) {
    const chapterNumber = index + 1
    const body = comicPages.length
      ? [
          {
            blockType: 'comicReader',
            readingMode: 'vertical',
            images: comicPages.map((page, pageIndex) => ({
              image: page.id,
              alt: `《${demo.title}》第 ${chapterNumber} 章 第 ${pageIndex + 1} 页`,
            })),
          },
        ]
      : [
          richTextBlock(
            `《${demo.title}》第 ${chapterNumber} 章：演示占位正文。漫画页图片缺失时由这段文字兜底。`,
          ),
        ]

    await upsert(
      'comic-chapters',
      site.id,
      `${demo.slug}-ch${chapterNumber}`,
      {
        series: comicSeriesDoc.id,
        title: chapterTitle,
        chapterNumber,
        body,
        publishedDate: `2026-10-${String(10 + index).padStart(2, '0')}T08:00:00.000Z`,
        _status: 'published',
      },
    )
  }
}

// ── 视频：3 条，全部用公开外链 ──────────────────────────────────────────────
//
// 不传任何视频文件。三条都指向 B 站上**已核实可访问**的开放版权动画短片
// （Blender 基金会，CC 授权），既能演示 B 站官方播放器嵌入，也不会出现
// 404/私有视频。标题写成「公开演示短片」，避免把演示素材当成站点自有作品。
const demoVideos = [
  {
    slug: 'demo-big-buck-bunny',
    title: '大雄兔 · 公开演示短片',
    videoUrl: 'https://www.bilibili.com/video/BV1DT4y1z7a1',
    duration: 635,
    publishedDate: '2026-10-05T08:00:00.000Z',
    description:
      'Blender 基金会 2008 年开放版权动画短片（4K 版），用于验证视频列表、详情页和 B 站官方播放器嵌入。',
    body: '这条视频没有上传文件，videoUrl 指向 B 站公开页面，详情页会自动换成官方播放器地址。',
  },
  {
    slug: 'demo-sintel',
    title: '辛特尔 · 公开演示短片',
    videoUrl: 'https://www.bilibili.com/video/BV1134y1h7EU',
    duration: 889,
    publishedDate: '2026-10-12T08:00:00.000Z',
    description:
      'Blender 基金会 2010 年开放版权动画短片（4K 版），用于验证多条视频在列表中的排序与时长展示。',
    body: '第二条外链视频：用来确认列表排序（按发布日期倒序）、时长格式化与详情页排版。',
  },
  {
    slug: 'demo-elephants-dream',
    title: '大象之梦 · 公开演示短片',
    videoUrl: 'https://www.bilibili.com/video/BV11s411D7Bi',
    duration: 653,
    publishedDate: '2026-10-19T08:00:00.000Z',
    description:
      'Blender 基金会 2005 年开放版权动画短片，作为第三条演示视频，补足列表页的网格排布。',
    body: '第三条外链视频：三条视频刚好能验证列表页在 1/2/3 条内容时的网格表现。',
  },
]

for (const demo of demoVideos) {
  // 封面留空：列表卡片用「▶」色块兜底。
  await upsert('videos', site.id, demo.slug, {
    title: demo.title,
    videoUrl: demo.videoUrl,
    duration: demo.duration,
    description: demo.description,
    body: [richTextBlock(demo.body)],
    publishedDate: demo.publishedDate,
    _status: 'published',
  })
}

// ── 下载：2 条 ──────────────────────────────────────────────────────────────
//
// download-assets 的 upload.mimeTypes 只接受 zip/pdf，所以占位文件不能是
// .txt/.md：data/demo-assets/ 下的两个 PDF 是手工生成的单页占位文档
// （各约 2 KB，纯 ASCII、Helvetica、可正常解析），seed 时按 filePath 上传。
// checksum 顺手写成真实 SHA-256，方便演示「校验和」字段。
const demoDownloads = [
  {
    title: '云雀 CMS 上手指南（示例 PDF）',
    fileName: 'demo-checklist.pdf',
  },
  {
    title: '演示站视觉规范（示例 PDF）',
    fileName: 'demo-style-guide.pdf',
  },
]

for (const demo of demoDownloads) {
  const filePath = path.join(demoAssetsDir, demo.fileName)
  const asset = await ensureUpload(
    'download-assets',
    site.id,
    { title: { equals: demo.title } },
    {
      title: demo.title,
      version: '1.0.0',
      accessPolicy: 'public',
      checksum: fs.existsSync(filePath) ? fileSha256(filePath) : undefined,
    },
    filePath,
  )
  if (!asset) {
    console.warn(
      `[seed] 缺少 data/demo-assets/${demo.fileName}，跳过下载文件「${demo.title}」`,
    )
  }
}

const counts = {
  tools: await countForSite('tools', site.id),
  articles: await countForSite('articles', site.id),
  tutorials: await countForSite('tutorials', site.id),
  'learning-paths': await countForSite('learning-paths', site.id),
  skills: await countForSite('skills', site.id),
  products: await countForSite('products', site.id),
  sections: await countForSite('sections', site.id),
  tracks: await countForSite('tracks', site.id),
  'comic-series': await countForSite('comic-series', site.id),
  'comic-chapters': await countForSite('comic-chapters', site.id),
  videos: await countForSite('videos', site.id),
  'download-assets': await countForSite('download-assets', site.id),
  media: await countForSite('media', site.id),
  'audio-assets': await countForSite('audio-assets', site.id),
}

console.log(
  JSON.stringify(
    {
      site: site.slug,
      admin: admin.email,
      counts,
    },
    null,
    2,
  ),
)

process.exit(0)
