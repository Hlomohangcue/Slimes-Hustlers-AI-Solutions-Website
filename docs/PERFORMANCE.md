# Performance Guide

## Purpose

This document defines production performance practices for the Slimes.Hustlers AI Solutions website and API on Cloudflare Workers.

Related documentation:

- docs/ARCHITECTURE.md
- docs/DEPLOYMENT.md
- docs/MONITORING.md

## Cloudflare Workers Edge Performance Model

Cloudflare Workers runs compute at edge locations close to users, which reduces origin round-trip latency and improves response time consistency.

Performance characteristics for this repository:

- Static assets are served through the Cloudflare edge asset pipeline.
- API handlers execute in Worker runtime without traditional server provisioning.
- KV-backed contact retrieval favors low-ops persistence with globally distributed access patterns.
- Global response handling applies consistent headers without per-route duplication.

Design implications:

- Keep request handlers fast and non-blocking.
- Minimize expensive synchronous operations in request path.
- Treat edge latency variance as a measurable metric, not a constant.

## Frontend Optimization Practices

Current and recommended practices for frontend performance:

- Keep critical page structure lightweight for fast first render.
- Reduce JavaScript execution cost on initial load.
- Defer non-critical behavior until after primary content is interactive.
- Minimize render-blocking CSS and avoid oversized style payloads.
- Optimize image dimensions and formats before publishing to public/images.
- Ensure forms and primary conversion actions remain responsive under slow networks.

Operational guardrails:

- Validate mobile performance, not desktop only.
- Re-test key user paths after each release candidate.

## Asset Optimization Strategy

Static assets in public/ should follow these controls:

- Compress images using modern formats where possible.
- Use size-appropriate assets for viewport and component context.
- Remove unused CSS and dead JavaScript paths during maintenance cycles.
- Avoid shipping large third-party dependencies for simple interactions.
- Keep favicon and decorative assets optimized for cache reuse.

Release readiness checks:

- No oversized images committed without justification.
- No accidental debug bundles or temporary files in public assets.
- Lighthouse diagnostics reviewed for transfer size regressions.

## Caching Strategy

### Edge Caching Objectives

- Serve static assets from edge cache whenever possible.
- Reduce repeated payload transfer for frequently requested resources.
- Keep dynamic API paths uncached unless explicitly designed for caching.

### Cache Segmentation

- Static site assets: cache-friendly and immutable where feasible.
- API endpoints with user-specific or sensitive data: no shared cache assumptions.
- Health endpoint: lightweight endpoint for monitoring, not a business-content cache target.

### Invalidation Approach

- Versioned asset naming is preferred for long-lived cache safety.
- Use deployment-based cache refresh cycles for updated bundles.
- Validate key pages after release to detect stale asset mismatches.

## Performance Monitoring Approach

Performance monitoring should combine synthetic and operational signals.

Core signals:

- Endpoint latency for /health and core API paths.
- Error rate spikes correlated with deployment windows.
- Availability and responsiveness trends by region.
- Frontend web-vitals trends from periodic audits.

Execution model:

- Use /health checks for liveness and baseline latency.
- Track deployment timestamps to identify performance regressions introduced by releases.
- Use docs/MONITORING.md as the incident and metric governance baseline.

## Lighthouse and Core Web Vitals Guidance

### Core Web Vitals Priorities

Track and improve the following metrics:

- LCP (Largest Contentful Paint): loading performance.
- INP (Interaction to Next Paint): interaction responsiveness.
- CLS (Cumulative Layout Shift): visual stability.

Recommended targets:

- LCP: <= 2.5s (good)
- INP: <= 200ms (good)
- CLS: <= 0.1 (good)

### Lighthouse Operating Guidance

- Run Lighthouse on key pages before major releases.
- Use mobile profile as primary quality gate.
- Investigate regressions in performance, accessibility, and best practices categories.
- Record baseline and release-candidate scores to support trend tracking.

Review cadence:

- Minimum: before each production release.
- Preferred: after significant frontend or routing changes.

## Future Optimization Roadmap

Planned performance maturity work:

1. Request Metrics Expansion
- Endpoint-level request volume, route distribution, and traffic shape profiling.

2. Latency Tracking Expansion
- p50, p95, and p99 latency tracking for /health and API endpoints.
- Region-by-region latency comparisons for edge effectiveness.

3. Error Rate Optimization
- Route-specific error budgets and automated regression alerts.
- Post-deploy error-delta checks during release verification.

4. Availability and Performance Correlation
- Combine uptime and latency trends for early degradation detection.
- Introduce burn-rate alerting tied to reliability goals.

5. Frontend Delivery Improvements
- Asset-budget thresholds in CI quality checks.
- Ongoing bundle-size and image-optimization enforcement.

## Contributor Performance Checklist

Before merging performance-impacting changes:

- [ ] Validate no major Lighthouse regressions on key pages.
- [ ] Confirm Web Vitals-sensitive areas (LCP, INP, CLS) were considered.
- [ ] Verify static asset size and format choices are optimized.
- [ ] Ensure caching assumptions are explicit and safe.
- [ ] Update docs/MONITORING.md or this document when monitoring scope changes.
