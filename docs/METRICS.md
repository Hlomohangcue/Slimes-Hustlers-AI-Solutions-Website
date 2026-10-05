# Engineering Metrics and Project Health

## Purpose

This document defines engineering metrics, KPI governance, and project health review practices for the Slimes.Hustlers AI Solutions platform.

Reference documents:

- docs/MONITORING.md
- docs/PERFORMANCE.md
- docs/RELEASES.md
- docs/TESTING.md
- docs/COMPLIANCE.md

## Metrics Operating Principles

Principles for metric use:

- Use metrics to improve system reliability and delivery quality, not to optimize for vanity numbers.
- Track trends over time instead of isolated snapshots.
- Tie every metric to an owner, target, and review cadence.
- Combine leading indicators (pre-release) with lagging indicators (post-release outcomes).
- Investigate context before acting on threshold breaches.

## Engineering KPIs

Primary engineering KPI domains:

- Delivery efficiency
- Reliability and incident response
- Product quality
- Security posture
- Performance and user experience
- CI/CD pipeline health

Recommended KPI ownership:

- Engineering lead: delivery and quality KPIs
- Platform/reliability owner: SLO and incident KPIs
- Security owner: security and supply chain KPIs

## Delivery Metrics

Core delivery metrics:

1. Deployment Frequency
- Definition: number of production deployments per time period.
- Example: 6 production deployments in 30 days.

2. Lead Time for Changes
- Definition: elapsed time from commit merge to successful production deployment.
- Example: median lead time of 18 hours.

3. Change Throughput
- Definition: merged pull requests or shipped changes per iteration window.
- Example: 24 merged PRs in a two-week cycle.

4. Escaped Defect Rate
- Definition: defects discovered post-release divided by total released changes.
- Example: 2 escaped defects across 20 release items.

## Reliability Metrics

Core reliability metrics:

1. Change Failure Rate
- Definition: percentage of deployments causing incident, rollback, or hotfix.
- Example: 1 failed change in 12 deployments = 8.3 percent.

2. Mean Time to Recovery (MTTR)
- Definition: average time from incident detection to service restoration.
- Example: average MTTR of 42 minutes over last quarter.

3. API Availability
- Definition: successful health checks or endpoint probes over total checks.
- Example: 99.94 percent monthly availability.

4. Error Rate
- Definition: percentage of 5xx responses over total API responses.
- Example: 0.35 percent rolling 30-day API error rate.

## Quality Metrics

Core quality metrics:

1. Test Coverage Signal
- Definition: proportion of critical flows covered by automated tests.
- Example: all critical routes covered by unit-style and integration tests.

2. Test Pass Rate
- Definition: successful test runs divided by total runs in CI.
- Example: 97 percent pass rate across last 100 pipeline runs.

3. Regression Rate
- Definition: incidents caused by previously fixed or expected behavior regressions.
- Example: 1 regression incident in a monthly release cycle.

4. Defect Density (Optional)
- Definition: validated defects per delivered change unit.
- Example: 0.12 defects per merged PR over release cycle.

## Security Metrics

Core security metrics:

1. Time to Remediate Vulnerabilities
- Definition: time from vulnerability discovery to merged mitigation.
- Example: high-severity vulnerability remediated in 3 days.

2. Open High/Critical Vulnerability Count
- Definition: unresolved high/critical dependency or platform findings.
- Example: 0 open critical, 1 open high (accepted with mitigation plan).

3. Security Review Completion Rate
- Definition: percentage of high-risk changes with completed security checklist.
- Example: 100 percent completion for auth and deployment-impacting changes.

4. Secret Exposure Incidents
- Definition: count of confirmed secret leakage events.
- Example target: zero incidents.

## Performance Metrics

Core performance metrics:

1. p95 API Latency
- Definition: 95th percentile response time for health and core API endpoints.
- Example target: p95 under 500 ms for health endpoint.

2. Core Web Vitals
- LCP target: less than or equal to 2.5 seconds.
- INP target: less than or equal to 200 milliseconds.
- CLS target: less than or equal to 0.1.

3. Lighthouse Score Trend
- Definition: trendline of mobile-first performance audits on key pages.
- Example: no more than 5-point regression without mitigation plan.

4. Static Asset Budget Adherence
- Definition: percentage of releases meeting defined asset-size limits.
- Example target: 100 percent adherence.

## CI/CD Metrics

Core CI/CD metrics:

1. Pipeline Success Rate
- Definition: successful workflow runs divided by total runs.
- Example: 95 percent success rate over 30 days.

2. Average Pipeline Duration
- Definition: mean end-to-end CI workflow runtime.
- Example: 11-minute median pipeline completion.

3. Build Breakage Recovery Time
- Definition: time from first failing build to restored green state.
- Example: average 2.1 hours.

4. Deployment Stage Success Rate
- Definition: successful deploy jobs over attempted deploy jobs.
- Example: 98 percent successful production deploy stage execution.

## SLO Tracking

SLO tracking aligns with observability guidance.

Recommended SLO set:

- Availability SLO: 99.9 percent monthly for public service endpoints.
- Latency SLO: p95 under 500 ms for health endpoint under normal load.
- Error SLO: under 1 percent API 5xx rate in rolling 30-day window.

SLO tracking process:

1. Define SLI source and query method.
2. Set target and error budget.
3. Monitor burn-rate and alert on threshold breaches.
4. Trigger reliability review when error budget burn accelerates.
5. Record remediation actions and follow-up improvements.

## Project Health Review Process

### Review Cadence

- Weekly operational metric check
- Monthly engineering health review
- Quarterly strategic KPI and roadmap review

### Monthly Review Agenda

1. Delivery trend analysis
- deployment frequency, lead time, and change throughput

2. Reliability and incident outcomes
- availability, error rates, MTTR, and change failure rate

3. Quality and test posture
- test pass trends, regression patterns, and coverage signals

4. Security and compliance posture
- vulnerability remediation timelines and checklist completion

5. Performance trend assessment
- latency percentiles, Core Web Vitals, and Lighthouse trends

6. Action planning
- owners, deadlines, and measurable targets for next cycle

### Health Status Model

Recommended project health status labels:

- Green: KPI trends within agreed targets
- Yellow: one or more KPI domains drifting without active incident
- Red: sustained target breach, active incident, or repeated delivery instability

## Example Metric Formulas

Example formulas for consistent reporting:

- Deployment Frequency = total production deployments / reporting period
- Lead Time for Changes = production deploy timestamp - merge timestamp
- Change Failure Rate = failed changes / total deployments x 100
- MTTR = total incident recovery duration / incident count
- API Availability = successful checks / total checks x 100
- Error Rate = total 5xx responses / total API responses x 100

## Future Engineering Dashboard Roadmap

Planned dashboard maturity phases:

1. Foundation
- Centralize delivery, reliability, and CI signals in a shared dashboard.

2. Unified SLO View
- Add error-budget visualization and burn-rate alerts.

3. Security and Compliance Overlay
- Integrate vulnerability, review, and governance metrics.

4. Performance Correlation
- Correlate deploys with latency, web-vitals, and error changes.

5. Predictive Insights
- Add trend forecasting and risk scoring for release readiness.

6. Executive Reporting
- Produce monthly KPI summaries for enterprise stakeholders.

## Ownership and Governance

Metric governance expectations:

- Every KPI domain has a documented owner.
- Thresholds are reviewed quarterly or after major architecture changes.
- Definitions remain stable; changes are versioned and documented.
- Metric-driven actions are tracked through release and retrospective workflows.
