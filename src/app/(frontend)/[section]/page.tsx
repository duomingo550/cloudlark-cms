import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { BlockRenderer } from '@/components/site/Blocks'
import { SectionRenderer } from '@/components/site/SectionRenderer'
import {
  getPageBySlug,
  getSectionByPath,
  getSectionEntries,
} from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { safeExternalUrl } from '@/lib/url'

type Props = {
  params: Promise<{ section: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: routePath } = await params
  const data = await getSectionByPath(routePath)
  if (!data?.site || !data.section) return {}
  if (data.section.kind === 'page') {
    const page = await getPageBySlug(routePath, data.site.id)
    return pageMetadata({
      site: data.site,
      doc: page,
      fallbackTitle: data.section.label,
      path: `/${routePath}`,
    })
  }
  return pageMetadata({
    site: data.site,
    fallbackTitle: data.section.label,
    path: `/${routePath}`,
  })
}

export default async function SectionPage({ params }: Props) {
  const { section: routePath } = await params
  const data = await getSectionByPath(routePath)
  if (!data?.site || !data.section) notFound()

  const { site, section } = data
  if (section.kind === 'external') {
    const externalUrl = safeExternalUrl(section.externalUrl)
    if (externalUrl) redirect(externalUrl)
    notFound()
  }

  if (section.kind === 'page') {
    const page = await getPageBySlug(routePath, site.id)
    if (!page) notFound()
    return (
      <article className="news-article page-detail">
        <div className="na-meta">
          <span className="lbl">{section.label}</span>
        </div>
        <h1>{page.title}</h1>
        {page.excerpt && <p className="detail-lead">{page.excerpt}</p>}
        <div className="na-body">
          <BlockRenderer blocks={page.body} />
        </div>
      </article>
    )
  }

  const entries = await getSectionEntries(section, 200)
  return (
    <SectionRenderer
      entries={entries}
      headingLevel={1}
      section={section}
      showMore={false}
    />
  )
}
