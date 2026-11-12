#!/usr/bin/env node
/**
 * scripts/verify-phase1.mjs — Phase 1 验收（内容正确性 + 鉴权边界 / 零依赖 / 可重复跑）
 *
 * 为什么存在
 * ----------
 * scripts/smoke.mjs 的 44 个断言全部只验「状态码」和「文档存在」。实证：把
 * src/lib/content.ts 里任何一处 `_status: { equals: 'published' }` 删掉，
 * smoke 仍然全绿。种子在 src/seed.ts:421-428（草稿判定在 :427 的
 * `_status: index < 2 ? 'published' : 'draft'`）特意造了 1 条草稿（tutorial-3），
 * 却没有任何测试证明它没有从列表/详情漏出去。
 * 本脚本补的就是「内容对不对」和「谁能读/谁能写」这两层：12 条断言，任一条
 * FAIL 即退出码 1。
 *
 * 用法
 * ----
 *   node scripts/verify-phase1.mjs                      # 默认 http://127.0.0.1:3000
 *   node scripts/verify-phase1.mjs --base http://localhost:3000
 *   node scripts/verify-phase1.mjs --base=http://127.0.0.1:3100
 *   pnpm verify:phase1
 *
 *   管理员账号通过环境变量覆盖（第 8 条清理测试线索时要用）：
 *     CMS_EMAIL=admin@example.com CMS_PASSWORD=... node scripts/verify-phase1.mjs
 *
 * 约束：第 1–7 条只发 GET、不写库、不登录。第 8–12 条开始覆盖写入与鉴权边界：
 *   - 第 8 条会匿名提交 1 条线索，并在断言结束前（含异常路径）用管理员 JWT 删掉；
 *   - 第 9 条的请求会被 400 拦在落库前，不产生数据；
 *   - 第 10 条的上传被 403 拦在 access 层，不会写入 media 目录；
 *   - 第 11/12 条仍是纯 GET。
 * 除第 8 条那条「自建自删」的线索外，不修改任何既有数据；产物一律不落盘。
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
 * 8. 匿名 POST /api/leads → 201；匿名 GET /api/leads → 403。
 *    Leads.ts 的 access 是「create: () => true，read/update/delete: adminOnly」：
 *    联系表单必须匿名可提交，但线索里是访客的姓名/邮箱/正文，读与删必须锁死。
 *    只验 POST 成功会漏掉「读任意放开」这种把全部访客联系方式公网曝光的改坏；
 *    只验 GET 403 又会漏掉「表单根本提交不上去」的线上故障。两条一起验，
 *    才能卡住这个 collection 唯一的正确形状。
 *    ⚠ 这条会真的写库，所以必须自建自删：断言结束（含中途抛异常）时用管理员
 *    JWT DELETE 掉本次创建的 id，并回读 totalDocs 证明归零。为此每次运行都用
 *    时间戳生成唯一邮箱 —— Leads.ts:73 的 limitLeadRate（上限见 :11 的
 *    MAX_SUBMISSIONS_PER_WINDOW = 3）是「同一邮箱 5 分钟内最多 3 条」，
 *    固定邮箱连跑第 4 次就会 400「提交太频繁」，把断言变成假红。
 * 9. POST /api/leads 缺 email → 400，且 message 逐字为「请填写称呼、邮箱和内容」。
 *    状态码和文案都要验：只验 400 时，一个「缺字段被当成 500」或「文案被改成
 *    英文/乱码」的回归都能溜过去；而前端联系表单正是靠这段文案提示用户的。
 *    该文案来自 Leads.ts:52 的 throw new APIError('请填写称呼、邮箱和内容', 400)。
 * 10. 匿名 POST /api/media（极小 multipart）→ 401 或 403（非 2xx）。
 *    Media.ts 的 create 是 canCreateForSite（匿名直接 false）。上传是匿名用户
 *    最容易触碰的写入口，也是最贵的一个（占磁盘、进 CDN、可能被当图床）。
 *    这里选 multipart 而不是「POST /api/video-assets 空体」，理由：
 *      a. multipart 走的是真实的 multipart 解析链路，能顺带证明「解析之前就
 *         被 access 挡住」，而不是靠空体/bad request 侥幸失败；
 *      b. Node 18+ 内置 FormData/Blob，内存里造 8 字节 PNG 即可，零依赖、零落盘；
 *      c. media 的 staticDir 就是 site 的图片目录，比 video-assets 更贴近现实风险。
 *    可接受的期望是 401 或 403 —— 两者都表示「未通过鉴权」；唯一不可接受的是
 *    2xx（匿名上传成功）或 500（access 层写成抛异常）。
 * 11. GET /search?q=重复 → 200 且 HTML 不含草稿标题。
 *    第 7 条只覆盖列表页与详情页，搜索是第三条读取路径：searchSite()
 *    （src/lib/content.ts:222-262）自己拼 where，容易在重构时漏掉
 *    `_status: { equals: 'published' }`，把草稿标题从「全站搜索」里漏出去。
 *    关键词取草稿标题「把重复工作交给自动化」里的子串「重复」：Payload 的
 *    like 是子串匹配，这个词必然命中草稿，因此「没出现」只可能是状态过滤生效，
 *    而不是关键词没匹配上（后者会让断言假绿）。
 * 12. 未登录 GET /api/articles → 403。
 *    与第 5 条同构：Articles.ts 用的是 standardContentAccess，read 是
 *    canReadSite（匿名 false）。内容集合一旦被改成 publicRead，全站文章（含
 *    未发布的付费/内部稿件）就会绕过前端直接走 API 拉走；这条把「内容 API
 *    必须登录」钉在契约里，和 /api/sites 一起构成多租户边界的两端。
 *
 * 依赖：Node >= 18（用全局 fetch / FormData / Blob / AbortSignal.timeout）；
 *      实测 Node v24.22.2。
 * 退出码：12/12 PASS → 0；任一 FAIL → 1；--base 非法 → 2。
 */

