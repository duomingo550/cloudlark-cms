# 云雀 CMS 架构

## 产品边界

第一版定位为“AI 创业者官网 CMS”，底层保留多租户能力。

产品不自建 WordPress 插件生态，也不提供任意 PHP、HTML 或 JavaScript
执行能力。可配置范围控制在已注册的内容类型、区块和模板内。

## 运行面

```text
浏览器
  ├── 客户官网：Next.js 前台，根据 Host 匹配站点
  └── 管理后台：Payload Admin
          │
          ├── PostgreSQL / SQLite
          ├── 本地媒体或对象存储
          └── 后续发布 Worker
```

当前第一版是单一 Next.js 应用，但域名和权限从第一天按多站点设计。
后续可以把发布 Worker、AI 任务和音频转码拆为独立进程。

## 内容核心

所有内容都保留统一公共字段：

```text
id
site
slug
title / name
excerpt / summary
body blocks
SEO fields
_status
createdAt
updatedAt
```

内容类型：

- `pages`
- `articles`
- `tutorials`
- `tools`
- `products`
- `tracks`
- `learning-paths`
- `skills`
- `comic-series`
- `comic-chapters`

分类法：

- `category`
- `audience`
- `level`
- `tag`

## 栏目与内容类型解耦

`sections` 不存储内容，只描述如何展示：

```text
label
kind
sourceCollection
filter
routePath
templateKey
position
visible
showInNav
showOnHome
```

因此新增一两个栏目时，不需要修改前台代码。只有新增一种全新交互或
模板时，才需要开发。

## 媒体模型

- `media`：图片与分享图
- `audio-assets`：MP3、M4A、AAC、OGG
- `download-assets`：ZIP、PDF 等数字交付文件

每条资产保留站点归属、标题、版权、版本、访问策略等元数据。

## 音频设计

第一版音频播放使用 HTML5 Audio + Range 请求，不依赖流媒体服务。

```text
track
  ├── cover
  ├── audio-asset
  ├── lyrics
  ├── credits
  ├── license
  ├── streaming links
  └── description blocks
```

不包含 HLS、DRM、订阅会员和版权结算。

## 权限

平台角色：

- `admin`：可管理所有站点
- `user`：通过 memberships 获得站点权限

站点角色：

- `owner`
- `editor`
- `viewer`

内容读取对匿名用户只返回已发布内容。写操作要求站点成员关系。

## 运行时 SEO / GEO 路由

这些路由都在请求时读库生成，不写静态文件，内容一改立刻生效：

```text
/sitemap.xml          已发布内容 + 栏目列表页 + 独立页面，带 lastmod/priority
/robots.txt           搜索引擎、中文搜索引擎、AI 爬虫分段；指向 sitemap
/llms.txt             给 AI 读的站点说明：定位、栏目、可引用事实、检索入口
/rss.xml              最新文章
/opengraph-image      动态分享图（中文字体子集打包在仓库内，离线可用）
```

页面级元数据由 `src/lib/seo.ts` 的 `pageMetadata()` 统一产出：标题、描述、
canonical、`noindex`、关键词（取自标签）、作者、Twitter 卡片、`og:type=article`
与发布时间。结构化数据由 `src/components/site/JsonLd.tsx` 输出 WebSite、
Article、Product 与 BreadcrumbList。

## 数据迁移与备份

结构变更只走迁移：`src/migrations/` 里的迁移按文件名顺序执行，生产环境
（`NODE_ENV=production`）关闭 Payload 的自动改表。上线顺序固定为
`payload migrate` → 起服务。

`scripts/backup-db.mjs` 提供 `backup` / `verify` / `restore` 三个子命令，
退出码 0/1/2/3 分别代表成功、校验失败、参数错误、文件不存在。

## 静态发布演进

当前前台由 Next.js 服务端读取数据库。下一阶段增加：

```text
Release → 静态 HTML/CSS → 对象存储 → CDN
```

数据库只负责编辑，客户访问不依赖数据库。这样 CMS 故障不会影响已经
发布的客户官网。

## 后续优先级

1. 对象存储适配器。
2. 自定义域名验证和 HTTPS。
3. 发布快照、回滚和 CDN 部署。
4. 音频转码与时长/大小配额。
5. 站点成员自助管理。
6. AI 生成首版页面、文案和 SEO（当前只有不联网的草稿脚手架）。
7. 下载文件的授权与订单打通（当前只要求登录）。
