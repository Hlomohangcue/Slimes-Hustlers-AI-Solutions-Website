# Dependency and Software Supply Chain Security

## Purpose

This document defines dependency governance and software supply chain security controls for the Slimes.Hustlers AI Solutions repository.

Reference documents:

- docs/SECURITY.md
- docs/THREAT_MODEL.md
- docs/DEVELOPMENT.md
- docs/RELEASES.md

## Dependency Management Strategy

The repository uses npm as the package manager with lockfile-based resolution.

Core strategy:

- Keep runtime and development dependencies minimal.
- Pin resolved dependency graph through package-lock.json.
- Prefer mature, actively maintained packages.
- Require review for new dependencies and major upgrades.

Current dependency footprint is intentionally small to reduce attack surface.

## npm Package Governance

Dependency governance rules:

1. Justification required
- Every new package must have a clear functional need.

2. Source trust required
- Prefer packages with active maintenance, transparent release history, and broad ecosystem trust.

3. Scope control required
- Avoid overlapping packages that duplicate functionality.

4. License review required
- Ensure license compatibility with repository policy before adoption.

5. Security review required
- Evaluate package risk before merge, especially for packages that process input, authentication, or deployment workflows.

## Version Pinning Policy

Version control policy:

- package.json may use constrained ranges for maintainability.
- package-lock.json is the source of truth for exact install resolution.
- CI and production deployments must use lockfile-consistent installs.

Operational rule:

- Do not manually edit package-lock.json unless part of an intentional dependency update.

Upgrade discipline:

- Patch and minor updates are preferred first.
- Major version changes require explicit compatibility review and risk assessment.

## Security Vulnerability Scanning

Vulnerability scanning model:

- Run npm audit during dependency review cycles.
- Use GitHub dependency alerts and advisory feeds where enabled.
- Track high and critical findings as release-blocking until mitigated or formally risk-accepted.

Risk handling guidance:

- Critical vulnerabilities: immediate triage and remediation path.
- High vulnerabilities: planned remediation in next safe release window.
- Moderate/low vulnerabilities: prioritize by exploitability and package exposure.

## Update Process

Dependency update workflow:

1. Identify
- Detect available updates through npm tooling and automation alerts.

2. Classify
- Label update as patch, minor, or major.

3. Assess
- Evaluate security impact, runtime impact, and operational risk.

4. Implement
- Update dependency in a focused branch.

5. Validate
- Run local and CI test suite.
- Confirm no regression in API, auth, or deployment behavior.

6. Release
- Document significant dependency changes in CHANGELOG.md.
- Merge through normal release governance.

## Breaking Change Evaluation

Major dependency upgrades must include:

- Compatibility assessment against current API and runtime behavior.
- Test expansion for sensitive paths (auth, contacts, security headers, health endpoint).
- Deployment dry-run verification.
- Rollback plan if production regressions occur.

Release gating:

- No major dependency update should be released without passing CI and maintainer approval.

## Dependabot and Renovate Strategy

Automation strategy:

- Use either Dependabot or Renovate for routine dependency update pull requests.
- Group low-risk patch updates where practical.
- Keep major updates separated for focused review.

Recommended automation policy:

- Weekly scan cadence for npm dependencies.
- Auto-create PRs for patch/minor updates.
- Require manual approval for major updates.
- Label update PRs by risk level and dependency type.

If both tools are enabled, use one as authoritative to avoid duplicate update noise.

## Software Supply Chain Risks

Primary supply chain risks for this repository:

- Compromised upstream package releases.
- Dependency confusion or typosquatting.
- Transitive dependency vulnerabilities.
- Malicious post-install behavior.
- Build pipeline compromise through untrusted action/tool updates.

Mitigations:

- Keep dependency graph small and well understood.
- Use lockfile-based deterministic installs.
- Review update diffs and changelogs before merge.
- Enforce branch protection and CI gates.
- Restrict deployment secret scope and rotate credentials regularly.

## CI Dependency Checks

CI dependency controls should include:

- Deterministic install using lockfile-compatible commands.
- Full test execution after dependency changes.
- Deployment validation stage before production release.

Current CI alignment:

- Test and validation stages already gate deployment.
- Dependency changes are implicitly validated by existing tests and dry-run deployment checks.

Recommended enhancement:

- Add explicit dependency audit step in CI for continuous vulnerability visibility.

## Security Review Checklist for Dependency Changes

Use this checklist for dependency-related pull requests:

- [ ] New dependencies are justified and documented.
- [ ] Package source, maintenance state, and license are reviewed.
- [ ] Vulnerability scan findings are reviewed and addressed.
- [ ] Breaking change risk is assessed for major updates.
- [ ] Local and CI tests pass after update.
- [ ] Deployment dry-run verification succeeds for high-risk updates.
- [ ] CHANGELOG.md updated when impact is user-facing or operationally significant.
- [ ] Rollback path is identified for high-impact changes.

## Governance and Ownership

Dependency governance is a shared responsibility across maintainers and contributors.

Ownership expectations:

- Contributors propose and validate dependency changes.
- Maintainers enforce risk-based review standards.
- Security and release governance documents remain synchronized with supply chain policy updates.