import http from 'node:http'
import https from 'node:https'

const DEFAULT_BASE = 'http://127.0.0.1:3000'
const REQUEST_TIMEOUT_MS = 60_000
const TOTAL_ASSERTIONS = 12

/**
 * 种子契约（见 src/seed.ts:190、src/seed.ts:416-423 与 data/demo-content.json）。
 * 只在这里放成常量，方便种子文案变化时一处修改。
 */
const SITE_NAME = process.env.VERIFY_SITE_NAME || '云雀'
const DRAFT = {
  slug: 'tutorial-3',
  title: '把重复工作交给自动化',
  body: '识别流程、拆解步骤，并用智能体完成日常重复任务。',
  // 断言 11 用的搜索词：必须是草稿标题的子串，否则「搜不到」是关键词没命中，
  // 而不是状态过滤生效，断言会假绿。这里取标题里的「重复」。
  searchTerm: '重复',
}

/**
 * 管理员凭据：只用于断言 8 的清理与基线回读（登录本身不是被测对象）。
 * 口令只从环境变量读取，不设默认值 —— 仓库是公开的，默认口令等于送出一个可用账号。
 */
const ADMIN_EMAIL = process.env.CMS_EMAIL
const ADMIN_PASSWORD = process.env.CMS_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('缺少 CMS_EMAIL / CMS_PASSWORD 环境变量（断言 8 的清理需要登录）')
  process.exit(2)
}

/** Leads.ts:52 的 400 文案，逐字比对（前端联系表单直接展示这一句）。 */
const LEADS_REQUIRED_MESSAGE = '请填写称呼、邮箱和内容'

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
    // 提前校验，避免 12 条断言全部以「URL 非法」失败而看不出真正原因。
    new URL(value)
  } catch {
    console.error(`--base 不是合法 URL: ${value}`)
    process.exit(2)
  }
  return value.replace(/\/+$/, '')
}

const base = parseBase()

