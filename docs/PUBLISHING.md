# 第一次发布到 GitHub

> **状态说明（2026-11-12 补）**：这是**建仓当时的记录**。仓库现在已经在
> `github.com/duomingo550/cloudlark-cms`，工作分支是 `codex/cloudlark-workbench`。
> 因此「新建 GitHub 仓库、本地初始化」这两步已经删除，日常只需要在本地提交后
> `git push origin codex/cloudlark-workbench`。
>
> 另外：本文讲的是「把代码推到 GitHub」，**不是**「把内容发布到网站」。
> 内容发布请看 README 的「Build」与「Before deploying to production」两节。

这个目录已经是一个独立的开源项目，不要把私有云雀网站目录一起上传。

## 1. 检查公开信息

仓库已经按 GitHub 账号 `duomingo550` 配置：

```text
Repository: https://github.com/duomingo550/cloudlark-cms
Owner: duomingo550
```

如果需要改用其他账号或真实姓名，请在推送前修改 `README.md`、`package.json` 和
`.github/ISSUE_TEMPLATE/config.yml`。

## 2. GitHub 仓库设置

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

## 3. 发布第一个 Release

建议标签：

```text
v0.1.0-alpha.2
```

标题：

```text
Cloud Lark CMS — security-ready public alpha
```

Release 说明直接引用 `CHANGELOG.md`，并明确：

- 可以体验和二次开发
- 暂不建议用于生产客户网站
- 最需要真实使用场景和具体反馈

## 4. 发布后的第一周

不要只发一条“求 Star”。更有效的做法是：

1. 发一篇中文长文，讲清楚你为什么做这个 CMS。
2. 发一条短内容，展示首页、后台和音乐播放器截图。
3. 找 5 个真实的目标用户试用。
4. 问三个具体问题：会不会用、哪里没用、愿意为什么付费。
5. 把真实反馈整理成 GitHub Issue，并公开回应。

开源项目的可信度来自持续更新、真实讨论和可复现的发布，而不是单次宣传。
