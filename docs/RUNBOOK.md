# 排错手册（RUNBOOK）

> 目的：把「已经踩过一次的坑」写成照着做就能出去的东西。
> 每条都注明**现象 → 成因 → 处理**，能定位到文件行号的都写上。

---

## 1. 建库顺序与 seed 幂等

**现象**：`pnpm seed` 报 `SQLITE_ERROR`，或建到一半停住。

**成因**
- 生产模式（`NODE_ENV=production`）下 SQLite 适配器**不建表**（`node_modules/@payloadcms/db-sqlite/dist/connect.js:49-51`），所以「先起服务再建库」的顺序是反的。
- 中断过的 schema push 会在库里留下 `__new_*` 临时表（如 `__new_payload_locked_documents_rels`），它比新 schema 少列，下一次 push 往里插就报 `no such column: videos_id`。

**处理**
```powershell
# 1) 先确认没有服务占用数据库
Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

# 2) 看有没有残留临时表（只读）
python -c "import sqlite3;c=sqlite3.connect('file:cloudlark-local.db?mode=ro',uri=True);print([r[0] for r in c.execute(\"select name from sqlite_master where name like '__new%'\")])"
```
- 有残留且是 0 行 → 可以删表后重跑。
- **已出现结构不一致（补了三次仍失败）→ 直接删库重建**，不要继续补：
```powershell
Copy-Item cloudlark-local.db "$env:TEMP\db-backup-$(Get-Date -Format HHmmss).db"
Remove-Item cloudlark-local.db*
pnpm seed
```

**幂等约定**：seed 可以反复跑。判重靠 slug（内容集合）或「站点 + 业务键」（上传集合，见 `ensureUpload`）。重跑后 `counts` 必须逐项相同，且不应再产生新的 `media/` 文件。

---

## 2. 「网站打不开 / 显示还没有站点」的三种成因

前台取站点在 `src/lib/payload.ts` 的 `getCurrentSite()`，按以下顺序失败：

| # | 位置 | 触发条件 | 表现 |
|---|---|---|---|
| 1 | `payload.ts:34-43` | 请求的 `Host` 不在 `ALLOWED_HOSTS` 里 | 返回 `null` → 前台 `notFound()` → **404** |
| 2 | `payload.ts:52,66-72` | `Host` 在 `ALLOWED_HOSTS`，但不在任何 `sites.domains` 里，且 `ALLOW_UNMATCHED_HOST_FALLBACK != true` | 同上，**404** |
| 3 | `payload.ts:74-82` | 允许回落，但库里没有 `isDefault: true` 的站点（通常是没 seed） | 返回 `null` → **404** |

**排查顺序**
1. 请求带的是哪个 Host？（本地 `localhost:3000` 与 `127.0.0.1:3000` 是不同的 Host 值）
2. `ALLOWED_HOSTS` 包不包含它？（逗号分隔，大小写不敏感）
3. 后台「站点」里 `domains` 有没有它？域名要**逐字匹配**（保存时会 trim + 转小写，见 `Sites.ts` 的 `beforeValidate`）。
4. 库里有没有站点？`pnpm seed` 是否跑过。

**不要**用「把 `ALLOW_UNMATCHED_HOST_FALLBACK` 设成 true」来掩盖问题：那会让任意 `Host` 都命中默认站点（Host 注入 / 缓存投毒的入口）。生产应保持 `false`。

**历史坑**：2026-11-11 之前这里渲染的是一个 **200 状态的「还没有站点」空页**，看起来像「内容没生效」，把排错方向带偏过。现已改为 `notFound()`（404）。

---

## 3. 上传上限：三处生效点，各自管不同的事

| 生效点 | 位置 | 作用 | 失败表现 |
|---|---|---|---|
| ① 反向代理层 | `src/proxy.ts:4-8` | 看 `content-length`，超限直接 **413** | `上传请求超过该集合允许的大小上限` |
| ② 集合 hook | `src/collections/*.ts` 的 `uploadSizeLimit(...)` | 看 `data.filesize`，超限抛错 | `文件过大，最大允许 N MB` |
| ③ 站点配额 | `src/hooks/storageQuota.ts`（`sites.storageQuotaMb`） | 累计已用 + 本次是否超站点配额 | 配额相关报错 |

**当前上限**（`src/collections/*.ts`）：

| 集合 | 上限 | 允许类型 |
|---|---|---|
| `media` | 10 MB | `image/*` |
| `audio-assets` | 50 MB | mp3 / mp4 / aac / ogg / m4a |
| `download-assets` | 200 MB | zip / pdf |
| `video-assets` | 200 MB | mp4 / webm / quicktime |

**已知缺口（待修）**：`src/proxy.ts` 的 `uploadRoutes` 只列了 media / audio-assets / download-assets，**没有 `video-assets`**。也就是说视频上传**没有第 ① 层 413 保护**，只靠第 ② 层 hook。修法是把 `{ prefix: '/api/video-assets', limit: 200 * 1024 * 1024 }` 加进那个数组。

**注意顺序**：`uploadSizeLimit` 与 `storageQuota` 都是 `beforeChange`，**在 access 判断之后**执行。它们不是权限闸门，不能当第二道授权用。

---

## 4. dev 模式卡死 / `.next` 产物冲突

**现象**：`next dev` 进程还在，CPU 不动，内存涨到 2 GB 以上，所有路由（连 `/favicon.ico`）超时。

**成因**：Turbopack 开发服务器在高频改动 + 多次重启后进入死锁；另外 `next dev` 与 `next build` 共用 `.next` 目录，先 build 再 dev 会让 dev 找不到 `build-manifest.json`。

**处理**
```powershell
Get-Process node | Stop-Process -Force
Remove-Item .next -Recurse -Force      # 清掉混合产物
pnpm dev
```
**建议**：验证功能优先用 `pnpm build` + `pnpm start`（生产模式），比 dev 稳。

---

## 5. 后台自定义组件不渲染

**现象**：加了 `admin.components.xxx` 组件，代码、`pnpm check` 都过了，页面里就是没有。

**成因**：Payload 的自定义组件必须进 `src/app/(payload)/admin/importMap.js`；而且**改了 `payload.config.ts` 之后必须重启 dev/prod 进程**，热更新不一定覆盖 admin 的组件注册。

**处理**
```bash
pnpm generate:importmap     # 确认条目已写入 importMap.js
# 重启服务（不是刷新浏览器）
```
**判断方法**：先 grep `importMap.js` 有没有该组件；有的话再重启进程；仍不显示，就怀疑挂点写错（对照 `node_modules/payload/dist/config/types.d.ts` 里 `admin.components` 的字段名）。

---

## 6. 生产环境 500：`no such table: sites`

见第 1 节。生产模式不建表；要么先对目标库跑 `pnpm seed`，要么随包发布一个已迁移的数据库文件。`README` 的「Before deploying to production」有同样说明。

---

## 7. 认证相关的两个坑

- **curl 带 cookie 调用写接口会 403**：Payload 配了 `csrf` 时会校验 `Origin` / `Sec-Fetch-Site`。命令行测试要显式加 `-H "Origin: http://localhost:3000"`，或改用 `Authorization: JWT <token>`。
- **匿名读一律 403 是设计**：内容集合的 `read` 用 `canReadSite`（未登录返回 `false`），前台能显示靠 `overrideAccess: true`。不要为了「让前台能读」去放宽 `canReadSite`，那会把后台内容接口公开出去。
