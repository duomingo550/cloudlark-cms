import Link from 'next/link'

import { EntryCard } from '@/components/site/EntryCard'

function containerClass(template: string, sourceCollection: string) {
  if (template === 'article-list' || sourceCollection === 'articles') {
    return 'news-list'
  }
  if (template === 'product-grid' || sourceCollection === 'products') {
    return 'store-grid'
  }
  if (
    template === 'tool-grid' ||
    template === 'skill-grid' ||
    sourceCollection === 'tools' ||
    sourceCollection === 'skills'
  ) {
    return 'grid'
  }
  return 'course-grid'
}

export function SectionRenderer({
  section,
  entries,
  preview = false,
  showMore = true,
  headingLevel = 2,
}: {
  section: any
  entries: any[]
  preview?: boolean
  showMore?: boolean
  headingLevel?: 1 | 2
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  const visibleEntries = preview ? entries.slice(0, 8) : entries
  const wrapper = containerClass(
    section.templateKey || 'list',
    section.sourceCollection,
  )

  return (
    <section className="sec" id={section.key}>
      <div className="sec-head">
        <Heading>{section.label}</Heading>
        <span className="tag">
          {preview ? '精选内容 · 持续更新' : `${entries.length} 条内容`}
        </span>
        {showMore && (
          <Link className="sec-more" href={`/${section.routePath}`}>
            查看全部 →
          </Link>
        )}
      </div>

      {visibleEntries.length === 0 ? (
        <div className="empty">
          栏目已经就绪，在后台添加并发布内容后会自动显示。
        </div>
      ) : (
        <div className={wrapper}>
          {visibleEntries.map((entry) => (
            <EntryCard
              collection={section.sourceCollection}
              entry={entry}
              key={entry.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
