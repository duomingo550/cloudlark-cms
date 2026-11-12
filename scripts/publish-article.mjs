// 把「工具幕后」系列文章发进演示站（cloudlark-cms）
// 用法：node scripts/publish-article.mjs <md 文件路径>
// 依赖：本机已跑着的 CMS（默认 http://localhost:3000），.env 里的管理员账号

import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.CMS_BASE || 'http://localhost:3000';
const EMAIL = process.env.CMS_EMAIL;
const PASSWORD = process.env.CMS_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('缺少 CMS_EMAIL / CMS_PASSWORD 环境变量，脚本退出（口令只从环境变量读取）');
  process.exit(2);
}

// ---------- 极简 markdown → Payload lexical ----------
function textNode(text, format = 0) {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 };
}

// 行内 **粗体** → format 1
function richText(line) {
  const children = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0, m;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) children.push(textNode(line.slice(last, m.index)));
    children.push(textNode(m[1], 1));
    last = re.lastIndex;
  }
  if (last < line.length) children.push(textNode(line.slice(last)));
  if (!children.length) children.push(textNode(''));
  return children;
}

function para(line) {
  return { type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', children: richText(line) };
}

function heading(line, tag) {
  return { type: 'heading', tag, version: 1, format: '', indent: 0, direction: 'ltr', children: richText(line) };
}

function markdownToLexical(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^---$/.test(line)) continue;                       // front-matter 分隔
    if (/^#\s+/.test(line)) { blocks.push(heading(line.replace(/^#\s+/, ''), 'h1')); continue; }
    if (/^##\s+/.test(line)) { blocks.push(heading(line.replace(/^##\s+/, ''), 'h2')); continue; }
    if (/^###\s+/.test(line)) { blocks.push(heading(line.replace(/^###\s+/, ''), 'h3')); continue; }
    if (/^\*\s+/.test(line) || /^-\s+/.test(line)) {
      // 列表项：用 paragraph 承载（演示站样式不依赖 ul）
      blocks.push(para('· ' + line.replace(/^([*-])\s+/, '')));
      continue;
    }
    if (/^---+$/.test(line)) { blocks.push({ type: 'horizontalrule', version: 1 }); continue; }
    if (/^\*.*\*$/.test(line) && line.length > 2) {
      // 斜体整行（文末署名）
      blocks.push({ type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', children: [textNode(line.replace(/^\*|\*$/g, ''), 2)] });
      continue;
    }
    blocks.push(para(line));
  }
  return {
    root: {
      type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: blocks,
    },
  };
}

function parseFrontMatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta = {};
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  const body = m ? md.slice(m[0].length) : md;
  return { meta, body };
}

async function main() {
  const file = process.argv[2];
  if (!file) { console.error('用法: node scripts/publish-article.mjs <md>'); process.exit(2); }
  const md = fs.readFileSync(file, 'utf8');
  const { meta, body } = parseFrontMatter(md);
  if (!meta.title) { console.error('front-matter 缺 title'); process.exit(2); }

  // 1. 登录
  const login = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: BASE },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const loginJson = await login.json();
  if (!login.ok) { console.error('登录失败', login.status, JSON.stringify(loginJson).slice(0, 300)); process.exit(1); }
  const token = loginJson.token;
  console.log('登录 OK');

  // 2. 取站点
  const sites = await fetch(`${BASE}/api/sites?limit=1`, { headers: { Authorization: `JWT ${token}`, Origin: BASE } });
  const sitesJson = await sites.json();
  const siteId = sitesJson?.docs?.[0]?.id;
  if (!siteId) { console.error('拿不到站点 id'); process.exit(1); }
  console.log('站点 id =', siteId);

  // 3. 组装文章（news 的首个块用于摘要展示）
  const lexical = markdownToLexical(body);
  const payload = {
    title: meta.title,
    slug: meta.slug || undefined,
    excerpt: meta.excerpt || undefined,
    site: siteId,
    sourceName: '云雀CMS 开发手记',
    body: [{ blockType: 'richText', content: lexical }],
    _status: 'published',
  };

  const res = await fetch(`${BASE}/api/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}`, Origin: BASE },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) { console.error('创建失败', res.status, JSON.stringify(json).slice(0, 600)); process.exit(1); }
  console.log('创建成功 id =', json.doc.id, ' slug =', json.doc.slug, ' status =', json.doc._status);
  console.log('前台地址: ' + BASE + '/news/' + json.doc.slug);
}

main().catch((e) => { console.error(e); process.exit(1); });
