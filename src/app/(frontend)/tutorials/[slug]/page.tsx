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
  const tutorial = await getEntry('tutorials', slug, site.id)
  return pageMetadata({
    site,
    doc: tutorial,
    fallbackTitle: '教程',
    path: `/tutorials/${slug}`,
  })
}

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const tutorial = await getEntry('tutorials', slug, site.id)
  if (!tutorial) notFound()
  return (
    <EditorialDetail
      backHref="/tutorials"
      backLabel="返回教程列表"
      doc={tutorial}
      eyebrow="我的教程"
    />
  )
}
