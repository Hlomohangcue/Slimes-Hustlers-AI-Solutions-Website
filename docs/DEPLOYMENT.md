# Deployment Guide

## Purpose

This document defines how to deploy the Slimes.Hustlers AI Solutions website and API to Cloudflare Workers in a safe, repeatable way.

This guide aligns with:

- .github/workflows/ci.yml
- docs/RELEASES.md
- docs/SECURITY.md

## Environment Setup Requirements

## Tooling

- Node.js 22 recommended for CI parity.
- npm (bundled with Node.js).
- Wrangler CLI (invoked via npx or installed globally).
- Cloudflare account with Workers and KV access.

## Required Configuration

- wrangler.jsonc configured with:
  - Worker name.
  - assets.directory pointing to ./public.
  - CONTACTS_KV binding in kv_namespaces.
- Local environment template available in .env.example.

## Required Secrets

Runtime secrets for Worker auth:

- ADMIN_PASSWORD
- ADMIN_TOKEN

CI deployment secrets in GitHub repository settings:

- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

Security handling requirements are documented in docs/SECURITY.md.

## Local Development Workflow

1. Install dependencies:

```bash
npm install
```

2. Run frontend-only preview:

```bash
npm run start
```

3. Run Worker locally (API + static assets):

```bash
npx wrangler dev
```

4. Configure local runtime secrets when needed:

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_TOKEN
```

5. Execute tests before deployment:

```bash
npm test
npm run test:sanitize
```

## Wrangler Command Reference

## Authentication

```bash
npx wrangler login
```

## Local Development

```bash
npx wrangler dev
```

## Validate Deployment Package

```bash
npx wrangler deploy --dry-run
```

## Production Deploy

```bash
npm run deploy
```

Equivalent direct command:

```bash
npx wrangler deploy
```

## Cloudflare Workers Deployment Process

1. Confirm branch state and release readiness.
2. Confirm CHANGELOG.md and release notes are up to date.
3. Run local tests and wrangler dry-run validation.
4. Deploy through CI (preferred) or controlled manual Wrangler release.
5. Verify post-deploy health and critical routes.

Post-deploy checks:

- GET /health returns HTTP 200 and healthy status.
- Contact submission endpoint responds as expected.
- Admin login and contact retrieval flow remain operational.

## GitHub Actions Deployment Flow

The repository workflow in .github/workflows/ci.yml runs three gated stages:

1. Test
- Installs dependencies.
- Runs npm test and npm run test:sanitize.

2. Validate
- Runs npx wrangler deploy --dry-run.

3. Deploy
- Executes only on push to main or master.
- Uses CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
- Runs npm run deploy.

Operational result:

- Production deployment is blocked if tests or validation fail.

## Development -> Staging -> Production Overview

Current state:

- Deployment is production-targeted through protected branch CI gates.

Recommended enterprise flow:

1. Development
- Build and test locally.

2. Staging
- Deploy a candidate to a staging Worker environment.
- Perform smoke checks on health and key API routes.

3. Production
- Promote validated candidate through main/master deployment path.

Release promotion governance is documented in docs/RELEASES.md.

## DNS and Domain Configuration Overview

Cloudflare Workers can be exposed through:

- workers.dev subdomain,
- custom domain route under a managed zone.

For custom domains:

1. Ensure domain is active in Cloudflare DNS.
2. Attach Worker route or custom domain to the service.
3. Validate DNS propagation and HTTPS certificate status.
4. Confirm routing for public site and API paths.

Recommended validation after domain changes:

- Check GET /health over the target domain.
- Confirm static assets load correctly.
- Confirm API paths resolve over HTTPS.

## Rollback Procedure

Use this process for failed or degraded releases:

1. Identify last known stable release tag.
2. Redeploy stable version using CI or Wrangler.
3. Re-validate health endpoint and critical business routes.
4. Announce rollback completion and current impact status.
5. Open follow-up hotfix and incident review actions.

Rollback details and release governance are defined in docs/RELEASES.md.

## Deployment Checklist

- [ ] Required secrets exist in Cloudflare and GitHub.
- [ ] Local tests pass.
- [ ] Dry-run deployment succeeds.
- [ ] CHANGELOG.md release notes are complete.
- [ ] Rollback target is known.
- [ ] Post-deploy health verification plan is ready.
