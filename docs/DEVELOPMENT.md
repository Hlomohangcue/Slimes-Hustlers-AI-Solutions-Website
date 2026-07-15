# Development Guide

## Purpose

This guide helps new and existing engineers onboard to the Slimes.Hustlers AI Solutions website repository from zero to productive local development.

This document aligns with:

- CONTRIBUTING.md
- docs/TESTING.md
- docs/DEPLOYMENT.md

## Prerequisites

Install the following tools before cloning the repository:

- Git
- Node.js 22 (recommended for CI parity)
- npm (bundled with Node.js)
- Wrangler CLI (via npx or global install)

Recommended verification commands:

```bash
git --version
node --version
npm --version
npx wrangler --version
```

## Repository Setup From Zero

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Slimes.Hustlers Web Site"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment and Secrets

- Review .env.example for local configuration placeholders.
- Do not commit local secret files.
- Configure Worker runtime secrets when testing authenticated API behavior:

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_TOKEN
```

### 4. Start Local Development

Frontend-only preview:

```bash
npm run start
```

Full Worker runtime (API + static assets):

```bash
npx wrangler dev
```

## Local Development Workflow

Follow this loop for normal feature delivery:

1. Create a branch from main.
2. Implement focused changes.
3. Run relevant tests locally.
4. Update docs when behavior, APIs, or operational workflows change.
5. Open a pull request with clear context and test evidence.

Recommended daily command flow:

```bash
npm install
npm run test:sanitize
npm test
```

## Running Tests

Testing strategy and details are documented in docs/TESTING.md.

Common commands:

```bash
npm test
npm run test:playwright
npm run test:sanitize
npm run test:headed
```

What each does:

- npm test: Starts local server and runs Playwright integration tests.
- npm run test:playwright: Runs Playwright tests directly.
- npm run test:sanitize: Runs Node-based unit-style tests.
- npm run test:headed: Runs browser tests in headed mode for debugging.

## Code Organization

Project layout overview:

- src/: Worker routing and API handlers
- public/: Static frontend pages, styles, scripts, images, and seeded data
- tests/: Node and Playwright test suites
- docs/: Operational and engineering documentation
- .github/workflows/: CI/CD workflows
- wrangler.jsonc: Cloudflare Workers runtime and bindings configuration

Code-level responsibilities:

- src/index.js: Worker entrypoint and route orchestration.
- src/contacts.js: Contact ingestion and protected retrieval logic.
- src/login.js: Admin authentication endpoint.
- src/logout.js: Admin session termination endpoint.
- src/sanitize.js: Input sanitization and validation utility.

## Branch Workflow

Branching model follows repository governance:

- Primary integration branch: main
- Supported equivalent protected branch: master

Use branch prefixes:

- feature/<short-description>
- fix/<short-description>
- hotfix/<short-description>
- docs/<short-description>

Branch workflow steps:

1. Sync latest main.
2. Create branch for scoped work.
3. Commit logical changes with clear messages.
4. Push branch and open pull request.

## Pull Request Expectations

PR quality standards are defined in CONTRIBUTING.md.

Every pull request should include:

- Clear problem statement and solution summary.
- Risk and impact notes for production behavior.
- Test evidence (commands run and outcomes).
- Documentation updates for any behavior or process change.

Before requesting review, verify:

- Tests pass locally for affected areas.
- No credentials, tokens, or secrets are committed.
- Changes are scoped and do not include unrelated refactors.

## Debugging Workflow

Use a structured approach for faster triage and safer fixes.

### 1. Reproduce

- Reproduce the issue locally with a minimal path.
- Capture endpoint, request payload, and browser/network context.

### 2. Isolate

- Determine whether issue is frontend, API handler, auth flow, or configuration.
- Validate behavior against expected contract in docs/API.md.

### 3. Inspect

- Use browser developer tools for client-side issues.
- Use wrangler dev output for Worker/runtime diagnostics.
- Review relevant test files and extend coverage if bug path is untested.

### 4. Validate Fix

Run targeted and broad tests:

```bash
npm run test:sanitize
npm test
```

### 5. Prepare PR

- Document root cause and fix approach.
- Include regression test updates.
- Note any operational implications for deployment or monitoring.

## CI/CD Awareness for Developers

The GitHub Actions workflow validates and deploys through gated stages:

1. Test
2. Validate (wrangler dry-run)
3. Deploy (main/master push only)

Developer implication:

- If local tests are not passing, CI will block deployment.
- Keep branch changes CI-ready before opening PR.

## Where To Go Next

- Contribution standards: CONTRIBUTING.md
- Test details and conventions: docs/TESTING.md
- Deployment workflow and rollback: docs/DEPLOYMENT.md
- Release process and versioning: docs/RELEASES.md
