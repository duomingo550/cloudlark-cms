import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'

import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getSections } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'

import './doubao.css'
import './styles.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite()
  if (!site) return { title: '云雀 CMS' }
  return {
    title: {
      default: site.seo?.title || site.name,
      template: `%s · ${site.name}`,
    },
    description: site.seo?.description || site.brand?.description || '',
    metadataBase: site.publicUrl ? new URL(site.publicUrl) : undefined,
  }
}

export default async function FrontendLayout({
  children,
}: {
  children: ReactNode
}) {
  const site = await getCurrentSite()
  if (!site) {
    return (
      <html lang="zh-CN">
        <body>
          <main className="setup-page">
            <span className="eyebrow">云雀 CMS</span>
            <h1>还没有站点</h1>
            <p>
              请先运行 <code>pnpm seed</code>，然后在
              <a href="/admin"> 管理后台 </a>
              创建第一个站点。
            </p>
          </main>
        </body>
      </html>
    )
  }

  const sections = await getSections(site.id)
  const style = {
    '--brand': site.brand?.primaryColor || '#1f7a5a',
  } as CSSProperties

  return (
    <html lang="zh-CN">
      <body style={style}>
        <SiteHeader sections={sections} site={site} />
        <main className="wrap">{children}</main>
        <SiteFooter sections={sections} site={site} />
      </body>
    </html>
  )
}
