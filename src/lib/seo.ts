import type { Metadata } from 'next'

import { absoluteUrl, resolveBaseUrl } from '@/lib/siteUrl'

export function pageMetadata({
  site,
  doc,
  fallbackTitle,
  path,
}: {
  site: any
  doc?: any
  fallbackTitle?: string
  path?: string
}): Metadata {
  // 与 sitemap/robots/llms.txt 共用同一个根 URL 解析：publicUrl 是本机地址时退回
  // NEXT_PUBLIC_CMS_URL，避免 canonical / openGraph 指向 localhost。
  const base = resolveBaseUrl(site.publicUrl)
  const seo = doc?.seo || {}
  const title = seo.title || doc?.title || doc?.name || fallbackTitle || site.name
  const description =
    seo.description ||
    doc?.excerpt ||
    doc?.summary ||
    site.seo?.description ||
    site.brand?.description ||
    ''
  const image = seo.image?.url || site.seo?.image?.url
  const canonical = path ? `${base}${path}` : undefined

  // 标签 → meta keywords。取不到就整条省略：空的 keywords 比没有更糟。
  const keywords = (Array.isArray(doc?.terms) ? doc.terms : [])
    .map((term: any) =>
      typeof term === 'string'
        ? term.trim()
        : String(term?.title || term?.name || '').trim(),
    )
    .filter(Boolean)

  // 只有资讯详情页声明成 article；其它类型用 website，结构化细节交给 JSON-LD。
  const isArticle = Boolean(path?.startsWith('/news/'))
  const publishedTime = isArticle ? isoTime(doc?.publishedDate) : undefined
  const modifiedTime = isArticle ? isoTime(doc?.updatedAt) : undefined

  // 没有显式分享图时回落到动态生成的 /opengraph-image（src/app/opengraph-image.tsx）。
  // 这里写成绝对 URL 而不是相对路径：相对路径由 metadataBase 补全，而 metadataBase 取的是
  // sites.publicUrl 原值 —— 当它指向 localhost 时不会跟随 resolveBaseUrl 的环境变量兜底，
  // 会出现 canonical 用线上域名、og:image 用 localhost 的错位。absoluteUrl 与 base 同源，
  // 和上面 seo.image 的处理方式保持一致。
  const width = 1200
  const height = 630
  const images = image
    ? [{ url: image.startsWith('http') ? image : `${base}${image}` }]
    : [{ url: absoluteUrl(base, '/opengraph-image'), width, height, alt: title }]

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: site.name ? [{ name: site.name }] : undefined,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((item) => item.url),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images,
      siteName: site.name,
      type: isArticle ? 'article' : 'website',
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
  }
}

/** ISO 8601；非法日期返回 undefined，避免把 "Invalid Date" 写进 meta。 */
function isoTime(value: unknown) {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}
