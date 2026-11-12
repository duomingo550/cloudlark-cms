#!/usr/bin/env node
/**
 * scripts/backup-db.mjs — SQLite 备份 / 只读校验 / 受控恢复
 *
 * 用法
 * ----
 *   node scripts/backup-db.mjs backup            # 生成 backups/cloudlark-<YYYYMMDD-HHmmss>.db
 *   node scripts/backup-db.mjs verify <文件>      # 只读打开，做 integrity_check + 表数量 + 关键表行数
 *   node scripts/backup-db.mjs restore <文件>     # 停服务后用备份覆盖当前库（会先另存当前库）
 *   pnpm backup                                  # 等价于 backup 子命令
 *
 * 退出码：0 成功；1 校验失败（或备份/恢复过程本身失败）；2 用法错误；3 目标被占用。
 *
 * 为什么用 VACUUM INTO，而不是 copyFile
 * ------------------------------------
 * 1) 一致性快照。SQLite 的库是「主文件 + WAL」的组合，运行中直接复制 .db 得到的
 *    只是一份「某个时刻的主文件」，可能缺掉还没 checkpoint 进主文件的已提交事务；
 *    若复制过程中正好有写入，甚至可能拿到撕裂的页。VACUUM INTO 由 SQLite 自己在
 *    一个读事务里把内容重写到新文件，保证拿到的是「事务边界上的一致快照」。
 * 2) 不产生 -wal / -shm 残留。复制法必须把 .db-wal / .db-shm 一起搬走才算完整，
 *    漏一个就是「备份看着能开、数据却少一截」；VACUUM INTO 只写一个自包含的
 *    .db 文件，没有伴生文件，校验和恢复都只面对单个文件。
 * 3) 附带整理。VACUUM 会重写页面、丢掉空闲页，备份通常比在线库小，也顺手把
 *    碎片化的库「压实」了一遍。
 * 4) 目标文件必须不存在（SQLite 的硬要求），正好避免「备份把上一份好备份覆盖掉」。
 *
 * 为什么恢复前必须先停服务（SQLite 单写者）
 * -----------------------------------------
 * SQLite 的并发模型是「多读者、单写者」，且写者与读者之间靠文件锁协调：
 * 运行中的服务进程在 WAL 上持有自己的连接与页缓存，如果我们在它脚下把主文件
 * 换掉，它下一次 commit 会拿着旧的 WAL/页缓存往新文件上写 —— 轻则写回旧数据
 * （恢复被悄悄撤销），重则 WAL 与主文件不匹配直接让库变成 corrupt。
 * 所以本脚本先用 net 连一下 3000 端口判断服务是否在跑：在跑就**拒绝**（退出码 3）
 * 并提示先停服务；没在跑才继续。同理，覆盖前会把可能残留的 -wal / -shm 改名
 * 挪开（不是直接删），避免旧 WAL 被 SQLite 认领到新主文件上。
 *
 * 实现约束
 * --------
 * 零第三方依赖：优先用 Node 内置的 node:sqlite（Node 22+ 的 DatabaseSync），
 * 不可用时自动回退到 `python -c`（本机 python 自带 sqlite3 标准库）。
 * 两个后端做同样三件事：VACUUM INTO 备份、只读 inspect、供恢复后校验。
 * 脚本不读 .env：库路径用 DATABASE_FILE / DATABASE_URL 覆盖，默认仓库根目录的
 * cloudlark-local.db；备份目录用 BACKUP_DIR 覆盖，默认仓库根目录的 backups/。
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SERVICE_PORT = Number(process.env.SERVICE_PORT || 3000)
const KEY_TABLES = ['users', 'tools', 'articles']

/** 库路径：DATABASE_FILE 优先，其次 DATABASE_URL=file:./x.db，最后默认本地库。 */
function resolveDbPath() {
  if (process.env.DATABASE_FILE) return path.resolve(process.env.DATABASE_FILE)
  const url = process.env.DATABASE_URL || ''
  if (url.startsWith('file:')) return path.resolve(REPO_ROOT, url.slice('file:'.length))
  return path.join(REPO_ROOT, 'cloudlark-local.db')
}

const DB_PATH = resolveDbPath()
const BACKUP_DIR = path.resolve(process.env.BACKUP_DIR || path.join(REPO_ROOT, 'backups'))

