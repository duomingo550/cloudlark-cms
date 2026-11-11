import type { MetadataRoute } from 'next'

import { getPrimarySite } from '@/lib/payload'
import { absoluteUrl, resolveBaseUrl } from '@/lib/siteUrl'

/**
 * 运行时生成的 /robots.txt（Next App Router 约定，不放 public/ 静态文件）。
 *
 * 两个目的：
 * 1. 告诉搜索引擎 sitemap 在哪；
 * 2. 显式给主流 AI 爬虫各开一个 User-agent 段并 Allow: / —— GEO（生成式引擎优化）
 *    的第一步是「先被允许抓取」，只靠 `User-agent: *` 在部分爬虫的合并规则里不够明确。
 */
export const dynamic = 'force-dynamic'

/** 需要被显式允许的 AI 爬虫（各占一个 User-agent 段）。 */
const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getPrimarySite()
  const base = resolveBaseUrl(site?.publicUrl)

  return {
    rules: [
      {
        // 普通爬虫可以抓正文，但后台与 API 一律不抓。
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    sitemap: absoluteUrl(base, '/sitemap.xml'),
    host: base,
  }
}
