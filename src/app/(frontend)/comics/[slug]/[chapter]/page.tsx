import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlockRenderer } from '@/components/site/Blocks'
import { getEntry } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string; chapter: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, chapter } = await params
  const site = await getCurrentSite()
  if (!site) return {}
  const chapterDoc = await getEntry('comic-chapters', chapter, site.id)
  return pageMetadata({
    site,
    doc: chapterDoc,
    fallbackTitle: '漫画章节',
    path: `/comics/${slug}/${chapter}`,
  })
}

export default async function ComicChapterPage({ params }: Props) {
  const { slug, chapter } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const series = await getEntry('comic-series', slug, site.id)
  const chapterDoc = await getEntry('comic-chapters', chapter, site.id)
  if (!series || !chapterDoc) notFound()
  const chapterSeriesId =
    typeof chapterDoc.series === 'object'
      ? chapterDoc.series?.id
      : chapterDoc.series
  if (chapterSeriesId !== series.id) notFound()

  return (
    <>
      <div className="detail-back">
        <Link className="btn" href={`/comics/${series.slug}`}>
          ← {series.title}
        </Link>
      </div>
      <article className="news-article comic-reader-page">
        <div className="na-meta">
          <span className="lbl">第 {chapterDoc.chapterNumber} 章</span>
        </div>
        <h1>{chapterDoc.title}</h1>
        <div className="na-body">
          <BlockRenderer blocks={chapterDoc.body} />
        </div>
      </article>
    </>
  )
}