// ── SQLite 后端探测 ─────────────────────────────────────────────────────────
// node:sqlite 在 Node 22.5 需要 --experimental-sqlite，22.13 起默认可用；导入失败
// 或没有 DatabaseSync 就回退 python，保证脚本在两种机器上都能跑。
let nodeSqlite = null
try {
  const mod = await import('node:sqlite')
  if (mod && typeof mod.DatabaseSync === 'function') nodeSqlite = mod
} catch {
  nodeSqlite = null
}
const BACKEND = nodeSqlite ? 'node:sqlite' : 'python -c sqlite3'

/** Windows 反斜杠交给 SQLite 时容易出岔子，统一成正斜杠再拼 SQL 字符串字面量。 */
function sqlPath(filePath) {
  return filePath.replace(/\\/g, '/')
}

/** SQL 字符串字面量转义：单引号翻倍。 */
function sqlLiteral(value) {
  return `'${sqlPath(value).replace(/'/g, "''")}'`
}

// ── python 回退：两个自包含小程序，参数走 argv，不经过 shell，无引号地狱 ──
const PY_INSPECT = `
import json, sqlite3, sys
path = sys.argv[1]
result = {"integrity": [], "tables": None, "counts": {}, "error": None}
con = None
try:
    con = sqlite3.connect("file:" + path.replace("\\\\", "/") + "?mode=ro", uri=True)
    result["integrity"] = [row[0] for row in con.execute("PRAGMA integrity_check").fetchall()]
    result["tables"] = con.execute("select count(*) from sqlite_master where type='table'").fetchone()[0]
    for name in ("users", "tools", "articles"):
        exists = con.execute(
            "select count(*) from sqlite_master where type='table' and name=?", (name,)
        ).fetchone()[0]
        result["counts"][name] = (
            con.execute('select count(*) from "%s"' % name).fetchone()[0] if exists else None
        )
except Exception as exc:
    result["error"] = str(exc)
finally:
    if con is not None:
        con.close()
print(json.dumps(result))
`

const PY_VACUUM = `
import sqlite3, sys
src, out = sys.argv[1], sys.argv[2]
con = sqlite3.connect(src)
try:
    con.execute("VACUUM INTO '%s'" % out.replace("'", "''"))
finally:
    con.close()
print("ok")
`

/**
 * 只读打开 dbPath 做三项检查。任何异常都收敛成 { ok:false, error }，
 * 由调用方决定退出码 —— 校验失败绝不能被当成「脚本崩了」。
 */
function inspect(dbPath) {
  if (nodeSqlite) {
    let db = null
    try {
      db = new nodeSqlite.DatabaseSync(dbPath, { readOnly: true })
      const integrity = db
        .prepare('PRAGMA integrity_check')
        .all()
        .map((row) => row.integrity_check ?? Object.values(row)[0])
      const tables = db
        .prepare("select count(*) as c from sqlite_master where type='table'")
        .get().c
      const counts = {}
      for (const table of KEY_TABLES) {
        const exists = db
          .prepare("select count(*) as c from sqlite_master where type='table' and name = ?")
          .get(table).c
        counts[table] = exists
          ? db.prepare(`select count(*) as c from "${table}"`).get().c
          : null
      }
      return { ok: true, integrity, tables, counts, error: null }
    } catch (error) {
      return { ok: false, integrity: [], tables: null, counts: {}, error: errorText(error) }
    } finally {
      try {
        db?.close()
      } catch {
        // 损坏的库 close 也可能抛；这里不能再把错误盖掉真正的失败原因。
      }
    }
  }

  try {
    const stdout = execFileSync('python', ['-c', PY_INSPECT, sqlPath(dbPath)], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const parsed = JSON.parse(stdout.trim())
    if (parsed.error) {
      return { ok: false, integrity: [], tables: null, counts: {}, error: parsed.error }
    }
    return {
      ok: true,
      integrity: parsed.integrity,
      tables: parsed.tables,
      counts: parsed.counts,
      error: null,
    }
  } catch (error) {
    return { ok: false, integrity: [], tables: null, counts: {}, error: errorText(error) }
  }
}

/** VACUUM INTO 生成自包含快照；目标文件已存在时交给调用方报错（SQLite 会拒绝）。 */
function vacuumInto(sourcePath, targetPath) {
  if (nodeSqlite) {
    const db = new nodeSqlite.DatabaseSync(sourcePath)
    try {
      db.exec(`VACUUM INTO ${sqlLiteral(targetPath)}`)
    } finally {
      db.close()
    }
    return
  }
  execFileSync('python', ['-c', PY_VACUUM, sqlPath(sourcePath), sqlPath(targetPath)], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function errorText(error) {
  return error?.message || String(error)
}

/** 本地时间戳：备份文件名用 YYYYMMDD-HHmmss，.bak 后缀用同一套。 */
function timestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('')
}

function formatBytes(bytes) {
  return `${bytes.toLocaleString('en-US')} 字节（${(bytes / 1024 / 1024).toFixed(2)} MiB）`
}

/** 连一下端口：能建立 TCP 连接就说明服务在监听。 */
function isPortInUse(port, host = '127.0.0.1', timeoutMs = 1000) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host })
    const finish = (value) => {
      socket.destroy()
      resolve(value)
    }
    socket.setTimeout(timeoutMs)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
  })
}

