import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlockRenderer } from '@/components/site/Blocks'
import { getEntry, mediaUrl } from '@/lib/content'
import { getCurrentSite } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return {}
  const product = await getEntry('products', slug, site.id)
  return pageMetadata({
    site,
    doc: product,
    fallbackTitle: '产品与服务',
    path: `/products/${slug}`,
  })
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return null
  const product = await getEntry('products', slug, site.id)
  if (!product) notFound()
  const cover = mediaUrl(product.cover)
  const download = product.download
  return (
    <>
      <div className="detail-back">
        <Link className="btn" href="/store">
          ← 返回数字商店
        </Link>
      </div>
      <article className="news-article">
        <div className="na-meta">
          <span className="lbl">
            {product.kind === 'agent' ? '智能体' : '产品与服务'}
          </span>
          <span>{statusLabel(product.statusLabel)}</span>
        </div>
        <header className="product-detail-hero">
          <div>
            <h1>{product.name}</h1>
            <p className="detail-lead">{product.summary}</p>
            <div className="product-price-row">
              <strong>{product.priceLabel || '了解详情'}</strong>
            </div>
            <div className="hero-cta">
              {product.purchaseUrl && (
                <a
                  className="btn primary big"
                  href={product.purchaseUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  咨询或购买 ↗
                </a>
              )}
              {download?.url && (
                <a className="btn big" download href={download.url}>
                  下载文件 ↓
                </a>
              )}
            </div>
          </div>
          <div className="product-detail-visual">
            {cover ? (
              <img alt={product.name} src={cover} />
            ) : (
              product.name.charAt(0)
            )}
          </div>
        </header>
        <div className="na-body">
          <BlockRenderer blocks={product.body} />
        </div>
      </article>
    </>
  )
}

function statusLabel(status: string) {
  return (
    {
      available: '可购买',
      'coming-soon': '即将上线',
      building: '开发中',
      consult: '按需咨询',
      retired: '已下架',
    }[status] || status
  )
}
