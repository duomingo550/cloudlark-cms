# Security Policy

## Supported versions

Cloud Lark CMS is currently **Early Alpha**. Only the latest commit on the
default branch is supported for security fixes.

It is not yet recommended for production websites without an independent
security review.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting or open a private security
advisory for this repository.

Do not publish exploit details, credentials, customer data, or server access
information in a public issue.

Include:

- Affected version or commit
- Reproduction steps
- Expected impact
- Suggested mitigation, if known

## Known production hardening requirements

- Run `pnpm audit --prod --audit-level high` before each release.
- Replace local media storage with object storage and a CDN.
- Use HTTPS and a strong `PAYLOAD_SECRET`.
- Change all seeded admin credentials.
- Use PostgreSQL for multi-user production deployments.
- Add backup, monitoring, rate limiting, and upload scanning.
- Review the tenancy access rules for your deployment model.
