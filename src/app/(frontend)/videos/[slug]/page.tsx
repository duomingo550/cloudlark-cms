import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlockRenderer } from '@/components/site/Blocks'
import { breadcrumbNode, JsonLd } from '@/components/site/JsonLd'
import {
  formatDate,
  formatDuration,
  getEntry,
  mediaUrl,
} from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, resolveBaseUrl } from '@/lib/siteUrl'
import { safeHref } from '@/lib/url'

type Props = { params: Promise<{ slug: string }> }

type Player =
  | { kind: 'file'; src: string }
  | { kind: 'embed'; src: string }
  | { kind: 'link'; href: string }
  | { kind: 'empty' }

/** 允许直接当 <video src> 用的容器格式。 */
const VIDEO_FILE_EXT = /\.(mp4|webm|ogv|ogg|m4v|mov)$/i

/**
 * 把 B 站 / YouTube / Vimeo 的**页面地址**换成各自的官方播放器地址。
 *
 * 只认白名单域名，返回值始终是由我们拼出来的 https 地址，
 * 不会把用户输入原样塞进 iframe src。
 */
function embedUrl(raw: string): string | null {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }
  if (!/^https?:$/.test(url.protocol)) return null

  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  const path = url.pathname

  if (host === 'youtu.be') {
    const id = path.split('/').filter(Boolean)[0]
    return id && /^[\w-]+$/.test(id) ? `https://www.youtube.com/embed/${id}` : null
  }

  if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
    const short = path.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)
    const id = url.searchParams.get('v') || short?.[1]
    return id && /^[\w-]+$/.test(id) ? `https://www.youtube.com/embed/${id}` : null
  }

  if (host === 'bilibili.com' || host.endsWith('.bilibili.com')) {
    const match = path.match(/\/video\/(BV[\w]+)/i)
    return match
      ? `https://player.bilibili.com/player.html?bvid=${match[1]}&high_quality=1`
      : null
  }

  if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
    const id = path.split('/').filter(Boolean).find((part) => /^\d+$/.test(part))
    return id ? `https://player.vimeo.com/video/${id}` : null
  }

  return null
}

/**
 * 播放源优先级：上传文件 > 可识别平台的官方播放器 > 视频直链 > 普通外链。
 * 两者都为空时返回 empty，由页面渲染「视频待上传」。
 */
function resolvePlayer(video: any): Player {
  const file = mediaUrl(video.videoFile)
  if (file) return { kind: 'file', src: file }

  const raw = typeof video.videoUrl === 'string' ? video.videoUrl.trim() : ''
  if (!raw) return { kind: 'empty' }

  const embed = embedUrl(raw)
  if (embed) return { kind: 'embed', src: embed }

  const href = safeHref(raw)
  if (!href) return { kind: 'empty' }

  if (VIDEO_FILE_EXT.test(href.split(/[?#]/)[0])) {
    return { kind: 'file', src: href }
  }

  // 腾讯视频、B 站短链等无法可靠拼出官方播放器的地址：
  // 给出封面 + 新窗口打开，而不是塞一个会加载失败的 iframe。
  return href.startsWith('http') ? { kind: 'link', href } : { kind: 'empty' }
}

function VideoPlayer({ video, cover }: { video: any; cover: any }) {
  const player = resolvePlayer(video)
  const title = video.title || '视频'

  if (player.kind === 'empty') {
    return (
      <figure className="content-video video-placeholder">
        <div className="video-placeholder-inner">
          <span aria-hidden="true">▶</span>
          <b>视频待上传</b>
          <small>在后台填写外链视频地址或上传视频文件后，这里会自动显示。</small>
        </div>
      </figure>
    )
  }

  if (player.kind === 'link') {
    return (
      <figure className="content-video">
        {cover ? <img alt={title} src={cover} /> : null}
        <a
          className="text-link"
          href={player.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          在新窗口打开视频 ↗
        </a>
      </figure>
    )
  }

  if (player.kind === 'embed') {
    return (
      <figure className="content-video">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          src={player.src}
          title={title}
        />
      </figure>
    )
  }

  return (
    <figure className="content-video">
      <video
        controls
        playsInline
        poster={cover || undefined}
        preload="metadata"
        src={player.src}
      >
        你的浏览器不支持内嵌视频播放，
        <a href={player.src}>点此打开视频文件</a>。
      </video>
    </figure>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return {}
  const video = await getEntry('videos', slug, site.id)
  return pageMetadata({
    site,
    doc: video,
    fallbackTitle: '视频作品',
    path: `/videos/${slug}`,
  })
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const video = await getEntry('videos', slug, site.id)
  if (!video) notFound()

  const cover = mediaUrl(video.cover)
  const duration = formatDuration(video.duration)
  const terms = (video.terms || []).filter(
    (term: any) => typeof term === 'object',
  )
  const base = resolveBaseUrl(site.publicUrl)

  return (
    <>
      <JsonLd
        data={breadcrumbNode([
          { name: '首页', url: absoluteUrl(base, '/') },
          { name: '视频作品', url: absoluteUrl(base, '/videos') },
          { name: video.title, url: absoluteUrl(base, `/videos/${slug}`) },
        ])}
      />
      <div className="detail-back">
        <Link className="btn" href="/videos">
          ← 返回视频作品
        </Link>
      </div>
      <article className="news-article">
        <div className="na-meta">
          <span className="lbl">视频作品</span>
          {video.publishedDate && <span>{formatDate(video.publishedDate)}</span>}
          {duration && <span>时长 {duration}</span>}
        </div>
        <h1>{video.title}</h1>
        {video.description && (
          <p className="detail-lead">{video.description}</p>
        )}
        {terms.length > 0 && (
          <div className="term-tags">
            {terms.map((term: any) => (
              <span key={term.id}>{term.name}</span>
            ))}
          </div>
        )}
        <VideoPlayer cover={cover} video={video} />
        <div className="na-body">
          <BlockRenderer blocks={video.body} />
        </div>
      </article>
    </>
  )
}
