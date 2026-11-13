import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

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
  const title = site.seo?.title || site.name
  const description = site.seo?.description || site.brand?.description || ''
  return {
    title: {
      default: title,
      template: `%s · ${site.name}`,
    },
    description,
    metadataBase: site.publicUrl ? new URL(site.publicUrl) : undefined,
    // 站点级 OpenGraph 兜底：只给首页与应用级页面用，详情页各自用 pageMetadata 覆盖。
    // 不写 type 时 Next 不会输出 og:type，微信/社交平台抓取会少一层语义。
    openGraph: {
      type: 'website',
      siteName: site.name,
      title,
      description,
      ...(site.publicUrl ? { url: site.publicUrl } : {}),
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function FrontendLayout({
  children,
}: {
  children: ReactNode
}) {
  const site = await getCurrentSite()
  if (!site) {
    // 域名未绑定或站点缺失时直接 404，不再渲染一个 200 的空壳页。
    notFound()
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
