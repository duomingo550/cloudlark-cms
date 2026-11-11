#!/usr/bin/env node
/**
 * scripts/verify-phase1.mjs — Phase 1 内容级验收（纯 GET / 零依赖 / 不写库 / 不登录）
 *
 * 为什么存在
 * ----------
 * scripts/smoke.mjs 的 44 个断言全部只验「状态码」和「文档存在」。实证：把
 * src/lib/content.ts 里任何一处 `_status: { equals: 'published' }` 删掉，
 * smoke 仍然全绿。种子在 src/seed.ts:421-428（草稿判定在 :427 的
 * `_status: index < 2 ? 'published' : 'draft'`）特意造了 1 条草稿（tutorial-3），
 * 却没有任何测试证明它没有从列表/详情漏出去。
 * 本脚本补的就是「内容对不对」这一层：7 条断言，任一条 FAIL 即退出码 1。
 *
 * 用法
 * ----
 *   node scripts/verify-phase1.mjs                      # 默认 http://127.0.0.1:3000
 *   node scripts/verify-phase1.mjs --base http://localhost:3000
 *   node scripts/verify-phase1.mjs --base=http://127.0.0.1:3100
 *   pnpm verify:phase1
 *
 * 约束：只发 GET；不写数据库、不登录、不提交表单。参考图/产物一律不落盘。
 *
 * 逐条断言的存在理由
 * ------------------
 * 1. GET / → 200 且 HTML 含站点名（"云雀"）。
 *    只验 200 是不够的：站点解析失败时页面可以是「空壳但 200」，此时标题里
 *    不会有真实站点名。站点名取自 src/seed.ts:190 `name: '云雀 AI 学堂'`；
 *    这里只比对不含空格的稳定子串 "云雀"，避免 seed 文案微调（如空格/后缀）
 *    造成假红。若要跑别的站点，用 VERIFY_SITE_NAME 环境变量覆盖即可。
 * 2. GET / → <h1 恰好 1 个。
 *    内容页/首页出现 0 个 h1 是可访问性缺陷（页面没有主标题）；出现 2 个以上
 *    通常意味着组件被叠加渲染（例如 SectionRenderer 在首页重复输出标题）。
 *    这是「结构正确」的最低成本代理指标。
 * 3. GET /tools → 200 且 <h1 恰好 1 个。
 *    列表页走的是另一条代码路径（[section]/page.tsx + SectionRenderer 的
 *    headingLevel=1），首页通过不代表列表页通过，必须单独验。
 * 4. GET /admin/login → 200。
 *    Payload 后台登录页是最容易被「给前端加的 host/redirect 逻辑」误伤的入口：
 *    前端 404 修复如果把整站兜进 notFound()，后台登录页会一起挂，但 smoke 里
 *    这条只验了 200 —— 保留为回归哨兵。
 * 5. GET /api/sites（匿名）→ 403。
 *    这是多租户的数据边界：站点列表匿名可读等于把所有租户域名/配置公网曝光。
 *    期望是硬编码的 403（不是 401/302），因为 Payload 的 access 控制返回 403；
 *    若日后改成 401 需同步改这里，属「契约变化」而非「测试变红」。
 * 6. GET / 带 `Host: unknown.example` → 404（不是 200）。
 *    这条针对的是一类「真故障被伪装成正常」的问题：host 解析失败时如果仍渲染
 *    一个「还没有站点」的空壳并返回 200，监控/CDN/搜索引擎都会认为站点健康，
 *    真实的多租户路由故障被永久掩盖。正确地应是 404（当前实现在
 *    src/app/(frontend)/layout.tsx 里用 notFound() 兜底）。
 *    ⚠ 实现注意：不能直接用 fetch 发这条断言 —— undici 的 fetch 会静默丢弃
 *    调用方传入的 Host 头（实测：传 host: unknown.example，服务端收到的仍是
 *    127.0.0.1:3000），断言会假绿。这里改用 Node 内置 node:http 把伪造的
 *    Host 真正写到线上（仍然零依赖；连接目标是 --base 的真实地址）。
 * 7. 草稿不外泄：列表不含草稿标题，详情页 404 或 200 但不含草稿正文。
 *    这是本脚本最核心的一条，也是 smoke 完全覆盖不到的一条。种子
 *    （src/seed.ts:421-428，第 427 行 `_status: index < 2 ? 'published' : 'draft'`）
 *    把 data/demo-content.json 的 COURSES[2] 写成草稿（slug 固定为 tutorial-3），
 *    标题「把重复工作交给自动化」、正文「识别流程、拆解步骤，并用智能体完成日常重复任务。」。
 *    只要 src/lib/content.ts 的 getSectionEntries()/getEntry() 里
 *    `_status: { equals: 'published' }` 被删掉，草稿就会出现在 /tutorials 列表，
 *    详情页也会 200 并吐出正文 —— 本断言必须转红。
 *    实测（HEAD 48b4db1，本地 dev）：/tutorials 与 /news 均不含该标题，
 *    GET /tutorials/tutorial-3 返回 404。因此断言按「404 或 200 但不含正文」
 *    的宽松契约写：404 是正确行为，200 时额外要求不含标题与正文，两种情况
 *    都能抓到泄露，也不会因为未来把 404 改成「200 + 友好的未发布提示页」
 *    而无谓变红。
 *
 * 依赖：Node >= 18（用全局 fetch / AbortSignal.timeout）；实测 Node v24.22.2。
 * 退出码：7/7 PASS → 0；任一 FAIL → 1。
 */

