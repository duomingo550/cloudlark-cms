import Link from 'next/link'

export function SiteFooter({ site, sections }: { site: any; sections: any[] }) {
  return (
    <footer className="footer">
      <nav aria-label="页脚导航" className="footer-nav">
        {sections.map((section) => (
          <Link href={`/${section.routePath}`} key={section.id}>
            {section.label}
          </Link>
        ))}
      </nav>
      <p>
        © {new Date().getFullYear()} {site.name}
        {site.brand?.footerText ? ` · ${site.brand.footerText}` : ''}
      </p>
    </footer>
  )
}
