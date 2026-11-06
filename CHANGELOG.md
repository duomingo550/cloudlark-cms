# Changelog

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
