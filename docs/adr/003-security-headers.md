# ADR 003: Enforce Global Security Headers at the Worker Response Layer

## Title

Enforce Global Security Headers at the Worker Response Layer

## Status

Accepted

## Date

2026-07-15

## Context

The platform serves both static pages and API responses, including admin-related endpoints. Security posture must be consistent across routes to reduce browser-based attack surface and avoid route-by-route policy drift.

Prior behavior risk:

- Headers could be inconsistently applied if each handler set them independently.
- Static and API responses could diverge in baseline browser protections.
- Maintenance overhead increased with repeated header logic.

## Decision

Apply security headers globally in the Worker response flow so all HTTP responses include a consistent baseline.

Enforced headers:

- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

## Alternatives considered

1. Set headers individually in each API handler
- Rejected due to duplication, drift risk, and incomplete coverage for non-API responses.

2. Apply headers only at upstream proxy or CDN configuration level
- Rejected because repository-level intent and testability would be weaker and less explicit.

3. Apply headers only on sensitive routes
- Rejected due to inconsistent browser protection and higher misconfiguration risk.

## Consequences

Positive:

- Consistent baseline browser security controls across responses.
- Easier verification through centralized tests.
- Reduced maintenance cost and lower configuration drift.

Trade-offs:

- CSP tuning requires careful updates when frontend behavior evolves.
- Strict global policies may require exceptions for future integrations.
- Header policy changes must be regression-tested for both API and UI paths.
