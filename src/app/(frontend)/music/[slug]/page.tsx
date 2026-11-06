import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AudioPlayer } from '@/components/site/AudioPlayer'
import { BlockRenderer } from '@/components/site/Blocks'
import { formatDate, getEntry, mediaUrl } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return {}
  const track = await getEntry('tracks', slug, site.id)
  return pageMetadata({
    site,
    doc: track,
    fallbackTitle: '音乐作品',
    path: `/music/${slug}`,
  })
}

export default async function TrackPage({ params }: Props) {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const track = await getEntry('tracks', slug, site.id)
  if (!track) notFound()
  const cover = mediaUrl(track.cover)
  const audio = mediaUrl(track.audio)
  return (
    <>
      <div className="detail-back">
        <Link className="btn" href="/music">
          ← 返回音乐作品
        </Link>
      </div>
      <article className="news-article">
        <div className="na-meta">
          <span className="lbl">音乐作品</span>
          {track.releaseDate && <span>{formatDate(track.releaseDate)}</span>}
        </div>
        <header className="track-detail-hero">
          <div className="track-large-cover">
            {cover ? <img alt={track.title} src={cover} /> : <span>♪</span>}
          </div>
          <div>
            <h1>{track.title}</h1>
            <p className="detail-lead">
              {track.artist}
              {track.album ? ` · ${track.album}` : ''}
            </p>
            <AudioPlayer
              artist={track.artist}
              cover={cover}
              src={audio}
              title={track.title}
            />
          </div>
        </header>
        <div className="na-body">
          <BlockRenderer blocks={track.description} />
          {track.lyrics && (
            <details className="lyrics-panel">
              <summary>查看歌词</summary>
              <pre>{track.lyrics}</pre>
            </details>
          )}
          {track.credits && (
            <div className="credits-panel">
              <span>创作与制作</span>
              <p>{track.credits}</p>
            </div>
          )}
          {track.streamingLinks?.length > 0 && (
            <div className="na-related">
              <b>外部音乐平台</b>
              {track.streamingLinks.map((link: any) => (
                <a
                  href={link.url}
                  key={link.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  )
}
