import type { Metadata } from 'next'
import Link from 'next/link'

import { EntryCard } from '@/components/site/EntryCard'
import { searchSite } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'

type Props = {
  searchParams: Promise<{ q?: string }>
}

export const metadata: Metadata = {
  title: '搜索',
}

const labels: Record<string, string> = {
  articles: '前沿资讯',
  tools: 'AI 工具',
  tutorials: '教程',
  products: '产品与服务',
  tracks: '音乐作品',
  'comic-series': '漫画',
  videos: '视频作品',
}

const wrappers: Record<string, string> = {
  articles: 'news-list',
  tools: 'grid',
  tutorials: 'course-grid',
  products: 'store-grid',
  tracks: 'course-grid',
  'comic-series': 'course-grid',
  videos: 'course-grid',
}

export default async function SearchPage({ searchParams }: Props) {
  const site = await getCurrentSite()
  if (!site) return null
  const { q = '' } = await searchParams
  const groups = await searchSite(site.id, q)
  const total = groups.reduce((sum, group) => sum + group.docs.length, 0)

  return (
    <>
      <section className="hero search-hero">
        <span className="kicker">全站搜索</span>
        <h1>
          搜索 <em>{q || '云雀内容'}</em>
        </h1>
        <p>
          {q
            ? total > 0
              ? `找到 ${total} 条相关内容。`
              : '没有找到相关内容，换个关键词试试。'
            : '输入工具、教程、资讯、产品或音乐关键词。'}
        </p>
        <form action="/search" className="search-form" method="get">
          <input
            aria-label="搜索关键词"
            defaultValue={q}
            name="q"
            placeholder="搜索工具 / 资讯 / 教程…"
            type="search"
          />
          <button className="btn primary big" type="submit">
            搜索
          </button>
        </form>
      </section>

      {groups.map((group) => (
        <section className="sec" key={group.collection}>
          <div className="sec-head">
            <h2>{labels[group.collection] || group.collection}</h2>
            <span className="tag">{group.docs.length} 条结果</span>
          </div>
          <div className={wrappers[group.collection] || 'grid'}>
            {group.docs.map((entry: any) => (
              <EntryCard
                collection={group.collection}
                entry={entry}
                key={entry.id}
              />
            ))}
          </div>
        </section>
      ))}

      {q && total === 0 && (
        <div className="empty">
          <p>没有找到与「{q}」相关的内容。</p>
          <Link className="btn" href="/">
            返回首页
          </Link>
        </div>
      )}
    </>
  )
}
