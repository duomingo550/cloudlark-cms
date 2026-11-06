import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getEntry } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return {}
  const path = await getEntry('learning-paths', slug, site.id)
  return pageMetadata({
    site,
    doc: path,
    fallbackTitle: '学习路线',
    path: `/learning/${slug}`,
  })
}

export default async function LearningPathPage({ params }: Props) {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const path = await getEntry('learning-paths', slug, site.id)
  if (!path) notFound()
  return (
    <>
      <div className="detail-back">
        <Link className="btn" href="/learning">
          ← 返回学习路线
        </Link>
      </div>
      <article className="news-article">
        <div className="na-meta">
          <span className="lbl">学习路线</span>
        </div>
        <h1>{path.title}</h1>
        <p className="detail-lead">{path.description}</p>
        <div className="na-body timeline">
          {(path.steps || []).map((step: any, index: number) => (
            <div className="timeline-item" key={index}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                {step.description && <p>{step.description}</p>}
                {step.url && (
                  <a href={step.url} rel="noopener noreferrer" target="_blank">
                    查看相关资料 ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </article>
    </>
  )
}
