# Changelog

## Unreleased - branch `codex/cloudlark-workbench`

Not tagged yet; this is what `main` does not have.

Content

- Add a `videos` collection with list and detail pages, plus a `video-assets`
  upload collection and embed players for Bilibili, YouTube, Vimeo, Tencent,
  and external links
- Add a `leads` collection and `/contact` page; submissions are stored in the
  admin, rate-limited by email and IP, and optionally forwarded to a webhook
- Allow a music track to play an external streaming URL when no file is
  uploaded, and accept WAV uploads
- Surface published/draft state in the admin and auto-fill slug and site

SEO / GEO

- Generate `sitemap.xml`, `robots.txt`, `llms.txt`, and `rss.xml` at request
  time from published content
- Add JSON-LD for the site, articles, products, and breadcrumbs
- Add a dynamic Open Graph image with a bundled Chinese font subset
- Add per-page keywords, author, Twitter card, and `og:type=article` with
  publication timestamps
- Allow Chinese search engines and AI crawlers explicitly in `robots.txt`

Operations

- Add an initial SQLite migration and disable schema push under
  `NODE_ENV=production`
- Add `scripts/backup-db.mjs` with `backup`, `verify`, and `restore`
- Extend `scripts/verify-phase1.mjs` to twelve HTTP assertions
- Add `docs/ACCEPTANCE.md` and `docs/RUNBOOK.md`

Security

- Remove hardcoded admin credentials from scripts; they read
  `CMS_EMAIL` / `CMS_PASSWORD` and exit when missing
- Reject SVG uploads and validate URLs on products, learning paths, and tracks
- Require login before serving files from `download-assets`
- Mask visitor email addresses in lead logs
- Raise the request-body guard to cover `video-assets`

## 0.1.0-alpha.2 - 2026-11-06

Tenant-isolation and final release-hardening update.

- Scope image, audio, and download collection mutations to site membership
- Keep uploaded files directly readable while hiding metadata listings
- Prevent editors from moving content between sites
- Block backslash and control-character redirect bypasses
- Add HTTP upload preflight limits and per-site storage quotas
- Add `ALLOWED_HOSTS` and reject unknown production hosts
- Add CSP Report-Only and HSTS headers
- Whitelist section filter fields and content collections
- Ignore and clean local verification/harness scratch artifacts

## 0.1.0-alpha.1 - 2026-11-06

Security and release-readiness update.

- Upgrade Payload and first-party packages to 3.93.0
- Fix exact host-based site resolution and cache site lookup per request
- Enforce upload limits for images, audio, and downloadable files
- Add protocol allowlists for rich-text links and video links
- Reject unsafe external-section redirects
- Restrict admin access to platform admins and site members
- Add login-attempt locks, token expiry, and password-length validation
- Add baseline security response headers
- Fail fast on missing or example `PAYLOAD_SECRET`
- Pin transitive security overrides and add dependency audit to CI

## 0.1.0-alpha - 2026-11-06

Initial public foundation.

- Multi-site Payload admin
- Site memberships and scoped access
- Configurable sections and navigation
- Pages, articles, tutorials, tools, products, tracks, skills, comics
- Mixed-media blocks
- Audio upload and player
- Search, SEO fields, and responsive public site
- SQLite development and PostgreSQL adapter
- Seed demo, smoke test, and architecture documentation
