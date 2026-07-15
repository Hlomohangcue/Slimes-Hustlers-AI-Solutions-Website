# API Versioning and Contract Governance

## Purpose

This document defines how Slimes.Hustlers AI Solutions versions, governs, and evolves API contracts for the Cloudflare Workers application.

Reference documents:

- docs/API.md
- docs/ARCHITECTURE.md
- docs/RELEASES.md

## API Versioning Strategy

The repository uses semantic release versioning and API contract governance together.

Versioning model:

- Public API contract major version is represented as v1 (current).
- Routes are currently unprefixed (for example, /api/contacts) and governed as v1 contract endpoints.
- Breaking API contract changes require introduction of a new major API version and migration plan.

Recommended version identifier conventions for future major versions:

- Path versioning: /api/v2/... for explicit major version boundaries.
- Health endpoint remains stable and may include version metadata in payload.

## Current API Version

Current contract version:

- API version: v1
- Runtime release baseline: 1.0.0
- Primary endpoint surface documented in docs/API.md

Current v1 endpoints include:

- GET /health
- POST /api/contacts
- GET /api/contacts
- POST /api/login
- POST /api/logout

## Backward Compatibility Rules

Changes are backward compatible when they do not break existing clients.

Allowed without major API version bump:

- Additive response fields that do not change existing field meaning.
- New optional request fields with safe defaults.
- New endpoints that do not alter existing endpoint behavior.
- Performance and internal implementation improvements.

Not allowed without major API version bump:

- Removing existing fields or changing field types.
- Changing required request fields or validation semantics incompatibly.
- Altering auth behavior in a way that breaks existing clients.
- Changing status code semantics for existing outcomes.

## Endpoint Lifecycle Management

Each endpoint follows a controlled lifecycle:

1. Proposed
- Endpoint design reviewed for contract, security, and operational impact.

2. Active
- Endpoint documented in docs/API.md and covered by tests.

3. Deprecated
- Endpoint remains functional but marked for retirement with timeline and migration guidance.

4. Retired
- Endpoint removed only after deprecation window and release communication requirements are satisfied.

Lifecycle requirements:

- Every public endpoint must be documented.
- Every public endpoint must have test coverage appropriate to risk level.
- Deprecation and retirement must be logged in CHANGELOG.md.

## Request and Response Contract Standards

Contract standards for API endpoints:

- Use JSON for request and response payloads unless otherwise documented.
- Include explicit HTTP status codes aligned with endpoint outcomes.
- Keep field names stable and descriptive.
- Use ISO 8601 timestamps for temporal values.
- Avoid nullable ambiguity: document optional vs required fields clearly.

Request contract rules:

- Validate all external input.
- Reject malformed payloads with deterministic error responses.
- Do not silently reinterpret invalid types.

Response contract rules:

- Keep success payload structure stable across patch and minor releases.
- Include identifiers and metadata when useful for traceability.
- Maintain documented auth and error semantics.

## Error Response Format

Standard error format for JSON responses:

```json
{
  "success": false,
  "error": "Human-readable error summary"
}
```

Extended validation error format (when applicable):

```json
{
  "success": false,
  "errors": ["field_name is required", "email must be valid"]
}
```

Error response standards:

- Use a stable top-level failure indicator (success: false).
- Provide clear, non-sensitive error messages.
- Avoid exposing internal implementation details.
- Keep status codes aligned with documented endpoint behavior.

## Deprecation Policy

Deprecation is used to phase out contract elements safely.

Policy requirements:

1. Announce deprecation in docs/API.md and CHANGELOG.md.
2. Provide migration guidance and target removal timeline.
3. Preserve deprecated behavior during the defined deprecation window.
4. Remove only in a major version transition or approved exceptional case.

Recommended deprecation window:

- Minimum one minor release cycle for low-risk changes.
- Longer windows for externally integrated or business-critical endpoints.

## API Change Review Process

All API-affecting changes must complete structured review before merge.

Review checklist:

1. Contract impact classification
- Is the change additive, compatible, or breaking?

2. Documentation update
- Update docs/API.md and this document when governance rules change.

3. Test coverage update
- Add or update endpoint and contract tests.

4. Security and operational review
- Validate auth, input validation, and observability implications.

5. Release readiness
- Record contract-impacting changes in CHANGELOG.md.
- Confirm versioning impact with docs/RELEASES.md policy.

Approval requirements:

- At least one maintainer review for routine changes.
- Elevated review for breaking or security-sensitive changes.

## Governance Alignment with Release Process

API governance is enforced through existing release controls:

- Pull request review and CI validation gates.
- Semantic versioning policy in docs/RELEASES.md.
- Deployment safety checks through GitHub Actions and Wrangler dry-run.

Operational expectation:

- No API contract changes are released without matching documentation, tests, and changelog updates.
