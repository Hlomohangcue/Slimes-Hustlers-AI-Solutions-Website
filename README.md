# Slimes.Hustlers AI Solutions Website

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Playwright](https://img.shields.io/badge/Tested%20With-Playwright-45ba63?logo=playwright&logoColor=white)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Production-ready marketing website and contact intake platform for Slimes.Hustlers AI Solutions, built for Cloudflare Workers with serverless API routes and persistent contact storage.

## Project Overview

This repository contains a complete business website and lightweight lead-management backend.

It provides:
- A modern, responsive public website.
- A validated contact form pipeline.
- Admin authentication and secure contact retrieval.
- Cloudflare-native deployment with static asset hosting and Worker API routes.

## Business Problem Solved

Service businesses often struggle with fragmented lead capture and manual follow-up workflows. This project solves that by combining marketing presence and lead intake in one deployable unit:

- Captures qualified client inquiries directly from the website.
- Sanitizes and validates inbound data before storage.
- Stores submissions in Cloudflare KV for low-ops persistence.
- Exposes an admin-only dashboard for reviewing contact submissions.
- Reduces operational overhead with serverless hosting and deployment.

## Features

- Responsive multi-section business landing page.
- Service highlights and portfolio showcase.
- Contact form with client-side and server-side validation.
- Input sanitization against malformed or unsafe data.
- Admin login flow using secure cookie authentication.
- Admin dashboard to review contact submissions.
- Cloudflare KV integration with a fallback contacts store.
- Playwright end-to-end tests and unit-like fallback tests.

## Documentation

Detailed technical documentation is maintained under the `docs/` directory:

- Architecture: `docs/ARCHITECTURE.md`
- API Reference: `docs/API.md`
- Security Practices: `docs/SECURITY.md`

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Runtime | Cloudflare Workers (JavaScript, `nodejs_compat`) |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend/API | JavaScript module handlers (`src/`) |
| Storage | Cloudflare KV (`CONTACTS_KV`) |
| Testing | Playwright, Node-based test scripts |
| Deployment | Wrangler |

## Installation and Local Development

### Prerequisites

- Node.js 18+
- npm
- Cloudflare account
- Wrangler CLI

### 1. Install dependencies

```bash
npm install
```

### 2. Local static preview (frontend only)

```bash
npm run start
```

This serves files from `public/` but does not run Worker API handlers.

### 3. Local full-stack Worker development

```bash
npx wrangler dev
```

This runs static assets and API endpoints through the Worker runtime.

### 4. Configure secrets for auth endpoints

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_TOKEN
```

## Security and Environment Configuration

- Vulnerability disclosure policy: `SECURITY.md`
- Implementation security practices: `docs/SECURITY.md`
- Environment template: `.env.example`

## Deployment

### Cloudflare Workers Deployment

1. Authenticate Wrangler:

```bash
npx wrangler login
```

2. Confirm `wrangler.jsonc` includes:
- `assets.directory = "./public"`
- `kv_namespaces` binding for `CONTACTS_KV`

3. Deploy:

```bash
npm run deploy
```

4. Verify API routes:
- `GET /health`
- `POST /api/contacts`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/contacts` (authenticated)

## Screenshots (Placeholders)

Add project screenshots under `docs/screenshots/` and update the placeholders below.

![Homepage](docs/screenshots/homepage.png)
![Services Section](docs/screenshots/services.png)
![Contact Form](docs/screenshots/contact-form.png)
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

## Folder Structure

```text
.
|-- public/
|   |-- index.html
|   |-- login.html
|   |-- admin.html
|   |-- css/
|   |-- js/
|   |-- data/
|   `-- images/
|-- src/
|   |-- index.js
|   |-- contacts.js
|   |-- login.js
|   |-- logout.js
|   `-- sanitize.js
|-- tests/
|   |-- contact.spec.js
|   |-- contacts-fallback.test.js
|   |-- sanitize.test.js
|   `-- playwright.config.js
|-- wrangler.jsonc
|-- package.json
`-- README.md
```

## Testing

Run all browser-based tests:

```bash
npm test
```

Run Playwright directly:

```bash
npm run test:playwright
```

Run sanitize tests:

```bash
npm run test:sanitize
```

## Future Improvements

- Replace static admin token with short-lived signed session tokens.
- Add rate limiting and bot protection for contact submissions.
- Add CI pipeline for linting, tests, and deployment previews.
- Add observability dashboards for API latency and errors.
- Add structured audit logging for admin access events.
- Add pagination/filtering/export in admin dashboard.

## Contribution Guidelines

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch from `main`.
3. Keep changes focused and include tests where applicable.
4. Ensure existing functionality is preserved.
5. Open a pull request with a clear description of intent and impact.

Recommended pull request checklist:
- [ ] No breaking changes to existing routes or page behavior.
- [ ] Tests pass locally.
- [ ] Documentation updated.
- [ ] Security-sensitive changes explained.

## Recommended GitHub Metadata

Repository description suggestion:

`Cloudflare Workers-powered business website and lead capture platform with admin dashboard, contact API, and KV-backed storage.`

Recommended topics:

`cloudflare-workers`, `wrangler`, `javascript`, `serverless`, `website`, `contact-form`, `admin-dashboard`, `kv-storage`, `playwright`, `business-automation`

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
