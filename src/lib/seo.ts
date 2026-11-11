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
    openGraph: {
      title,
      description,
      url: canonical,
      images,
      siteName: site.name,
      type: 'website',
    },
  }
}
