import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlockRenderer } from '@/components/site/Blocks'
import { getEntry, mediaUrl } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return {}
  const tool = await getEntry('tools', slug, site.id)
  return pageMetadata({
    site,
    doc: tool,
    fallbackTitle: 'AI 工具',
    path: `/tools/${slug}`,
  })
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const tool = await getEntry('tools', slug, site.id)
  if (!tool) notFound()
  const logo = mediaUrl(tool.logo)
  return (
    <>
      <div className="detail-back">
        <Link className="btn" href="/tools">
          ← 返回工具导航
        </Link>
      </div>
      <article className="news-article">
        <div className="na-meta">
          <span className="lbl">AI 工具</span>
        </div>
        <div className="tool-detail-head">
          <div className="tool-detail-logo">
            {logo ? <img alt={tool.name} src={logo} /> : tool.name.charAt(0)}
          </div>
          <div>
            <h1>{tool.name}</h1>
            <p className="detail-lead">{tool.summary}</p>
            <div className="hero-cta">
              <a
                className="btn primary big"
                href={tool.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                打开官网 ↗
              </a>
              {(tool.terms || []).map((term: any) => (
                <span className="soft-tag" key={term.id}>
                  {term.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="na-body">
          <BlockRenderer blocks={tool.description} />
        </div>
      </article>
    </>
  )
}
