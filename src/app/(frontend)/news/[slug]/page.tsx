import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EditorialDetail } from '@/components/site/EditorialDetail'
import { getEntry } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

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
  return (
    <EditorialDetail
      backHref="/news"
      backLabel="返回前沿资讯"
      doc={article}
      eyebrow="AI 前沿资讯"
    />
  )
}