/** 带超时的 GET；redirect 用 manual，状态码原样返回，避免 3xx 被吞成 200。 */
async function get(pathname, extraHeaders = {}) {
  const response = await fetch(base + pathname, {
    method: 'GET',
    redirect: 'manual',
    headers: {
      accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
      ...extraHeaders,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return {
    status: response.status,
    body: await response.text(),
    location: response.headers.get('location'),
  }
}

/** 发 JSON；status + 原始文本都返回，让断言能同时验状态码和文案。 */
async function sendJson(method, pathname, payload, extraHeaders = {}) {
  const response = await fetch(base + pathname, {
    method,
    redirect: 'manual',
    headers: { 'content-type': 'application/json', ...extraHeaders },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return { status: response.status, body: await response.text() }
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

/** 从 Payload 的 create 响应里取 id；解析失败返回 null（清理时会据此报告）。 */
function createdId(body) {
  try {
    return JSON.parse(body)?.doc?.id ?? null
  } catch {
    return null
  }
}

/** 从列表响应里取 totalDocs；解析失败返回 null。 */
function totalDocs(body) {
  try {
    return JSON.parse(body)?.totalDocs ?? null
  } catch {
    return null
  }
}

/** 取 Bearer/JWT 头。Payload 两种前缀都接受，这里用官方文档里的 JWT。 */
function authHeader(token) {
  return { Authorization: `JWT ${token}` }
}

/**
 * 管理员登录（只给断言 8 的清理用）。结果缓存，避免多次登录。
 * ⚠ 必须带 Origin：仓库在 src/payload.config.ts:99 配了 csrf: [serverURL]，
 *   登录 POST 不带 Origin 时会被 CSRF 策略挡成 403。
 */
let adminSessionPromise = null
function adminSession() {
  if (!adminSessionPromise) {
    adminSessionPromise = (async () => {
      try {
        const response = await sendJson(
          'POST',
          '/api/users/login',
          { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
          { origin: base },
        )
        let token = null
        try {
          token = JSON.parse(response.body)?.token ?? null
        } catch {
          token = null
        }
        if (response.status === 200 && token) {
          return { ok: true, token, detail: `登录 200（${ADMIN_EMAIL}）` }
        }
        return {
          ok: false,
          token: null,
          detail: `登录失败：POST /api/users/login → ${response.status}`,
        }
      } catch (error) {
        return {
          ok: false,
          token: null,
          detail: `登录异常：${errorText(error)}`,
        }
      }
    })()
  }
  return adminSessionPromise
}

/** 读基线：清理前库里已有多少条线索（正常是 0，非 0 时也不该由本脚本清零）。 */
async function leadBaseline(token) {
  try {
    const response = await get('/api/leads', authHeader(token))
    if (response.status !== 200) return { ok: false, value: null, detail: `GET /api/leads → ${response.status}` }
    return { ok: true, value: totalDocs(response.body), detail: '' }
  } catch (error) {
    return { ok: false, value: null, detail: errorText(error) }
  }
}

/**
 * 删除本次创建的线索并回读总数。
 * 无论断言主体是否抛异常都会被调用（见断言 8 的 finally），
 * 失败不 throw，把原因写进 report 让断言转红 —— 留脏数据必须是可见的失败。
 */
async function cleanupLeads(token, ids) {
  const failures = []
  const removed = []
  for (const id of ids) {
    try {
      const response = await fetch(`${base}/api/leads/${id}`, {
        method: 'DELETE',
        redirect: 'manual',
        headers: authHeader(token),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      if (response.status >= 200 && response.status < 300) removed.push(id)
      else failures.push(`DELETE /api/leads/${id} → ${response.status}`)
    } catch (error) {
      failures.push(`DELETE /api/leads/${id} 异常：${errorText(error)}`)
    }
  }

  let after = null
  try {
    const response = await get('/api/leads', authHeader(token))
    if (response.status === 200) after = totalDocs(response.body)
    else failures.push(`清理后回读 GET /api/leads → ${response.status}`)
  } catch (error) {
    failures.push(`清理后回读异常：${errorText(error)}`)
  }

  const report = failures.length
    ? `清理失败：${failures.join('；')}`
    : `已删除 ${removed.length ? `id=${removed.join(',')}` : '（无）'}，回读 totalDocs=${after}`
  return { ok: failures.length === 0, removed, totalDocsAfter: after, report }
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
  console.log(`[${id}/${TOTAL_ASSERTIONS}] ${title}`)
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

// ── 8. 匿名提交线索 → 201；匿名读取线索 → 403；测试数据自建自删 ────────────
await check(
  8,
  '匿名 POST /api/leads → 201；匿名 GET /api/leads → 403；测试线索已清理',
  async () => {
    // 唯一邮箱：Leads.ts 的 limitLeadRate 是「同一邮箱 5 分钟最多 3 条」，
    // 固定邮箱连跑第 4 次会 400「提交太频繁」，那是限流生效、不是本断言失败。
    const email = `verify-phase1+${Date.now()}@example.com`
    const parts = []
    const createdIds = []
    let postStatus = 0
    let getStatus = 0
    let baseline = null
    let cleanup = { ok: false, report: '未执行清理（没有管理员凭据）', totalDocsAfter: null }

    const session = await adminSession()
    if (session.ok) {
      const before = await leadBaseline(session.token)
      baseline = before.value
      parts.push(`基线 totalDocs=${baseline === null ? '未知' : baseline}`)
    } else {
      parts.push(`管理员登录失败（${session.detail}），无法预读/清理线索`)
    }

    try {
      const post = await sendJson('POST', '/api/leads', {
        name: '验收脚本 verify-phase1',
        email,
        message: '这是一条由 verify-phase1 自动创建、并在断言结束前删除的测试线索。',
      })
      postStatus = post.status
      const id = createdId(post.body)
      if (id !== null) createdIds.push(id)
      parts.push(`匿名 POST /api/leads → ${postStatus}（email=${email}，id=${id === null ? '未解析到' : id}）`)

      if (id === null && postStatus >= 200 && postStatus < 300) {
        // 2xx 但拿不到 id：数据已落库却无法删，必须显式报出来。
        parts.push('⚠ POST 成功但响应里没有 doc.id，无法自动清理')
      }

      const anonRead = await get('/api/leads')
      getStatus = anonRead.status
      parts.push(`匿名 GET /api/leads → ${getStatus}`)
    } finally {
      // 即使上面的请求抛异常也要尽力清理：留脏数据比测试失败更严重。
      if (session.ok) {
        cleanup = await cleanupLeads(session.token, createdIds)
        parts.push(`清理：${cleanup.report}`)
      } else {
        cleanup = {
          ok: createdIds.length === 0,
          report:
            createdIds.length === 0
              ? '未创建数据，无需清理'
              : `无法清理 id=${createdIds.join(',')}（${session.detail}）`,
          totalDocsAfter: null,
        }
        parts.push(`清理：${cleanup.report}`)
      }
    }

    const backToBaseline =
      baseline === null ||
      (cleanup.totalDocsAfter !== null && cleanup.totalDocsAfter === baseline)
    const ok =
      // Payload 的 create 成功契约就是 201；任何 2xx 之外的形状都算失败。
      postStatus === 201 &&
      getStatus === 403 &&
      cleanup.ok &&
      backToBaseline

    return {
      ok,
      actual: parts.join('；'),
      expected:
        '匿名 POST → 201；匿名 GET → 403；测试线索已删除且回读 totalDocs 回到基线（当前 0）',
    }
  },
)

// ── 9. 缺 email 的线索必须 400，且文案逐字正确 ──────────────────────────────
await check(9, 'POST /api/leads 缺 email → 400 且文案逐字匹配', async () => {
  const response = await sendJson('POST', '/api/leads', {
    name: '验收脚本 verify-phase1',
    message: '这条缺少邮箱字段，应当在落库前被 400 拦下。',
  })
  // 同时看原始文本与解析后的 message：Payload 的 i18n 可能改写外层，
  // 但 errors[].message 是 hooks 里 throw 的原文，必须逐字出现。
  const rawHasText = response.body.includes(LEADS_REQUIRED_MESSAGE)
  let parsedMessage = ''
  try {
    parsedMessage = JSON.parse(response.body)?.errors?.[0]?.message || ''
  } catch {
    parsedMessage = ''
  }
  const exact = parsedMessage === LEADS_REQUIRED_MESSAGE
  const hasText = rawHasText || parsedMessage.includes(LEADS_REQUIRED_MESSAGE)

  return {
    ok: response.status === 400 && hasText && exact,
    actual: `POST /api/leads（无 email）→ ${response.status}；文案含目标句 = ${hasText}；逐字相等 = ${exact}；响应 message = "${parsedMessage.slice(0, 80)}"`,
    expected: `400 且 message 逐字为「${LEADS_REQUIRED_MESSAGE}」`,
  }
})

// ── 10. 匿名上传必须被挡 ────────────────────────────────────────────────────
await check(10, '匿名 POST /api/media（multipart）→ 401 或 403', async () => {
  // 8 字节的假 PNG 头：只为构造一个「格式像图片」的 multipart，
  // 内存里造、不落盘（access 层会在解析/落盘前就拒绝）。
  const pngHead = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const form = new FormData()
  form.append('alt', 'verify-phase1 匿名上传探针')
  form.append('file', new Blob([pngHead], { type: 'image/png' }), 'verify-phase1.png')

  const response = await fetch(base + '/api/media', {
    method: 'POST',
    redirect: 'manual',
    body: form,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  const body = await response.text()
  const status = response.status

  return {
    ok: status === 401 || status === 403,
    actual: `匿名 POST /api/media（multipart，8 字节 PNG）→ ${status}；响应片段 ${JSON.stringify(body.slice(0, 120))}`,
    expected: '401 或 403（匿名不得上传；2xx 说明图片目录已对公网开放写入）',
  }
})

// ── 11. 搜索不得漏出草稿 ────────────────────────────────────────────────────
await check(11, `GET /search?q=${DRAFT.searchTerm} → 200 且不含草稿标题`, async () => {
  const { status, body } = await get(
    `/search?q=${encodeURIComponent(DRAFT.searchTerm)}`,
  )
  const leakedTitle = body.includes(DRAFT.title)
  // 关键词本身必须出现在页面上（搜索框回填/结果标题），否则「没泄露」可能
  // 只是关键词没进 HTML，属于假绿。
  const echoed = body.includes(DRAFT.searchTerm)

  return {
    ok: status === 200 && !leakedTitle && echoed,
    actual: `GET /search?q=${DRAFT.searchTerm} → ${status}；HTML 含草稿标题 = ${leakedTitle}；HTML 含关键词 = ${echoed}；字节数 ${Buffer.byteLength(body)}`,
    expected: `200 且 HTML 不含 "${DRAFT.title}"（关键词回填保留）`,
  }
})

// ── 12. 未登录读内容 API 必须 403 ───────────────────────────────────────────
await check(12, 'GET /api/articles（匿名）→ 403', async () => {
  const { status } = await get('/api/articles')
  return {
    ok: status === 403,
    actual: `GET /api/articles（无 Authorization）→ ${status}`,
    expected: '403（内容 API 不得匿名可读，与 /api/sites 同构）',
  }
})

// ── 汇总 ────────────────────────────────────────────────────────────────────
const passed = results.filter((result) => result.ok).length
const failed = results.filter((result) => !result.ok)

console.log('─'.repeat(72))
if (failed.length > 0) {
  console.log(`失败项：${failed.map((result) => `#${result.id}`).join(', ')}`)
}
console.log(`${passed}/${TOTAL_ASSERTIONS} passed`)
console.log(`base: ${base}`)

process.exit(failed.length === 0 ? 0 : 1)
