# Changelog

All notable changes to this repository are documented in this file.

The format is based on Keep a Changelog principles and follows Semantic Versioning for tagged releases.

## [Unreleased]

### Added

- Repository governance and compliance documentation:
  - SECURITY.md
  - CONTRIBUTING.md
  - CHANGELOG.md

## [1.0.0] - 2026-07-15

### Added

- Initial production release of the Slimes.Hustlers AI Solutions website.
- Cloudflare Workers deployment with static asset serving and API routing.
- Contact intake endpoint with validation and sanitization.
- Admin login/logout endpoints and authenticated contact retrieval.
- Cloudflare KV integration for contact persistence with fallback handling.
- Public site pages, admin dashboard pages, and frontend JavaScript assets.
- Automated browser tests (Playwright) and sanitize/fallback test coverage.
