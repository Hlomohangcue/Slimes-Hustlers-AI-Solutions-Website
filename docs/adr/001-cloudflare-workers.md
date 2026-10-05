# ADR 001: Adopt Cloudflare Workers as the Primary Runtime

## Title

Adopt Cloudflare Workers as the Primary Runtime

## Status

Accepted

## Date

2026-07-15

## Context

Slimes.Hustlers AI Solutions requires a globally accessible web presence with API endpoints for lead capture and admin workflows. The platform must support low operational overhead, fast deployment cycles, and integrated static asset serving while remaining cost-efficient for variable traffic.

The team needed a runtime that can:

- Serve static assets and API endpoints in one deployment model.
- Scale without manual server provisioning.
- Integrate with edge distribution and managed security controls.
- Fit a small-to-medium engineering team operating production workloads.

## Decision

Use Cloudflare Workers as the production runtime for both static site delivery and API request handling.

This includes:

- Request routing through the Worker entrypoint.
- Static assets served through Cloudflare asset integration.
- Operational deployment through Wrangler and GitHub Actions.

## Alternatives considered

1. Traditional VM-hosted Node.js service
- Rejected due to higher operational burden for patching, scaling, and infrastructure management.

2. Containerized deployment on a managed Kubernetes platform
- Rejected due to complexity overhead relative to project scope and team size.

3. Static site host plus separate API hosting provider
- Rejected due to split operational model, increased integration complexity, and fragmented observability.

## Consequences

Positive:

- Low-ops serverless operations and global edge execution.
- Unified deployment model for frontend assets and API routes.
- Fast rollout and rollback patterns through CI/CD and Wrangler.

Trade-offs:

- Runtime constraints and platform-specific patterns must be respected.
- Some Node.js ecosystem assumptions require adaptation.
- Vendor-specific tooling and deployment model increase platform coupling.
