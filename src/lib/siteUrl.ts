/**
 * 站点根 URL 解析。
 *
 * 为什么需要兜底
 * --------------
 * 线上域名只存在 `sites.publicUrl` 里，而演示种子（src/seed.ts:194）把它写成了
 * `http://localhost:3000`。如果 sitemap / robots / llms.txt / JSON-LD 直接把这个值
 * 当作站点根 URL 写进产物，搜索引擎和 AI 爬虫拿到的会是 `localhost` 链接 —— 这是一份
 * 语法合法、语义完全错误的机器可读文件。这里不改数据（publicUrl 是站点的真实配置，
 * 由运营在后台填写），只在「publicUrl 指向本机地址」时退回 `NEXT_PUBLIC_CMS_URL`，
 * 并且 warn 一句，让部署者知道 SEO 产物当前用的是兜底值。
 */

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

let warned = false

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function isLocalAddress(value: string) {
  try {
    return LOCAL_HOSTNAMES.has(new URL(value).hostname.toLowerCase())
  } catch {
    return false
  }
}

/**
 * 取站点根 URL（不带结尾斜杠）。
 * 优先级：sites.publicUrl → NEXT_PUBLIC_CMS_URL → 空字符串。
 * 仅当 publicUrl 缺失或指向本机地址时才用环境变量兜底。
 */
export function resolveBaseUrl(publicUrl?: string | null): string {
  const raw = stripTrailingSlash((publicUrl || '').trim())
  const envUrl = stripTrailingSlash((process.env.NEXT_PUBLIC_CMS_URL || '').trim())

  if (raw && !isLocalAddress(raw)) return raw
  if (!envUrl) {
    if (raw) {
      warnOnce(`sites.publicUrl 指向本机地址 ${raw}，且未设置 NEXT_PUBLIC_CMS_URL，SEO 产物将沿用该本机地址。`)
    }
    return raw
  }
  warnOnce(
    raw
      ? `sites.publicUrl 指向本机地址 ${raw}，改用 NEXT_PUBLIC_CMS_URL=${envUrl} 生成 SEO 产物（未修改 sites 数据）。`
      : `sites.publicUrl 缺失，改用 NEXT_PUBLIC_CMS_URL=${envUrl} 生成 SEO 产物。`,
  )
  return envUrl
}

/** 拼接绝对 URL，自动处理 base 结尾斜杠与 path 开头斜杠。 */
export function absoluteUrl(base: string, path: string) {
  const cleanBase = stripTrailingSlash(base)
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

function warnOnce(message: string) {
  if (warned) return
  warned = true
  console.warn(`[seo] ${message}`)
}
