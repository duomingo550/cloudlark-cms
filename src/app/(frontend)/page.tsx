import Link from 'next/link'

import { SectionRenderer } from '@/components/site/SectionRenderer'
import {
  getSectionCounts,
  getSectionEntries,
  getSections,
} from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'

const featureColors = [
  'var(--c-green)',
  'var(--c-blue)',
  'var(--c-gold)',
  'var(--c-violet)',
]

export default async function HomePage() {
  const site = await getCurrentSite()
  if (!site) return null

  const [sections, counts] = await Promise.all([
    getSections(site.id),
    getSectionCounts(site.id),
  ])
  const homeSections = sections.filter((section) => section.showOnHome)
  const sectionEntries = await Promise.all(
    homeSections.map((section) => getSectionEntries(section, 12)),
  )
  const toolsIndex = homeSections.findIndex(
    (section) => section.sourceCollection === 'tools',
  )
  const featured =
    toolsIndex >= 0
      ? [...sectionEntries[toolsIndex]]
          .sort(
            (a: any, b: any) =>
              (b.featuredRank || 0) - (a.featuredRank || 0),
          )
          .slice(0, 4)
      : []

  return (
    <>
      <section className="hero">
        <span className="kicker">
          <Link href="/about">云雀明叔</Link> 手筛的实战工具箱
        </span>
        <h1>
          少走弯路，<em>先用对工具</em>
        </h1>
        <p>
          {site.brand?.description ||
            '不堆榜单、不追噱头，只收录真正能上手、能提效、能变现的 AI 工具与方法。'}
        </p>
        <div className="hero-cta">
          <Link className="btn primary big" href="/tools">
            开始探索工具 ↗
          </Link>
          <Link className="btn big" href="/about">
            认识云雀明叔
          </Link>
        </div>
        <div className="stats">
          <div className="stat">
            <b>{counts.tools || 0}</b>
            <span>已收录工具</span>
          </div>
          <div className="stat">
            <b>{counts.articles || 0}</b>
            <span>前沿资讯</span>
          </div>
          <div className="stat">
            <b>{counts.tutorials || 0}</b>
            <span>教程</span>
          </div>
          <div className="stat">
            <b>{counts.products || 0}</b>
            <span>产品与服务</span>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="sec">
          <div className="sec-head">
            <h2>本周推荐</h2>
            <span className="tag">我最近高频在用的</span>
          </div>
          <div className="feat">
            {featured.map((tool: any, index: number) => (
              <Link
                className="feat-card"
                href={`/tools/${tool.slug}`}
                key={tool.id}
              >
                <div
                  className="ava"
                  style={{
                    background: featureColors[index % featureColors.length],
                  }}
                >
                  {tool.name.charAt(0)}
                </div>
                <div>
                  <h3>{tool.name}</h3>
                  <p>{tool.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {homeSections.map((section, index) => (
        <SectionRenderer
          entries={sectionEntries[index]}
          key={section.id}
          preview
          section={section}
        />
      ))}

      <section className="sec">
        <div className="hero home-note">
          <span className="kicker">关于这个网站</span>
          <h2>
            一个人在学习，
            <em>也在把学到的做成东西。</em>
          </h2>
          <p>
            这里记录一个 58 岁独立创业者，用 AI
            重新学习、创作和开发的过程。不是榜单，是一路上的真实选择。
          </p>
          <div className="hero-cta">
            <Link className="btn primary big" href="/about">
              继续了解云雀明叔 →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
