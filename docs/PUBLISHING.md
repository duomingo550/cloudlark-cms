# 第一次发布到 GitHub

这个目录已经是一个独立的开源项目，不要把私有云雀网站目录一起上传。

## 1. 创建 GitHub 空仓库

在 GitHub 新建公开仓库，名称建议：

```text
cloudlark-cms
```

不要勾选自动生成 README、.gitignore 或 License，因为项目中已经有了。

## 2. 替换公开占位符

把下面两个文件中的 `YOUR_NAME` 和 `OWNER` 换成你的 GitHub 用户名：

- `README.md`
- `.github/ISSUE_TEMPLATE/config.yml`

例如用户名为 `yunque-mingshu`：

```text
YOUR_NAME → yunque-mingshu
OWNER     → yunque-mingshu
```

同时确认 `LICENSE` 中的版权署名。如果不希望使用“云雀明叔”作为版权署名，可以改成真实姓名。

## 3. 初始化 Git

在 PowerShell 中执行：

```powershell
cd path\to\cloudlark-cms

git init -b main
git config user.name "你的 GitHub 用户名"
git config user.email "你的 GitHub 邮箱"
git add .
git status
git commit -m "feat: initial Cloud Lark CMS alpha"

git remote add origin https://github.com/YOUR_NAME/cloudlark-cms.git
git push -u origin main
```

推送前确认 `git status` 中没有：

```text
.env
cloudlark.db
media/
node_modules/
.next/
```

这些文件已经在 `.gitignore` 中排除。

## 4. GitHub 仓库设置

建议在仓库设置中完成：

- Description：`A lightweight, mixed-media CMS for AI founders and small businesses.`
- Website：上线 Demo 后再填写。
- Topics：

```text
cms, headless-cms, nextjs, payloadcms, typescript, ai,
small-business, multi-tenant, content-management
```

- 开启 Issues。
- 开启 Discussions，用于收集真实使用场景。
- 开启 Private vulnerability reporting。
- 上传社交分享图，可以使用 `docs/screenshots/home-desktop.png`。

## 5. 发布第一个 Release

建议标签：

```text
v0.1.0-alpha
```

标题：

```text
Cloud Lark CMS — first public alpha
```

Release 说明直接引用 `CHANGELOG.md`，并明确：

- 可以体验和二次开发
- 暂不建议用于生产客户网站
- 最需要真实使用场景和具体反馈

## 6. 发布后的第一周

不要只发一条“求 Star”。更有效的做法是：

1. 发一篇中文长文，讲清楚你为什么做这个 CMS。
2. 发一条短内容，展示首页、后台和音乐播放器截图。
3. 找 5 个真实的目标用户试用。
4. 问三个具体问题：会不会用、哪里没用、愿意为什么付费。
5. 把真实反馈整理成 GitHub Issue，并公开回应。

开源项目的可信度来自持续更新、真实讨论和可复现的发布，而不是单次宣传。
