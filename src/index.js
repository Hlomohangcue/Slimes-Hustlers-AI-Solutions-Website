import { handleContactsRequest } from './contacts.js';
import { handleLoginRequest } from './login.js';
import { handleLogoutRequest } from './logout.js';

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=(), usb=()'
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [headerName, headerValue] of Object.entries(SECURITY_HEADERS)) {
    headers.set(headerName, headerValue);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Central router for Worker API endpoints and static asset fallback.
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      let response;

      if (pathname === '/health') {
        response = new Response(JSON.stringify({
          service: 'Slimes.Hustlers AI Solutions',
          status: 'healthy',
          environment: env.ENVIRONMENT || env.NODE_ENV || 'production',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        return withSecurityHeaders(response);
      }

      if (pathname === '/api/contacts') {
        response = await handleContactsRequest(request, env);
        return withSecurityHeaders(response);
      }

      if (pathname === '/api/login') {
        response = await handleLoginRequest(request, env);
        return withSecurityHeaders(response);
      }

      if (pathname === '/api/logout') {
        response = await handleLogoutRequest(request);
        return withSecurityHeaders(response);
      }

      if (pathname.startsWith('/api/')) {
        response = new Response(JSON.stringify({ success: false, error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
        return withSecurityHeaders(response);
      }

      // Serve static files from ./public when route is not an API path.
      response = await env.ASSETS.fetch(request);
      return withSecurityHeaders(response);
    } catch (err) {
      return withSecurityHeaders(new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  }
};
