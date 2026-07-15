# Contributing Guide

Thank you for contributing to Slimes.Hustlers AI Solutions projects.

This repository powers a production AI solutions company website and lead intake workflow. Contributions must preserve reliability, security, and business continuity.

## Code of Professional Conduct

By participating, you agree to:

- Communicate respectfully and constructively
- Keep client trust, privacy, and security as top priorities
- Avoid introducing changes that could degrade production behavior without explicit approval

## Before You Start

1. Read the README and existing tests to understand behavior and constraints.
2. Search open issues and pull requests to avoid duplicate work.
3. For substantial changes, open an issue first to align on scope and approach.

## Branching and Commit Expectations

1. Create a feature branch from main.
2. Keep changes focused and atomic.
3. Use clear commit messages that explain intent and impact.
4. Avoid mixing refactors with functional changes unless required.

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Run local static preview:

```bash
npm run start
```

3. Run Worker runtime locally:

```bash
npx wrangler dev
```

## Testing Requirements

Run relevant tests before opening a pull request.

- Full browser tests:

```bash
npm test
```

- Playwright tests directly:

```bash
npm run test:playwright
```

- Sanitize tests:

```bash
npm run test:sanitize
```

If your change touches auth, contacts, routing, or sanitization, include or update tests that validate the behavior.

## Pull Request Checklist

A pull request should include:

- A concise summary of the problem and solution
- Why the change is needed
- Risk notes for production behavior
- Test evidence and results
- Documentation updates when APIs, setup, or behavior change

Before requesting review, confirm:

- [ ] Existing application behavior remains intact unless intentionally changed
- [ ] Security-sensitive logic changes are clearly documented
- [ ] Tests pass locally for affected areas
- [ ] No secrets or credentials are committed
- [ ] User-facing and maintainer docs are updated where needed

## Security Contributions

If you discover a security issue, do not file a public issue.

Follow SECURITY.md for responsible disclosure instructions.

## Release and Changelog Expectations

- Add notable user-facing and operational changes to CHANGELOG.md.
- Follow semantic versioning intent for release notes.
- Keep release entries concise and auditable.

## Documentation Standards

- Write documentation for production operators and contributors, not just for local development.
- Prefer explicit examples and reproducible commands.
- Keep naming and terminology consistent with Slimes.Hustlers AI Solutions branding.

## Review and Merge

Maintainers may request changes for security, stability, compliance, or platform consistency. Merges are completed by maintainers after review approval and validation.
