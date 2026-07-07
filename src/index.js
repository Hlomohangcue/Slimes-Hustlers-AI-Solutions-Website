import { handleContactsRequest } from './contacts.js';
import { handleLoginRequest } from './login.js';
import { handleLogoutRequest } from './logout.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/api/contacts') {
      return handleContactsRequest(request, env);
    }

    if (pathname === '/api/login') {
      return handleLoginRequest(request, env);
    }

    if (pathname === '/api/logout') {
      return handleLogoutRequest(request);
    }

    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ success: false, error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
