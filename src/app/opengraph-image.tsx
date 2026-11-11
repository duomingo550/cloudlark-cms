import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

import { getPrimarySite } from '@/lib/payload'

/**
 * 动态 OG 分享图（1200×630，PNG），不新增图片文件。
 *
 * 为什么运行时生成而不是放一张 public/og.png
 * ----------------------------------------
 * 这是要卖的 CMS 产品，每个客户的站点名、描述、品牌色都不同，静态图只能服务演示站。
 * 这里每次请求读 `sites` 第一条（getPrimarySite），用它的品牌色与文案画图：换客户、
 * 改文案都不需要重新出图。
 *
 * 字体：本地子集，离线也能画中文（这是本文件最需要注意的地方）
 * --------------------------------------------------------
 * next/og 是 Next 内置的 @vercel/og（satori + resvg 已随 next 打包，不需要新依赖）。
 * 它默认只带拉丁字形；遇到 CJK 缺字时会在**运行时**去 Google Fonts 拉 Noto Sans SC，
 * 服务器访问不到 fonts.googleapis.com（例如国内机房）就渲染成方框（□）。
 *
 * 所以这里改为显式传入本地字体 `src/assets/fonts/NotoSansSC-OG-Regular.otf`
 * （Noto Sans SC Regular 子集，OFL，覆盖 GB2312 6763 个汉字 + 拉丁/标点，
 * 见同目录 README.md）。字体在模块加载时读一次，之后所有请求复用同一份 Buffer。
 * 已用「把 globalThis.fetch 打成必失败」的离线脚手架实测：中文正常，fetch 调用 0 次。
 *
 * 子集之外的生僻字仍可能触发 @vercel/og 的动态补字（联网时正常，离线时方框）；
 * 因此保留 PREFER_LATIN_TEXT 开关：设为 true 时改用「域名 + 固定英文副标题」，
 * 不依赖任何中文字形。默认 false（中文文案对营销更有用）。
 */
export const runtime = 'nodejs'

/** 设为 true 时只上图拉丁文案（域名 + 英文副标题），不依赖任何中文字形。 */
const PREFER_LATIN_TEXT = false

/** 兜底站点名/副标题：sites 缺失（未 seed、DB 未建）时仍然要返回一张合法图片。 */
const FALLBACK_NAME = 'CloudLark CMS'
const FALLBACK_TITLE = 'CloudLark CMS'
const FALLBACK_TAGLINE = 'AI tools, tutorials and digital products'
const FALLBACK_BRAND = '#1f7a5a'

export const alt = `${FALLBACK_NAME} — ${FALLBACK_TAGLINE}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// 站点文案/品牌色随时会在后台改，不能被静态化。
export const dynamic = 'force-dynamic'

/**
 * 本地字体路径：`next start` / `next dev` 的 cwd 都是仓库根目录。
 * 模块级读取（只读一次），请求处理时 await 同一个 Promise，避免每个请求重复读盘。
 */
const FONT_PATH = path.join(
  process.cwd(),
  'src/assets/fonts/NotoSansSC-OG-Regular.otf',
)
const fontDataPromise = readFile(FONT_PATH)
// 先挂一个空 catch：字体缺失时不要让模块加载阶段出现 unhandledRejection；
// 真正的错误会在下面 await 时抛出，让路由明确 500，而不是静默退回 Google Fonts。
void fontDataPromise.catch(() => {})

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/** 只放行拉丁字形覆盖得到的字符（可打印 ASCII + 常见拉丁扩展）。 */
const LATIN_SAFE = /^[\x20-\x7E\u00A0-\u024F\u2000-\u206F\u20A0-\u20CF]+$/

function latinOnly(value: string) {
  return value.length > 0 && LATIN_SAFE.test(value)
}

/** publicUrl → 主机名（OG 图上用域名当站点标识，纯 ASCII，任何字体都能画）。 */
function domainOf(publicUrl: string) {
  const raw = publicUrl.replace(/^https?:\/\//i, '').replace(/[/?#].*$/, '')
  return raw.trim()
}

export default async function OpengraphImage() {
  let site: any = null
  try {
    site = await getPrimarySite()
  } catch (error) {
    // SEO 资源不能因为数据库抖动就 500：拿不到数据就画兜底图。
    console.warn('[og] 读取 sites 失败，使用兜底文案', error)
  }

  const name = text(site?.name)
  const seoTitle = text(site?.seo?.title)
  const description = text(site?.seo?.description) || text(site?.brand?.description)
  const domain = domainOf(text(site?.publicUrl))
  const brand = text(site?.brand?.primaryColor) || FALLBACK_BRAND

  const pick = (value: string, fallback: string) =>
    !value ? fallback : PREFER_LATIN_TEXT && !latinOnly(value) ? fallback : value

  const title = pick(seoTitle || name, FALLBACK_TITLE)
  const subtitle = pick(description, FALLBACK_TAGLINE)
  const footer = pick(name, FALLBACK_NAME)

  // 字体文件在模块加载时已开始读取；这里 await 的是同一个 Promise。
  const fontData = await fontDataPromise

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'flex-start',
          backgroundColor: '#0b1512',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'NotoSansSC, sans-serif',
          height: '100%',
          justifyContent: 'space-between',
          padding: '64px 80px',
          position: 'relative',
          width: '100%',
        }}
      >
        {/* 顶部品牌色渐变条：品牌色来自 sites.brand.primaryColor。 */}
        <div
          style={{
            background: `linear-gradient(90deg, ${brand} 0%, #4fd1a5 100%)`,
            display: 'flex',
            height: 8,
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: brand,
              display: 'flex',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 5,
            }}
          >
            {(domain || FALLBACK_NAME).toUpperCase()}
          </div>
          <div
            style={{
              color: '#f5f7f6',
              display: 'flex',
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.16,
              marginTop: 26,
              maxHeight: 250,
              maxWidth: 980,
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: '#9fb3aa',
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.4,
              marginTop: 26,
              maxHeight: 126,
              maxWidth: 900,
              overflow: 'hidden',
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            alignItems: 'center',
            borderTop: '1px solid #1c2b25',
            display: 'flex',
            fontSize: 22,
            justifyContent: 'flex-start',
            letterSpacing: 2,
            paddingTop: 26,
            width: '100%',
          }}
        >
          <div style={{ color: '#6d837a', display: 'flex' }}>{footer}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'NotoSansSC',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  )
}
