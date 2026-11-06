# Cloud Lark CMS

**A lightweight, mixed-media CMS for AI founders, independent creators, and small businesses.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: Alpha](https://img.shields.io/badge/status-early--alpha-orange.svg)](ROADMAP.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Payload](https://img.shields.io/badge/Payload-3-blue.svg)](https://payloadcms.com/)

> **Early Alpha:** This project is functional and tested, but it is not yet
> production-ready for client websites. Use it for experiments, feedback, and
> contributions.

Cloud Lark CMS is an opinionated alternative to heavyweight website platforms.
It combines a structured content backend, an independent admin panel, and a
fast public website in one TypeScript codebase.

It is designed for mixed-media publishing: articles, tools, tutorials,
products, audio, charts, comics, and downloadable files.

[中文说明](README.zh-CN.md) · [Architecture](docs/ARCHITECTURE.md) · [Roadmap](ROADMAP.md) · [Contributing](CONTRIBUTING.md)

## Screenshots

| Public website | Mobile |
| --- | --- |
| ![Public website](docs/screenshots/home-desktop.png) | ![Mobile website](docs/screenshots/home-mobile.png) |

![Search and content discovery](docs/screenshots/search.png)

### Admin

![Admin content editor](docs/screenshots/admin-content.png)

## Why another CMS?

Most small business websites need a clear website, a maintainable admin panel,
and a way to publish more than plain articles. WordPress is powerful, but it
also brings a plugin ecosystem, a heavy admin experience, and operational
overhead that many solo founders do not need.

Cloud Lark CMS takes a narrower approach:

- An independent admin panel instead of editing HTML files.
- A small set of structured content types instead of an unbounded page builder.
- Configurable sections instead of hard-coded navigation.
- Mixed-media blocks instead of article-only publishing.
- A public site that reads and renders content separately from the admin.

## Why I built this

I am an independent founder with decades of experience in small businesses,
websites, retail, farming, and manufacturing. I started learning AI seriously
and wanted a real project that could turn that learning into something useful.

Cloud Lark CMS is that project: a small but complete system for the kind of
website I needed myself — structured, maintainable, and able to publish
articles, audio, video, and digital products without adopting a heavyweight
platform.

I am publishing it early because real feedback is more useful than building in
private for another year.

## Features

- Multi-site data model with site memberships
- Independent Payload admin at `/admin`
- Site-scoped sections, navigation, and homepage configuration
- Pages, articles, tutorials, tools, products, tracks, paths, skills, comics
- Structured blocks: rich text, images, galleries, video, audio, charts,
  comic pages, and file downloads
- Drafts and version history
- Audio upload and accessible HTML5 player
- Full-site keyword search
- SEO fields and structured page metadata
- SQLite for local development and a PostgreSQL adapter for production
- Host-based site resolution for multi-site deployments
- Responsive server-rendered frontend

## Who is it for?

- AI founders and independent developers who need a product website
- AI creators who publish articles, audio, video, charts, and digital products
- Small businesses that need a maintainable website without WordPress
- Developers who want a small, typed CMS foundation to extend

## Who is it not for?

- Teams that need a mature plugin marketplace
- Large editorial organizations with complex approval workflows
- Stores that need full commerce, checkout, tax, and fulfillment
- Users who need a no-code drag-and-drop page builder today

See [ROADMAP.md](ROADMAP.md) for the planned direction.

## Quick start

### Requirements

- Node.js 22.14 or newer
- pnpm 10 or newer
- Optional: ffmpeg for future audio transcoding

### Install and run

```bash
git clone https://github.com/YOUR_NAME/cloudlark-cms.git
cd cloudlark-cms
pnpm install
cp .env.example .env
pnpm seed
pnpm dev
```

Open:

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

The local demo credentials come from `.env`:

```text
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change-this-password
```

The seeded defaults are only for local development. Change both values before
using a persistent database.

### Build

```bash
pnpm check
pnpm build
pnpm start
pnpm smoke
```

## Tech stack

- Next.js 16
- Payload CMS 3
- React 19
- TypeScript
- SQLite or PostgreSQL
- Sharp
- S3-compatible object storage recommended for production

## Content model

```text
Sites
  ├── Sections
  ├── Pages
  ├── Articles
  ├── Tutorials
  ├── Tools
  ├── Products
  ├── Tracks
  ├── Learning paths
  ├── Skills
  ├── Comic series
  └── Comic chapters

Assets
  ├── Images
  ├── Audio
  └── Download files
```

Sections reference existing content types and templates. Adding a new section
does not require changing the public-site code.

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the design.

## Environment

Local SQLite:

```text
DATABASE_ADAPTER=sqlite
DATABASE_URL=file:./cloudlark.db
```

PostgreSQL:

```text
DATABASE_ADAPTER=postgres
DATABASE_URL=postgres://user:password@host:5432/cloudlark
```

Production deployments must replace local media storage with object storage,
configure HTTPS, and use a strong `PAYLOAD_SECRET`.

## Project status

Current release: **v0.1.0-alpha**

What works:

- Admin login and tenancy model
- Seeded content and section rendering
- Search, article detail, tool detail, product detail
- Audio upload/player path
- Build, type check, and smoke tests

Known limitations:

- No S3/OSS storage adapter in the default setup
- No automatic custom-domain DNS or certificate flow
- No payment, order, or download entitlement system
- No background audio transcoding
- No visual page builder
- No production migration/rollout pipeline

## Contributing

Feedback is the main reason this project is public.

Useful contributions include:

- Testing the starter on your operating system
- Reporting unclear setup steps
- Suggesting content-model improvements
- Improving accessibility and mobile behavior
- Adding focused tests
- Proposing small, reviewable features

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Do not open a public issue for a security vulnerability. See
[SECURITY.md](SECURITY.md).

## License

Source code is released under the [MIT License](LICENSE).

Demo content, audio, screenshots, and brand usage are described in
[LICENSES.md](LICENSES.md) and [TRADEMARK.md](TRADEMARK.md).
