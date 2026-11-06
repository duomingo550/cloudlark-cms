import Link from 'next/link'

import { detailHref, mediaUrl } from '@/lib/content'

function termNames(doc: any) {
  return (doc.terms || [])
    .map((term: any) => (typeof term === 'object' ? term.name : null))
    .filter(Boolean)
}

function initial(value?: string) {
  return (value || '云').trim().charAt(0)
}

function dateParts(value?: string | null) {
  if (!value) return { day: '·', month: '' }
  const date = new Date(value)
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: `${date.getMonth() + 1}月`,
  }
}

function courseColor(name: string) {
  const colors = [
    'var(--c-green)',
    'var(--c-blue)',
    'var(--c-gold)',
    'var(--c-violet)',
    'var(--c-rose)',
    'var(--c-teal)',
  ]
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return colors[total % colors.length]
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    available: '可购买',
    'coming-soon': '即将上线',
    building: '开发中',
    consult: '按需咨询',
    retired: '已下架',
  }
  return labels[status] || status
}

export function EntryCard({
  collection,
  entry,
}: {
  collection: string
  entry: any
}) {
  const href = detailHref(collection, entry)
  const cover = mediaUrl(entry.cover || entry.logo)
  const tags = termNames(entry)

  if (collection === 'articles') {
    const date = dateParts(entry.publishedDate)
    return (
      <Link className="news" href={href}>
        <div className="d">
          <b>{date.day}</b>
          <span>{date.month}</span>
        </div>
        <div>
          <span className="lbl">{tags[0] || '前沿资讯'}</span>
          <h3>{entry.title}</h3>
          <p>{entry.excerpt}</p>
        </div>
      </Link>
    )
  }

  if (collection === 'tools') {
    return (
      <article className="tool">
        <Link href={href}>
          <div
            className="ava"
            style={{ background: courseColor(entry.name) }}
          >
            {cover ? (
              <img alt="" loading="lazy" src={cover} />
            ) : (
              initial(entry.name)
            )}
          </div>
          <h3>{entry.name}</h3>
          <p>{entry.summary}</p>
        </Link>
        <a
          className="go"
          href={entry.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          打开 ↗
        </a>
      </article>
    )
  }

  if (collection === 'products') {
    return (
      <Link className="prod" href={href}>
        <span className="soon">{statusLabel(entry.statusLabel)}</span>
        <div
          className="ic"
          style={{ background: courseColor(entry.name) }}
        >
          {cover ? (
            <img alt="" loading="lazy" src={cover} />
          ) : (
            initial(entry.name)
          )}
        </div>
        <h3>{entry.name}</h3>
        <p>{entry.summary}</p>
        <div className="price">
          {entry.priceLabel || '了解详情'}
          <span>{entry.kind === 'agent' ? ' · 智能体' : ''}</span>
        </div>
      </Link>
    )
  }

  if (collection === 'skills') {
    return (
      <article className="tool">
        <div
          className="ava"
          style={{ background: courseColor(entry.name) }}
        >
          {initial(entry.name)}
        </div>
        <h3>{entry.name}</h3>
        <p>{entry.description}</p>
        <span className="lv">{entry.level || entry.group}</span>
      </article>
    )
  }

  if (collection === 'tracks') {
    return (
      <Link className="course" href={href}>
        <div
          className="cover"
          style={{
            background: cover
              ? `linear-gradient(rgba(15,35,28,.18),rgba(15,35,28,.55)), url("${cover}") center/cover`
              : courseColor(entry.title),
          }}
        >
          {entry.title.charAt(0)}
        </div>
        <div className="body">
          <h3>{entry.title}</h3>
          <p>{entry.artist}</p>
          <div className="meta">
            <span>{entry.album || '单曲'}</span>
            <span className="status">播放 ▶</span>
          </div>
        </div>
      </Link>
    )
  }

  if (collection === 'comic-series') {
    return (
      <Link className="course" href={href}>
        <div
          className="cover"
          style={{
            background: cover
              ? `linear-gradient(rgba(15,35,28,.15),rgba(15,35,28,.52)), url("${cover}") center/cover`
              : courseColor(entry.title),
          }}
        >
          漫
        </div>
        <div className="body">
          <h3>{entry.title}</h3>
          <p>{entry.synopsis}</p>
          <div className="meta">
            <span>漫画</span>
            <span className="status">
              {entry.status === 'completed' ? '已完结' : '连载中'}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  const isPath = collection === 'learning-paths'
  return (
    <Link className="course" href={href}>
      <div
        className="cover"
        style={{ background: courseColor(entry.title || entry.name || '云雀') }}
      >
        {isPath ? String(entry.position || '路').padStart(2, '0') : 'AI'}
      </div>
      <div className="body">
        <h3>{entry.title || entry.name}</h3>
        <p>{entry.excerpt || entry.summary || entry.description}</p>
        <div className="meta">
          <span>{isPath ? '学习路线' : '教程'}</span>
          <span className="status">
            {entry.durationMinutes
              ? `${entry.durationMinutes} 分钟`
              : isPath
                ? '进行中'
                : '查看详情'}
          </span>
        </div>
      </div>
    </Link>
  )
}
