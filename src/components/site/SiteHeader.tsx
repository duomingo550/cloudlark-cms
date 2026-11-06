import Link from 'next/link'

export function SiteHeader({
  site,
  sections,
}: {
  site: any
  sections: any[]
}) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="logo" href="/">
          <span className="logo-badge">AI</span>
          {site.name}
        </Link>
        <nav aria-label="主导航" className="nav">
          {sections
            .filter((section) => section.showInNav !== false)
            .map((section) => (
              <Link href={`/${section.routePath}`} key={section.id}>
                {section.label}
              </Link>
            ))}
        </nav>
        <form action="/search" className="top-search" method="get">
          <input
            aria-label="搜索"
            name="q"
            placeholder="搜索工具 / 资讯 / 教程…"
            type="search"
          />
        </form>
      </div>
    </header>
  )
}
