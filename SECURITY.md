# Security Policy

## Security Commitment

Slimes.Hustlers AI Solutions treats security as a core requirement for all production systems, including this website and lead intake platform.

We appreciate responsible disclosure of vulnerabilities and work to triage, validate, and remediate legitimate reports quickly and professionally.

## Supported Versions

Security updates are provided for actively maintained code in the default branch.

| Version | Supported |
| --- | --- |
| 1.x (current) | Yes |
| < 1.0 | No |

## Reporting a Vulnerability

Please do not open public GitHub issues for security vulnerabilities.

Report vulnerabilities through one of the private channels below:

- Email: security@slimeshustlers.ai
- Security advisories: use GitHub private vulnerability reporting for this repository

Include the following details in your report:

- A clear description of the issue and impact
- Affected endpoints, files, or components
- Reproduction steps or proof of concept
- Any logs, screenshots, or request/response samples
- Your suggested remediation (if available)

## Response Targets

Slimes.Hustlers AI Solutions aims to meet the following response targets:

- Initial acknowledgement: within 2 business days
- Triage decision and severity classification: within 5 business days
- Remediation timeline communication: after validation and impact analysis

Complex vulnerabilities may require longer timelines depending on risk, dependency, and release constraints.

## Scope

In-scope repository components include:

- Cloudflare Workers API routes under src/
- Authentication handling for admin access
- Contact ingestion and storage flows
- Public-facing static assets under public/

Out-of-scope findings typically include:

- Social engineering or phishing attempts
- Denial-of-service testing without prior written approval
- Automated scanner noise without a demonstrable security impact

## Safe Harbor

If you act in good faith, avoid privacy violations and service disruption, and provide us a reasonable opportunity to remediate before disclosure, Slimes.Hustlers AI Solutions will treat your research as authorized.

## Disclosure Expectations

Please keep vulnerability details confidential until a fix is available and deployed. Coordinated disclosure protects clients, users, and platform integrity.
