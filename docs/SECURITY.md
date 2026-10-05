# Security Practices

## Scope

This document describes implementation-level security practices for the Slimes.Hustlers AI Solutions production website and lead intake platform.

For vulnerability disclosure policy and reporting process, see root `SECURITY.md`.

## Security Design Principles

- Protect administrative access paths and credentials.
- Validate and sanitize all untrusted input.
- Isolate secrets from source control.
- Apply least privilege for deployment automation.
- Maintain auditable CI/CD and release procedures.

## Environment and Secret Management

Use `.env.example` as a non-secret configuration template only.

Do not commit:

- `.env` or `.env.*` files containing real secrets
- `.dev.vars` files
- Private keys, certificates, or secret JSON bundles

### Runtime Secrets (Cloudflare Workers)

Store runtime auth secrets with Wrangler:

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_TOKEN
```

### CI/CD Secrets (GitHub Actions)

Configure these repository secrets for deployment workflows:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Recommended controls:

- Use scoped Cloudflare API tokens with minimum required permissions.
- Rotate tokens regularly and after personnel/process changes.
- Restrict repository admin access and enforce branch protections.

## Authentication Practices

- Admin login is handled via `POST /api/login`.
- Session token is transmitted via `HttpOnly` cookie for browser-based flows.
- Protected endpoints require valid admin bearer token or admin cookie.
- Never hardcode production credentials in code or docs.

## Input Validation and Data Handling

- Contact payloads must be validated and sanitized before persistence.
- Reject malformed and unauthorized requests with explicit HTTP status codes.
- Avoid logging sensitive values in plaintext.

## Cloudflare Platform Hardening

- Keep `wrangler.jsonc` bindings explicit and environment-aligned.
- Ensure KV namespace bindings match intended environment.
- Use HTTPS-only production access paths.
- Keep compatibility settings current and reviewed during release cycles.

## HTTP Response Security Headers

The Worker applies security headers globally through the central response flow so they are present on API responses and static asset responses.

Current enforced headers:

- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

Operational intent:

- Reduce browser-side injection and content confusion risks.
- Prevent clickjacking through frame restrictions.
- Limit ambient browser feature exposure.
- Standardize baseline transport and referrer behavior across all routes.

## Future AI Integration Security Placeholders

When enabling AI features, treat these as sensitive configuration surfaces:

- `AI_API_KEY`
- `AI_WEBHOOK_SIGNING_SECRET`
- `AI_AUTOMATION_WEBHOOK_URL`

Minimum requirements for AI rollout:

- Isolate provider keys per environment.
- Validate and sign webhook exchanges.
- Apply request rate controls and abuse monitoring.
- Record auditable decision paths for automation actions.
