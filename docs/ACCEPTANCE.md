# 验收单（ACCEPTANCE）

> 目的：任何人（包括三个月后的你）从一台干净机器出发，照着这份单子，**能判断这套 CMS 到底能不能用**。
> 每一步都有「命令 → 期望输出 → 实际不符合时算不算没通过」。
> 最后一步是「什么算没通过」的判定标准。

## 前置

- Node ≥ 22.23.4（`node -v` 确认）
- pnpm 12.x（`pnpm -v`；以 `package.json` 的 `packageManager` 为准）
- 端口 3000 空闲

## 第 1 步 · 版本

```bash
node -v
pnpm -v
```

**期望**：Node 版本 ≥ `v22.23.4`；pnpm 主版本为 12。

**不合格**：低于 22.23.4 仍可构建，但 Payload 未在该区间声明支持，不得用于交付验收。

## 第 2 步 · 安装依赖

```bash
pnpm install --frozen-lockfile
```

**期望**：退出码 0；`node_modules/.modules.yaml` 存在。

**不合格**：出现 `ERR_PNPM_*` 且退出码非 0。若只是 `EBADENGINE` 警告，不算失败（`engines` 不阻断）。

## 第 3 步 · 配置

```bash
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

把输出的 64 位随机串填入 `.env` 的 `PAYLOAD_SECRET`，并**必须**填写管理员账号：

```text
SEED_ADMIN_EMAIL=you@example.com
SEED_ADMIN_PASSWORD=<至少 12 位>
```

**期望**：`PAYLOAD_SECRET` 长度 ≥ 32；两项 admin 变量非空。

**不合格**：`PAYLOAD_SECRET` 沿用示例值 → 服务拒绝启动；admin 变量为空 → 下一步 seed 直接失败（这是故意的，防止公开仓库带默认口令）。

## 第 4 步 · 建库（含幂等）

```bash
pnpm seed                      # 第一次
pnpm seed                      # 第二次，必须与第一次结果一致
```

**期望**：两次都退出码 0，且第二次打印的 `counts` 与第一次**逐项相同**（工具 17、文章 4 … 音乐 3、漫画系列 2 等）。第二次不应再产生新的 `media/` 文件。

**不合格**：第二次计数翻倍 → 幂等坏了，会污染演示站。

**注意**：这一步是**生产部署的硬前置**。生产模式（`NODE_ENV=production`）下 SQLite 适配器不会建表，空库起服务必报 `500 no such table: sites`。

## 第 5 步 · 静态检查

```bash
pnpm check
pnpm test:security
```

**期望**：两者退出码 0；`test:security` 输出 `pass 3` / `fail 0`。

**不合格**：TS 报错，或安全单测失败。

## 第 6 步 · 构建并启动

```bash
pnpm build          # 期望退出码 0，输出含路由表（/admin、/api/*、/videos 等）
pnpm start          # 前台阻塞，另开终端做下一步
```

**期望**：`/` 返回 200 且标题含站点名；`/admin/login` 返回 200。

**不合格**：`/` 500 且日志为 `SQLITE_ERROR: no such table` → 第 4 步没做或做在别的库上。

## 第 7 步 · 登录后台并发布一条内容

浏览器打开 `http://localhost:3000/admin`，用第 3 步的账号登录；进入「教程」，打开种子里的 **草稿** `tutorial-3`，点右上「**发布**」。

**期望**：草稿变为「已发布」。

**不合格**：只点「保存」→ 前台不会变（前台只认 `published`）。这是最常见的一次误判。

## 第 8 步 · 前台可见性

```bash
pnpm smoke
pnpm verify:phase1
```

**期望**：
- `smoke`：`Smoke test passed: 15 pages + authenticated API`
- `verify:phase1`：`7/7 passed`

**注意**：`pnpm start` 是前台阻塞进程，`pnpm smoke` 必须在**另一个终端**里跑。把两者写在同一段脚本里，`smoke` 永远执行不到。

## 什么算「没通过」

以下任一条成立，本次验收即为**未通过**，不得对外说「能用」：

1. 第 4 步第二次 seed 的计数与第一次不同；
2. `pnpm check` / `pnpm build` 任一非 0；
3. `/` 或 `/admin/login` 不是 200；
4. `verify:phase1` 不足 7/7；
5. 第 7 步发布后，前台列表页看不到该条目；
6. 任何一步的「期望」是用「看起来对」代替的 —— 没有原始输出就不算通过。

## 已知不在这份单子里的事

- 生产建表（migrations）：尚未纳入，当前靠「先 seed 或随包带库」。
- 部署到服务器（宝塔/SSH）：属下一阶段，见 `STANDING-RULES.md` R7.1。
- AI 真实生成：接口已留，但未接模型，`AI_NOT_CONFIGURED` 是预期行为。
