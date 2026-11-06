import Link from 'next/link'

import { BlockRenderer } from '@/components/site/Blocks'
import { formatDate, mediaUrl } from '@/lib/content'

export function EditorialDetail({
  doc,
  backHref,
  backLabel,
  eyebrow,
}: {
  doc: any
  backHref: string
  backLabel: string
  eyebrow: string
}) {
  const cover = mediaUrl(doc.cover)
  const terms = (doc.terms || []).filter(
    (term: any) => typeof term === 'object',
  )

  return (
    <>
      <div className="detail-back">
        <Link className="btn" href={backHref}>
          ← {backLabel}
        </Link>
      </div>
      <article className="news-article">
        <div className="na-meta">
          <span className="lbl">{eyebrow}</span>
          {doc.publishedDate && <span>{formatDate(doc.publishedDate)}</span>}
          {doc.durationMinutes ? (
            <span>预计 {doc.durationMinutes} 分钟</span>
          ) : null}
        </div>
        <h1>{doc.title}</h1>
        {doc.excerpt && <p className="detail-lead">{doc.excerpt}</p>}
        {terms.length > 0 && (
          <div className="term-tags">
            {terms.map((term: any) => (
              <span key={term.id}>{term.name}</span>
            ))}
          </div>
        )}
        {cover && (
          <figure className="na-cover">
            <img alt={doc.cover?.alt || doc.title} src={cover} />
          </figure>
        )}
        <div className="na-body">
          <BlockRenderer blocks={doc.body} />
          {doc.sourceUrl && (
            <div className="na-src">
              来源：
              <a href={doc.sourceUrl} rel="noopener noreferrer" target="_blank">
                {doc.sourceName || '阅读原文'} ↗
              </a>
            </div>
          )}
          {doc.relatedTools?.length > 0 && (
            <div className="na-related">
              <b>关联工具</b>
              {doc.relatedTools.map((tool: any) => (
                <Link href={`/tools/${tool.slug}`} key={tool.id}>
                  {tool.name} ↗
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  )
}
