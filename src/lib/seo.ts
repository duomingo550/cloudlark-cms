import type { Metadata } from 'next'

import { resolveBaseUrl } from '@/lib/siteUrl'

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

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      images: image ? [{ url: image.startsWith('http') ? image : `${base}${image}` }] : undefined,
      siteName: site.name,
      type: 'website',
    },
  }
}