import http from 'node:http'
import https from 'node:https'

const DEFAULT_BASE = 'http://127.0.0.1:3000'
const REQUEST_TIMEOUT_MS = 60_000

/**
 * 种子契约（见 src/seed.ts:190、src/seed.ts:416-423 与 data/demo-content.json）。
 * 只在这里放成常量，方便种子文案变化时一处修改。
 */
const SITE_NAME = process.env.VERIFY_SITE_NAME || '云雀'
const DRAFT = {
  slug: 'tutorial-3',
  title: '把重复工作交给自动化',
  body: '识别流程、拆解步骤，并用智能体完成日常重复任务。',
}

function parseBase() {
  const argv = process.argv.slice(2)
  let raw = ''
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (token === '--base') raw = argv[index + 1] || ''
    else if (token.startsWith('--base=')) raw = token.slice('--base='.length)
  }
  const value = (raw || process.env.VERIFY_BASE_URL || DEFAULT_BASE).trim()
  if (!value) {
    console.error('--base 不能为空')
    process.exit(2)
  }
  try {
    // 提前校验，避免 7 条断言全部以「URL 非法」失败而看不出真正原因。
    new URL(value)
  } catch {
    console.error(`--base 不是合法 URL: ${value}`)
    process.exit(2)
  }
  return value.replace(/\/+$/, '')
}

const base = parseBase()

/** 带超时的 GET；redirect 用 manual，状态码原样返回，避免 3xx 被吞成 200。 */
async function get(pathname) {
  const response = await fetch(base + pathname, {
    method: 'GET',
    redirect: 'manual',
    headers: { accept: 'text/html,application/json;q=0.9,*/*;q=0.8' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return {
    status: response.status,
    body: await response.text(),
    location: response.headers.get('location'),
  }
}

/**
 * 用内置 node:http/https 发一个可伪造 Host 的 GET。
 * 连接目标是 base 的真实 host:port，但请求行/头里的 Host 是我们想要的域名。
 */
function getWithHost(hostHeader) {
  const url = new URL(base)
  const secure = url.protocol === 'https:'
  const transport = secure ? https : http
  return new Promise((resolve, reject) => {
    const request = transport.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (secure ? 443 : 80),
        path: '/',
        method: 'GET',
        headers: {
          host: hostHeader,
          accept: 'text/html',
        },
        timeout: REQUEST_TIMEOUT_MS,
      },
      (response) => {
        let body = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          body += chunk
        })
        response.on('end', () => resolve({ status: response.statusCode, body }))
      },
    )
    request.on('timeout', () =>
      request.destroy(new Error(`请求超时（${REQUEST_TIMEOUT_MS}ms）`)),
    )
    request.on('error', reject)
    request.end()
  })
}

function countH1(html) {
  // 用 <h1 后必须跟空白或 ">" 的写法，避免把 <h10 之类误计。
  return (html.match(/<h1[\s>]/g) || []).length
}

function errorText(error) {
  return error?.message || String(error)
}

// ── 预取：断言 1 与 2 共用一次 GET /，避免同一个页面请求两次（两次请求还可能
//    落在不同的 RSC 渲染结果上，导致输出自相矛盾）。
let home = { ok: false, error: null, status: 0, body: '' }
try {
  const response = await get('/')
  home = { ok: true, error: null, ...response }
} catch (error) {
  home.error = errorText(error)
}

const results = []

/**
 * 单条断言执行器：任何异常都被收敛成 FAIL，绝不打断后续断言。
 * run() 返回 { ok, actual, expected? }。
 */
async function check(id, title, run) {
  let outcome
  try {
    outcome = await run()
  } catch (error) {
    outcome = { ok: false, actual: `请求/执行异常：${errorText(error)}` }
  }
  const result = {
    id,
    title,
    ok: outcome.ok === true,
    actual: outcome.actual,
    expected: outcome.expected,
  }
  results.push(result)

  const verdict = result.ok ? 'PASS' : 'FAIL'
  console.log(`[${id}/7] ${title}`)
  console.log(`        ${verdict}  ${result.actual}`)
  if (!result.ok && result.expected) {
    console.log(`        期望：${result.expected}`)
  }
  console.log('')
}

