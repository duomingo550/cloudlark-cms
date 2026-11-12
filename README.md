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

- Node.js 22.23.4 or newer
- pnpm 12.x (see `packageManager` in `package.json`; the repo is developed against pnpm 12.5.1)
- Optional: ffmpeg for future audio transcoding

### Install and run

```bash
git clone https://github.com/duomingo550/cloudlark-cms.git
cd cloudlark-cms
pnpm install
cp .env.example .env
# Generate a value with:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Then replace the example PAYLOAD_SECRET with that value
pnpm seed
pnpm dev
```

Open:

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

The admin account is **not** seeded with a default password. Set both values in
`.env` before running `pnpm seed`:

```text
SEED_ADMIN_EMAIL=you@example.com
SEED_ADMIN_PASSWORD=<at-least-12-characters>
```

`pnpm seed` exits with a non-zero code and a Chinese error message if either
value is missing — this is deliberate, so that a fresh clone can never come up
with a publicly known admin password.

These values only matter at seed time. They are read from the environment, never
written into the repository.

To reset the password of an existing seeded user, set
`SEED_RESET_ADMIN_PASSWORD=true` before running `pnpm seed`. This updates the
existing user instead of only reading it back.

### Build

```bash
pnpm check
pnpm test:security
pnpm build
```

`pnpm start` runs a foreground server and blocks the terminal. `pnpm smoke`
needs a server that is already listening, so it cannot be chained directly
after `pnpm start`. Use two terminals:

```bash
# terminal 1
pnpm start

# terminal 2, once the server has printed "Ready"
pnpm smoke
pnpm verify:phase1
```

`pnpm verify:phase1` is the content-level suite: it checks a single `<h1>` per
page, anonymous API rejection, the 404 on an unknown host, and that draft
articles never leak to the public site.

### Before deploying to production

Two things will bite you if you skip them:

1. **The database must exist before the server starts.** With
   `NODE_ENV=production` the SQLite adapter does not create tables, so a
   production build pointed at an empty file answers `500` with
   `SQLITE_ERROR: no such table: sites`. Either run `pnpm seed` against the
   target database first, or ship a database that has already been migrated.
2. **`PAYLOAD_SECRET` must be at least 32 characters** and must not be the
   example value. The server refuses to boot otherwise.

Also set `ALLOWED_HOSTS` to the real domain and keep
`ALLOW_UNMATCHED_HOST_FALLBACK=false`. With the fallback enabled, any unknown
`Host` header resolves to the default site instead of returning `404`.

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
ALLOWED_HOSTS=localhost,127.0.0.1
```

PostgreSQL:

```text
DATABASE_ADAPTER=postgres
DATABASE_URL=postgres://user:password@host:5432/cloudlark
```

Production deployments must replace local media storage with object storage,
configure HTTPS, and use a strong `PAYLOAD_SECRET`.

Set `ALLOWED_HOSTS` to the comma-separated public hosts served by the
deployment. In production, unknown hosts are rejected instead of falling back
to the default site.

Before sharing or archiving the folder, remove local secrets and generated data
on Windows:

```powershell
./scripts/clean-local.ps1
```

Add `-IncludeDependencies` to remove `node_modules` as well.

## Project status

Current release: **v0.1.0-alpha.2**

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