/** 打印 verify 结果；返回是否通过（integrity 只有一行 'ok' 才算通过）。 */
function printInspection(label, report) {
  console.log(`[verify] ${label}`)
  if (report.error) {
    console.log(`  integrity_check: 失败（${report.error}）`)
    console.log('  表数量:         —')
    for (const table of KEY_TABLES) console.log(`  ${table}: —`)
    console.log('  结论: FAIL')
    return false
  }
  const integrityOk = report.integrity.length === 1 && report.integrity[0] === 'ok'
  console.log(`  integrity_check: ${report.integrity.join(' | ') || '（无输出）'}`)
  console.log(`  表数量:         ${report.tables}`)
  for (const table of KEY_TABLES) {
    const value = report.counts[table]
    console.log(`  ${table}: ${value === null || value === undefined ? '（表不存在）' : value}`)
  }
  // integrity_check 通过但关键表是空的，说明备份「结构对、内容空」，同样不接受。
  const emptyKeyTable = KEY_TABLES.some((table) => {
    const value = report.counts[table]
    return typeof value === 'number' && value === 0
  })
  const ok = integrityOk && report.tables > 0 && !emptyKeyTable
  if (emptyKeyTable) {
    console.log('  注意:           关键表行数为 0（空库或表名对不上），不算通过')
  }
  console.log(`  结论: ${ok ? 'PASS' : 'FAIL'}`)
  return ok
}

function usage() {
  console.log(`用法:
  node scripts/backup-db.mjs backup             生成一致性快照到 ${path.relative(process.cwd(), BACKUP_DIR) || BACKUP_DIR}
  node scripts/backup-db.mjs verify <文件>       只读校验一个备份文件
  node scripts/backup-db.mjs restore <文件>      停服务后用备份覆盖当前库

环境变量:
  DATABASE_FILE / DATABASE_URL  覆盖目标库路径（默认仓库根 cloudlark-local.db）
  BACKUP_DIR                    覆盖备份目录（默认仓库根 backups/）
  SERVICE_PORT                  覆盖占用检测端口（默认 3000）

退出码: 0 成功 / 1 校验失败 / 2 用法错误 / 3 目标被占用
SQLite 后端: ${BACKEND}`)
}

function commandBackup() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`[backup] 目标库不存在: ${DB_PATH}`)
    return 1
  }
  fs.mkdirSync(BACKUP_DIR, { recursive: true })

  // 同一秒内重复执行时加序号，避免撞名（VACUUM INTO 也不允许覆盖已有文件）。
  const stamp = timestamp()
  let target = path.join(BACKUP_DIR, `cloudlark-${stamp}.db`)
  for (let index = 2; fs.existsSync(target); index += 1) {
    target = path.join(BACKUP_DIR, `cloudlark-${stamp}-${index}.db`)
  }

  console.log(`[backup] 源库:   ${DB_PATH}`)
  console.log(`[backup] 后端:   ${BACKEND}`)
  try {
    vacuumInto(DB_PATH, target)
  } catch (error) {
    console.error(`[backup] VACUUM INTO 失败: ${errorText(error)}`)
    return 1
  }
  const size = fs.statSync(target).size
  console.log(`[backup] 已生成: ${target}`)
  console.log(`[backup] 大小:   ${formatBytes(size)}`)
  console.log('[backup] 提示:   VACUUM INTO 产出单个自包含 .db，无 -wal/-shm 伴生文件')
  return 0
}

