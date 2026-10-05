# API Documentation

## Overview

This document defines the HTTP API surface for the Slimes.Hustlers AI Solutions website backend running on Cloudflare Workers.

Base URLs:

- Local Worker development: `http://127.0.0.1:8787`
- Production: deployed Worker domain or configured custom domain

## Authentication Model

Protected endpoints accept either:

- `Authorization: Bearer <ADMIN_TOKEN>` header
- `admin_token` cookie issued after successful login

## Endpoints

### GET /health

Returns production service health metadata.

Success response (`200`):

```json
{
  "service": "Slimes.Hustlers AI Solutions",
  "status": "healthy",
  "environment": "production",
  "timestamp": "2026-07-15T12:00:00.000Z",
  "version": "1.0.0"
}
```

### POST /api/contacts

Creates a contact submission.

Request body:

```json
{
  "fullName": "Jane Doe",
  "email": "jane@company.com",
  "phone": "+1234567890",
  "company": "Company Inc.",
  "message": "I want to discuss AI automation services."
}
```

Success response (`200`):

```json
{
  "success": true,
  "data": {
    "fullName": "Jane Doe",
    "email": "jane@company.com",
    "phone": "+1234567890",
    "company": "Company Inc.",
    "message": "I want to discuss AI automation services.",
    "receivedAt": "2026-07-15T12:00:00.000Z"
  },
  "id": "contact:..."
}
```

Error responses:

- `400` invalid input/body
- `405` method not allowed

### GET /api/contacts

Returns contact submissions for authenticated admin users.

Error responses:

- `401` unauthorized
- `500` storage read failure

### POST /api/login

Authenticates an admin user and sets an `HttpOnly` cookie.

Request body:

```json
{
  "password": "your-admin-password"
}
```

Error responses:

- `400` password missing or invalid request
- `401` invalid credentials
- `500` server not configured

### POST /api/logout

Clears the admin cookie and ends admin session.

## Operational Considerations

- Validate and sanitize all external input before persistence.
- Restrict admin credentials to secure channels and secret stores.
- Use HTTPS in all production environments.
