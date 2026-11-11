import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EditorialDetail } from '@/components/site/EditorialDetail'
import {
  articleNode,
  breadcrumbNode,
  JsonLd,
} from '@/components/site/JsonLd'
import { getEntry } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, resolveBaseUrl } from '@/lib/siteUrl'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return {}
  const article = await getEntry('articles', slug, site.id)
  return pageMetadata({
    site,
    doc: article,
    fallbackTitle: '前沿资讯',
    path: `/news/${slug}`,
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const article = await getEntry('articles', slug, site.id)
  if (!article) notFound()
  const base = resolveBaseUrl(site.publicUrl)
  return (
    <>
      <JsonLd
        data={[
          articleNode(article, site, base),
          breadcrumbNode([
            { name: '首页', url: absoluteUrl(base, '/') },
            { name: '前沿资讯', url: absoluteUrl(base, '/news') },
            { name: article.title, url: absoluteUrl(base, `/news/${slug}`) },
          ]),
        ]}
      />
      <EditorialDetail
        backHref="/news"
        backLabel="返回前沿资讯"
        doc={article}
        eyebrow="AI 前沿资讯"
      />
    </>
  )
}
