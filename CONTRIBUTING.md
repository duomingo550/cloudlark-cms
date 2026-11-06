# Contributing

Thank you for considering a contribution. This project is at an early stage,
so small and focused changes are easier to review than large rewrites.

## Before you start

- Search existing issues and discussions first.
- Open an issue before building a large feature.
- Keep pull requests focused on one problem.
- Never include passwords, access tokens, customer data, or private domains.

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm seed
pnpm dev
```

Before submitting:

```bash
pnpm check
pnpm build
```

If the application is running:

```bash
pnpm smoke
```

## Pull requests

Please describe:

- The problem being solved
- What changed
- How it was tested
- Screenshots for visual changes
- Known limitations or follow-up work

Avoid mixing formatting-only changes with behavioral changes.

## Content model changes

Changes to collections, fields, access rules, or public routes should explain:

- Existing data impact
- Migration needs
- Security impact
- API or frontend compatibility

## Security

Do not report vulnerabilities in public issues. Follow `SECURITY.md`.

## License

By contributing code, you agree that your contribution may be distributed
under the repository's MIT License.
