import type { Metadata } from 'next'

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
  const base = (site.publicUrl || process.env.NEXT_PUBLIC_CMS_URL || '').replace(
    /\/+$/,
    '',
  )
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
