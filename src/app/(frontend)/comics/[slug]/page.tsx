import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  formatDate,
  getComicChapters,
  getEntry,
  mediaUrl,
} from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return {}
  const series = await getEntry('comic-series', slug, site.id)
  return pageMetadata({
    site,
    doc: series,
    fallbackTitle: '漫画',
    path: `/comics/${slug}`,
  })
}

export default async function ComicSeriesPage({ params }: Props) {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const series = await getEntry('comic-series', slug, site.id)
  if (!series) notFound()
  const chapters = await getComicChapters(series.id, site.id)
  const cover = mediaUrl(series.cover)

  return (
    <>
      <div className="detail-back">
        <Link className="btn" href="/comics">
          ← 返回漫画
        </Link>
      </div>
      <article className="news-article">
        <div className="na-meta">
          <span className="lbl">
            {series.status === 'completed' ? '已完结' : '连载中'}
          </span>
        </div>
        <header className="comic-series-hero">
          <div className="comic-series-cover">
            {cover ? <img alt={series.title} src={cover} /> : <span>漫</span>}
          </div>
          <div>
            <h1>{series.title}</h1>
            <p className="detail-lead">{series.synopsis}</p>
          </div>
        </header>
        <section className="chapter-section">
          <div className="sec-head">
            <h2>章节</h2>
            <span className="tag">{chapters.length} 章</span>
          </div>
          <div className="chapter-list">
            {chapters.map((chapter: any) => (
              <Link
                href={`/comics/${series.slug}/${chapter.slug}`}
                key={chapter.id}
              >
                <span>
                  第 {chapter.chapterNumber} 章 · {chapter.title}
                </span>
                <small>{formatDate(chapter.publishedDate)}</small>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  )
}
