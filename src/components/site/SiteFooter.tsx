import Link from 'next/link'

import { safeExternalUrl } from '@/lib/url'

export function SiteFooter({ site, sections }: { site: any; sections: any[] }) {
  const socialLinks: { href: string; label: string }[] = (
    site.socialLinks || []
  ).flatMap((link: any) => {
    const href = safeExternalUrl(link?.url)
    return href ? [{ href, label: link.label || href }] : []
  })

  return (
    <footer className="footer">
      <nav aria-label="页脚导航" className="footer-nav">
        {sections.map((section) => (
          <Link href={`/${section.routePath}`} key={section.id}>
            {section.label}
          </Link>
        ))}
        <Link href="/contact">联系我</Link>
      </nav>
      {socialLinks.length > 0 && (
        <nav aria-label="社交链接" className="footer-nav">
          {socialLinks.map((link) => (
            <a
              href={link.href}
              key={`${link.label}-${link.href}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
      <p>
        © {new Date().getFullYear()} {site.name}
        {site.brand?.footerText ? ` · ${site.brand.footerText}` : ''}
      </p>
    </footer>
  )
}