// ── 1. 首页 200 且含站点名 ───────────────────────────────────────────────────
await check(1, 'GET / → 200 且 HTML 含站点名', async () => {
  if (!home.ok) {
    return { ok: false, actual: `GET / 请求失败：${home.error}`, expected: '200' }
  }
  const hasName = home.body.includes(SITE_NAME)
  return {
    ok: home.status === 200 && hasName,
    actual: `GET / → ${home.status}；HTML 含 "${SITE_NAME}" = ${hasName}（字节数 ${Buffer.byteLength(home.body)}）`,
    expected: `200 且 HTML 含 "${SITE_NAME}"`,
  }
})

// ── 2. 首页 <h1> 恰好 1 个 ──────────────────────────────────────────────────
await check(2, 'GET / → <h1> 恰好 1 个', async () => {
  if (!home.ok) {
    return { ok: false, actual: `GET / 请求失败：${home.error}`, expected: '<h1 出现 1 次' }
  }
  const count = countH1(home.body)
  return {
    ok: home.status === 200 && count === 1,
    actual: `GET / → ${home.status}；<h1 出现 ${count} 次`,
    expected: '<h1 出现 1 次',
  }
})

// ── 3. /tools 列表页 ────────────────────────────────────────────────────────
await check(3, 'GET /tools → 200 且 <h1> 恰好 1 个', async () => {
  const { status, body } = await get('/tools')
  const count = countH1(body)
  return {
    ok: status === 200 && count === 1,
    actual: `GET /tools → ${status}；<h1 出现 ${count} 次`,
    expected: '200 且 <h1 出现 1 次',
  }
})

// ── 4. 后台登录页 ───────────────────────────────────────────────────────────
await check(4, 'GET /admin/login → 200', async () => {
  const { status, location } = await get('/admin/login')
  return {
    ok: status === 200,
    actual: `GET /admin/login → ${status}${location ? `（Location: ${location}）` : ''}`,
    expected: '200',
  }
})

// ── 5. 匿名访问 /api/sites 必须 403 ─────────────────────────────────────────
await check(5, 'GET /api/sites（匿名）→ 403', async () => {
  const { status } = await get('/api/sites')
  return {
    ok: status === 403,
    actual: `GET /api/sites（无 Authorization）→ ${status}`,
    expected: '403（匿名不得读取站点列表）',
  }
})

// ── 6. 未知 Host 必须 404 ───────────────────────────────────────────────────
await check(6, 'GET / 带 Host: unknown.example → 404', async () => {
  const unknownHost = 'unknown.example'
  const { status, body } = await getWithHost(unknownHost)
  return {
    ok: status === 404,
    actual: `GET /（Host: ${unknownHost}）→ ${status}；含 "还没有站点" = ${body.includes('还没有站点')}；字节数 ${Buffer.byteLength(body)}`,
    expected: '404（host 解析失败不得伪装成 200）',
  }
})

// ── 7. 草稿不外泄 ───────────────────────────────────────────────────────────
await check(7, '草稿 tutorial-3 不出现在列表、详情不吐正文', async () => {
  const listPaths = ['/tutorials', '/news']
  const listActuals = []
  let leakedInList = false

  for (const pathname of listPaths) {
    const { status, body } = await get(pathname)
    const leaked = body.includes(DRAFT.title)
    const draftTextLeak = body.includes(DRAFT.body)
    if (status !== 200 || leaked || draftTextLeak) leakedInList = true
    listActuals.push(
      `${pathname} → ${status}，含草稿标题 = ${leaked}，含草稿正文 = ${draftTextLeak}`,
    )
  }

  const detail = await get(`/tutorials/${DRAFT.slug}`)
  const detailHasTitle = detail.body.includes(DRAFT.title)
  const detailHasBody = detail.body.includes(DRAFT.body)
  // 实测 404；200 也接受，但必须不含标题/正文（例如将来的「未发布提示页」）。
  const detailOk =
    detail.status === 404 ||
    (detail.status === 200 && !detailHasTitle && !detailHasBody)
  const detailActual =
    detail.status === 404
      ? `/tutorials/${DRAFT.slug} → 404（未泄露）`
      : `/tutorials/${DRAFT.slug} → ${detail.status}，含草稿标题 = ${detailHasTitle}，含草稿正文 = ${detailHasBody}`

  return {
    ok: !leakedInList && detailOk,
    actual: [...listActuals, detailActual].join('；'),
    expected: `列表 200 且不含 "${DRAFT.title}"；详情 404（或 200 但不含草稿标题/正文）`,
  }
})

// ── 汇总 ────────────────────────────────────────────────────────────────────
const passed = results.filter((result) => result.ok).length
const failed = results.filter((result) => !result.ok)

console.log('─'.repeat(72))
if (failed.length > 0) {
  console.log(`失败项：${failed.map((result) => `#${result.id}`).join(', ')}`)
}
console.log(`${passed}/7 passed`)
console.log(`base: ${base}`)

process.exit(failed.length === 0 ? 0 : 1)
