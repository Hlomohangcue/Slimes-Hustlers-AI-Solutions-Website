# Testing Guide

## Purpose

This document defines the testing strategy for the Slimes.Hustlers AI Solutions website repository and provides contributor standards for adding and maintaining test coverage.

## Current Testing Strategy

The project uses a layered strategy to validate both core logic and end-user behavior:

- Unit-style Node tests for isolated logic and endpoint behavior.
- Browser integration tests with Playwright for real user flows.
- CI execution that gates deployment on successful test completion.

This balance provides fast feedback on business logic while still validating production-like interactions.

## Test Types

### Unit-Style Tests

These tests run directly in Node and focus on specific modules or endpoint handlers.

Included files:

- tests/sanitize.test.js
- tests/contacts-fallback.test.js
- tests/health.test.js

Coverage focus:

- Input sanitization and validation behavior.
- Contact retrieval fallback behavior.
- Health endpoint contract and response metadata.

### Integration Tests (Browser)

These tests run with Playwright and validate user workflows through a browser session.

Included file:

- tests/contact.spec.js

Coverage focus:

- Contact form rendering and accessibility expectations.
- Input interaction and validation feedback.
- Form submission flow and success state behavior.

## Test File Inventory

- tests/sanitize.test.js: Verifies sanitize utility behavior and expected transformed output.
- tests/contact.spec.js: Validates UI-level contact form behavior using Playwright.
- tests/contacts-fallback.test.js: Verifies fallback contact retrieval path when KV data source is unavailable.
- tests/health.test.js: Validates GET /health response structure and required fields.

## Available NPM Test Commands

The following commands are currently available:

- npm test
- npm run test:playwright
- npm run test:sanitize
- npm run test:headed

Command details:

| Command | Purpose |
| --- | --- |
| npm test | Starts a local server and runs Playwright tests through the default config. |
| npm run test:playwright | Runs Playwright tests directly with tests/playwright.config.js. |
| npm run test:sanitize | Runs Node unit-style checks for sanitize and health tests. |
| npm run test:headed | Runs Playwright tests in headed mode for local debugging. |

## CI/CD Test Execution

CI is defined in .github/workflows/ci.yml and uses Node.js 22.

Execution sequence:

1. Install Node dependencies with npm ci.
2. Install Playwright browsers and system dependencies.
3. Execute automated tests:
   - npm test
   - npm run test:sanitize
4. Run deployment validation (wrangler dry-run).
5. Deploy only after test and validation jobs pass on main/master push events.

This means test failures block the validation and deployment stages.

## How Contributors Should Add New Tests

### General Rules

1. Add tests for all behavior changes and bug fixes.
2. Keep tests deterministic and independent.
3. Avoid relying on external network services unless explicitly mocked.
4. Keep test scope narrow: one behavior area per test case.

### Where To Add Tests

- Add Node unit-style tests in the tests directory using *.test.js naming.
- Add browser integration tests in the tests directory using *.spec.js naming.

### Suggested Workflow

1. Implement code changes.
2. Add or update the relevant test file.
3. Run targeted tests locally.
4. Run full command set before opening a pull request.

Recommended local verification:

- npm run test:sanitize
- npm test

### Test Design Standards

- Assert response contracts, not incidental internal implementation details.
- Validate both success and failure paths when practical.
- Include clear test descriptions that explain expected behavior.
- Reuse existing test style and conventions in this repository.

## Playwright Notes

Playwright is configured in tests/playwright.config.js with:

- Headless mode enabled by default.
- Desktop viewport defaults.
- Action timeout constraints for reliability.

Use headed mode for debugging interaction issues:

- npm run test:headed

## Release Quality Expectations

For production-facing changes, contributors are expected to:

- Add tests for new endpoints and public behaviors.
- Maintain or improve existing coverage for modified areas.
- Ensure CI passes before requesting merge.
