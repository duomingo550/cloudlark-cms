import React, { type ReactNode } from 'react'

import { AudioPlayer } from '@/components/site/AudioPlayer'
import { mediaUrl } from '@/lib/content'
import { safeExternalUrl, safeHref } from '@/lib/url'

function formatText(text: string, format = 0, key?: React.Key): ReactNode {
  let node: ReactNode = text
  if (format & 1) node = <strong>{node}</strong>
  if (format & 2) node = <em>{node}</em>
  if (format & 8) node = <u>{node}</u>
  if (format & 16) node = <code>{node}</code>
  return <React.Fragment key={key}>{node}</React.Fragment>
}

function lexicalChildren(children: any[] = []): ReactNode {
  return children.map((child, index) => {
    if (child.type === 'text') {
      return formatText(child.text || '', child.format, index)
    }
    if (child.type === 'linebreak') return <br key={index} />
    if (child.type === 'link') {
      const href = safeHref(child.fields?.url)
      if (!href) {
        return (
          <React.Fragment key={index}>
            {lexicalChildren(child.children)}
          </React.Fragment>
        )
      }
      return (
        <a href={href} key={index} rel="noopener">
          {lexicalChildren(child.children)}
        </a>
      )
    }
    return <React.Fragment key={index}>{lexicalChildren(child.children)}</React.Fragment>
  })
}

function RichText({ data }: { data: any }) {
  const children = data?.root?.children || []
  return (
    <>
      {children.map((node: any, index: number) => {
        const content = lexicalChildren(node.children)
        switch (node.type) {
          case 'heading':
            return node.tag === 'h3' ? (
              <h3 key={index}>{content}</h3>
            ) : (
              <h2 key={index}>{content}</h2>
            )
          case 'list':
            return node.listType === 'number' ? (
              <ol key={index}>{content}</ol>
            ) : (
              <ul key={index}>{content}</ul>
            )
          case 'listitem':
            return <li key={index}>{content}</li>
          case 'quote':
            return <blockquote key={index}>{content}</blockquote>
          case 'paragraph':
            return <p key={index}>{content}</p>
          default:
            return <p key={index}>{content}</p>
        }
      })}
    </>
  )
}

function ImageBlock({ image, caption }: { image: any; caption?: string }) {
  const src = mediaUrl(image)
  if (!src) return null
  return (
    <figure className="content-figure">
      <img alt={image.alt || caption || ''} loading="lazy" src={src} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

function videoEmbed(provider: string, rawUrl: string) {
  try {
    const url = new URL(rawUrl)
    if (!/^https?:$/.test(url.protocol)) return null
    if (provider === 'youtube') {
      const id =
        url.hostname.includes('youtu.be')
          ? url.pathname.slice(1)
          : url.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (provider === 'bilibili') {
      const match = url.pathname.match(/\/video\/(BV[\w]+)/i)
      return match
        ? `https://player.bilibili.com/player.html?bvid=${match[1]}&high_quality=1`
        : null
    }
    if (provider === 'vimeo') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    return null
  }
  return null
}

function VideoBlock({ block }: { block: any }) {
  const embed = videoEmbed(block.provider, block.url)
  const poster = mediaUrl(block.poster)
  const externalUrl = safeExternalUrl(block.url)
  return (
    <figure className="content-video">
      {embed ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          src={embed}
          title={block.title || '视频'}
        />
      ) : poster ? (
        <img alt={block.title || ''} loading="lazy" src={poster} />
      ) : null}
      {block.title && <figcaption>{block.title}</figcaption>}
      {block.caption && <p>{block.caption}</p>}
      {!embed && externalUrl && (
        <a className="text-link" href={externalUrl} rel="noopener" target="_blank">
          在新窗口打开视频 ↗
        </a>
      )}
    </figure>
  )
}

function dataRows(value?: string) {
  if (!value) return []
  return value
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(/\t|,/).map((cell) => cell.trim()))
}

function ChartBlock({ block }: { block: any }) {
  const src = mediaUrl(block.image)
  const rows = dataRows(block.dataTable)
  return (
    <figure className="content-chart">
      <h3>{block.title}</h3>
      {src && <img alt={block.title} loading="lazy" src={src} />}
      {block.caption && <figcaption>{block.caption}</figcaption>}
      {block.source && <p className="chart-source">数据来源：{block.source}</p>}
      {rows.length > 0 && (
        <details>
          <summary>查看数据表</summary>
          <div className="table-scroll">
            <table>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </figure>
  )
}

function DownloadBlock({ block }: { block: any }) {
  const file = block.file
  const src = mediaUrl(file)
  const href = safeHref(src)
  if (!href) return null
  return (
    <div className="download-card">
      <div>
        <span className="eyebrow">数字文件</span>
        <h3>{block.title}</h3>
        {block.description && <p>{block.description}</p>}
        <span className="file-meta">
          {file?.version ? `版本 ${file.version}` : ''}
          {file?.filesize ? ` · ${Math.round(file.filesize / 1024 / 1024)} MB` : ''}
        </span>
      </div>
      <a download href={href}>
        {block.buttonLabel || '下载文件'} ↓
      </a>
    </div>
  )
}

export function BlockRenderer({ blocks }: { blocks?: any[] | null }) {
  if (!blocks?.length) return null
  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'richText':
            return (
              <div className="prose" key={index}>
                <RichText data={block.content} />
              </div>
            )
          case 'image':
            return (
              <ImageBlock
                caption={block.caption}
                image={block.image}
                key={index}
              />
            )
          case 'gallery':
            return (
              <div className="content-gallery" key={index}>
                {(block.items || []).map((item: any, itemIndex: number) => (
                  <ImageBlock
                    caption={item.caption}
                    image={item.image}
                    key={itemIndex}
                  />
                ))}
              </div>
            )
          case 'video':
            return <VideoBlock block={block} key={index} />
          case 'audio': {
            const track = block.track
            return (
              <AudioPlayer
                artist={track?.artist}
                cover={mediaUrl(track?.cover)}
                key={index}
                src={mediaUrl(track?.audio)}
                title={track?.title || '音乐作品'}
              />
            )
          }
          case 'chart':
            return <ChartBlock block={block} key={index} />
          case 'comicReader':
            return (
              <div
                className={`comic-reader ${
                  block.readingMode === 'page' ? 'is-page' : ''
                }`}
                key={index}
              >
                {(block.images || []).map((item: any, imageIndex: number) => {
                  const src = mediaUrl(item.image)
                  return src ? (
                    <img
                      alt={item.alt || `漫画第 ${imageIndex + 1} 页`}
                      key={imageIndex}
                      loading="lazy"
                      src={src}
                    />
                  ) : null
                })}
              </div>
            )
          case 'fileDownload':
            return <DownloadBlock block={block} key={index} />
          default:
            return null
        }
      })}
    </div>
  )
}
