# Release Management

## Purpose

This document defines the release management process for the Slimes.Hustlers AI Solutions website and API platform.

The goals are:

- predictable versioning,
- repeatable deployments,
- auditable change history,
- safe rollback when incidents occur.

This process is aligned with:

- GitHub Actions CI/CD in .github/workflows/ci.yml
- Cloudflare Workers deployment via Wrangler
- CHANGELOG.md release tracking

## Semantic Versioning Strategy

This repository follows Semantic Versioning (SemVer): MAJOR.MINOR.PATCH.

Version meanings:

- MAJOR: incompatible or breaking behavior changes.
- MINOR: backward-compatible feature additions.
- PATCH: backward-compatible bug fixes and hardening updates.

Examples:

- 1.0.0 -> 1.0.1 for production bug fix.
- 1.0.1 -> 1.1.0 for new endpoint that does not break existing clients.
- 1.1.0 -> 2.0.0 for route contract changes that break compatibility.

Release tags should use a v-prefix:

- v1.0.0
- v1.0.1
- v1.1.0

## Git Branching Strategy

Primary branches:

- main: production-ready branch and deploy source.
- master: supported as equivalent protected branch where applicable.

Working branches:

- feature/<short-description>
- fix/<short-description>
- hotfix/<short-description>
- docs/<short-description>

Branching rules:

1. Branch from main for all changes.
2. Keep pull requests focused and small enough for safe review.
3. Require CI success before merge.
4. Use hotfix branches for urgent production issues.

## Release Workflow

### Standard Release Lifecycle

1. Plan
- Define release scope and version bump type.
- Confirm testing and documentation updates are included.

2. Implement
- Merge approved changes via pull requests.
- Keep CHANGELOG.md updated under Unreleased during development.

3. Validate in CI
- GitHub Actions runs test and validate jobs.
- Required gates:
  - npm test
  - npm run test:sanitize
  - npx wrangler deploy --dry-run

4. Prepare release metadata
- Move Unreleased entries in CHANGELOG.md into a new version section.
- Add release date and concise impact summary.
- Create and push annotated git tag (vX.Y.Z).

5. Deploy
- Merge to main/master triggers deploy job in GitHub Actions.
- Deployment publishes to Cloudflare Workers using configured secrets.

6. Verify
- Confirm /health returns healthy status and expected version metadata.
- Validate critical API routes and basic admin workflow behavior.

### Hotfix Workflow

1. Create hotfix/<name> from main.
2. Implement minimal fix and associated tests.
3. Open expedited review pull request.
4. Merge after CI passes.
5. Bump PATCH version and update CHANGELOG.md.
6. Tag release and monitor post-deploy health closely.

## Development -> Staging -> Production Flow

Current repository deployment is production-first through protected branch CI.

Recommended enterprise promotion model:

1. Development
- Local iteration with wrangler dev and local test commands.

2. Staging
- Deploy candidate build to a staging Worker environment.
- Run smoke checks on /health and key API paths.
- Validate release notes and rollback readiness.

3. Production
- Promote validated build to production via main/master deploy path.
- Monitor health, error rate, and latency after release.

Implementation note:

- The current workflow already includes test and dry-run validation gates.
- A dedicated staging environment should be added as a subsequent infrastructure enhancement.

## Changelog Update Policy

CHANGELOG.md is the authoritative release history.

Rules:

1. Add all user-facing, operational, and security-relevant changes under Unreleased during development.
2. Use clear categories such as Added, Changed, Fixed, and Security.
3. At release time, move Unreleased items into a new version section with date.
4. Keep entries concise, factual, and auditable.

Minimum release entry content:

- version number,
- release date,
- key changes,
- any migration or compatibility notes.

## GitHub Actions and Cloudflare Workers Alignment

The CI/CD workflow enforces release safety before deployment:

1. Test stage
- Installs dependencies and runs automated tests.

2. Validate stage
- Runs wrangler dry-run to verify deployability.

3. Deploy stage
- Runs only on push events to main/master.
- Uses CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID secrets.

Operational implication:

- No production deployment occurs unless test and validation gates pass.

## Rollback Procedure

### Rollback Triggers

Initiate rollback when any of the following occur post-release:

- /health failures or sustained degraded availability,
- elevated 5xx error rates,
- severe API regression or authentication failure,
- security issue requiring immediate mitigation.

### Rollback Steps

1. Identify last known stable release tag.
2. Re-deploy stable version to Cloudflare Workers:
- use tagged commit checkout and deploy via CI or Wrangler.
3. Validate recovery:
- check /health,
- test critical endpoints,
- verify admin login and contact retrieval paths.
4. Communicate status and impact to stakeholders.
5. Open incident follow-up issue with root-cause and prevention actions.

### Post-Rollback Actions

- Create hotfix branch for permanent correction.
- Add incident and rollback summary to CHANGELOG.md if user-impacting.
- Review release checklist and CI gates for future prevention.

## Release Checklist

Use this checklist before each production release:

- [ ] Version bump type (major/minor/patch) confirmed.
- [ ] CHANGELOG.md updated and reviewed.
- [ ] Automated tests pass locally and in CI.
- [ ] Wrangler deploy dry-run succeeds.
- [ ] Required deployment secrets are available.
- [ ] Rollback target version identified.
- [ ] Post-deploy health verification plan prepared.
