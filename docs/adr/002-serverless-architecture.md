# ADR 002: Use a Serverless Architecture for Web and API Workloads

## Title

Use a Serverless Architecture for Web and API Workloads

## Status

Accepted

## Date

2026-07-15

## Context

The repository supports marketing pages, lead ingestion, admin authentication, and contact retrieval. Traffic patterns can vary significantly based on campaigns and business activity. The team prioritized reliability, cost control, and the ability to ship improvements quickly without infrastructure maintenance overhead.

The target architecture needed to:

- Scale from low to burst traffic automatically.
- Avoid dedicated server lifecycle management.
- Keep deployment and rollback simple.
- Integrate with managed edge delivery for static and API paths.

## Decision

Adopt a serverless architecture using Cloudflare Workers for API compute and edge-served static assets.

Supporting choices:

- Use Worker route orchestration for API paths.
- Use Cloudflare KV binding for contact persistence.
- Use GitHub Actions + Wrangler for automated deployment flow.

## Alternatives considered

1. Monolithic server application with persistent process model
- Rejected due to ongoing server management and reduced elasticity.

2. Microservices with separate deployment units per endpoint domain
- Rejected due to operational complexity and coordination overhead for current scope.

3. Jamstack frontend with separate long-running API backend
- Rejected due to split reliability domains and duplicated deployment concerns.

## Consequences

Positive:

- Automatic scaling with reduced infrastructure operations.
- Consumption-aligned resource model for cost efficiency.
- Faster release cadence and simpler deployment path.

Trade-offs:

- Requires stateless design discipline at request boundaries.
- Debugging may rely more on platform logs and synthetic checks.
- Some cross-request state patterns require managed stores like KV.