function commandVerify(fileArg) {
  const target = path.resolve(fileArg)
  if (!fs.existsSync(target)) {
    console.error(`[verify] 文件不存在: ${target}`)
    return 2
  }
  const stat = fs.statSync(target)
  console.log(`[verify] 文件: ${target}`)
  console.log(`[verify] 大小: ${formatBytes(stat.size)}`)
  const report = inspect(target)
  const ok = printInspection('只读检查结果', report)
  return ok ? 0 : 1
}

async function commandRestore(fileArg) {
  const source = path.resolve(fileArg)
  if (!fs.existsSync(source)) {
    console.error(`[restore] 备份文件不存在: ${source}`)
    return 2
  }
  if (source === path.resolve(DB_PATH)) {
    console.error('[restore] 源文件与目标库是同一个文件，拒绝执行')
    return 2
  }

  console.log(`[restore] 目标库: ${DB_PATH}`)
  console.log(`[restore] 备份源: ${source}`)

  // SQLite 单写者：服务还活着就立刻拒绝，一个字节都不碰（连只读校验也不做，
  // 免得运维误以为「已经开始恢复了」）。
  const busy = await isPortInUse(SERVICE_PORT)
  if (busy) {
    console.error(
      `[restore] 端口 ${SERVICE_PORT} 正在监听（127.0.0.1:${SERVICE_PORT}），拒绝恢复`,
    )
    console.error('  原因: SQLite 同一时刻只有一个写者。服务持有 WAL/页缓存，')
    console.error('        在它脚下替换主文件会导致恢复被写回、或 WAL 与主文件不匹配。')
    console.error(`  请先停掉服务（pnpm start 的进程），再重新执行: node scripts/backup-db.mjs restore ${fileArg}`)
    return 3
  }

  // 服务已停：再验备份。绝不把一份已经损坏的文件盖到线上库上（那才是真正的灾难）。
  const sourceReport = inspect(source)
  if (!printInspection('备份文件校验', sourceReport)) {
    console.error('[restore] 备份自身校验失败，拒绝恢复（当前库未改动）')
    return 1
  }

  const stamp = timestamp()
  if (fs.existsSync(DB_PATH)) {
    const backupOfCurrent = `${DB_PATH}.bak-${stamp}`
    fs.copyFileSync(DB_PATH, backupOfCurrent)
    console.log(`[restore] 当前库已另存: ${backupOfCurrent}`)
  } else {
    console.log('[restore] 当前库不存在，跳过另存')
  }

  // 旧 WAL/SHM 属于「旧主文件」，必须挪开而不是留下：
  // 留着会被 SQLite 认领到新主文件上，把新库污染成 corrupt。
  for (const suffix of ['-wal', '-shm']) {
    const sidecar = `${DB_PATH}${suffix}`
    if (fs.existsSync(sidecar)) {
      const moved = `${DB_PATH}.bak-${stamp}${suffix}`
      fs.renameSync(sidecar, moved)
      console.log(`[restore] 旧伴生文件已挪开: ${moved}`)
    }
  }

  fs.copyFileSync(source, DB_PATH)
  console.log(`[restore] 已用备份覆盖: ${DB_PATH}`)

  const afterReport = inspect(DB_PATH)
  const ok = printInspection('恢复后复校验', afterReport)
  if (!ok) {
    console.error(`[restore] 恢复后的库校验失败；原库备份在 ${DB_PATH}.bak-${stamp}`)
    return 1
  }
  console.log('[restore] 恢复完成。重新启动服务即可。')
  return 0
}

async function main(argv) {
  const [command, ...rest] = argv
  if (!command || command === '--help' || command === '-h' || command === 'help') {
    usage()
    return command ? 0 : 2
  }
  if (command === 'backup') return commandBackup()
  if (command === 'verify') {
    if (!rest[0]) {
      console.error('[verify] 缺少文件参数')
      usage()
      return 2
    }
    return commandVerify(rest[0])
  }
  if (command === 'restore') {
    if (!rest[0]) {
      console.error('[restore] 缺少文件参数')
      usage()
      return 2
    }
    return commandRestore(rest[0])
  }
  console.error(`未知子命令: ${command}`)
  usage()
  return 2
}

// 用 exitCode 而不是 process.exit()：管道/重定向时 process.exit 可能截断 stdout。
process.exitCode = await main(process.argv.slice(2))
