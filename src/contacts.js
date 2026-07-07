import { sanitizeInput } from './sanitize.js';

function parseCookies(cookieHeader) {
  const obj = {};
  if (!cookieHeader) return obj;
  cookieHeader.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const k = pair.slice(0, idx).trim();
      const v = pair.slice(idx + 1).trim();
      obj[k] = decodeURIComponent(v);
    }
  });
  return obj;
}

function isAdminAuthorized(request, env) {
  try {
    const auth = request.headers.get('Authorization');
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.slice(7).trim();
      if (env && env.ADMIN_TOKEN && token === env.ADMIN_TOKEN) return true;
    }

    const cookieHeader = request.headers.get('Cookie') || request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    if (cookies.admin_token && env && env.ADMIN_TOKEN && cookies.admin_token === env.ADMIN_TOKEN) return true;
  } catch (e) {
    // ignore and return false
  }
  return false;
}

export async function handleContactsRequest(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  if (request.method === 'GET') {
    if (!isAdminAuthorized(request, env)) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
      const kv = env && env.CONTACTS_KV;
      if (!kv || typeof kv.list !== 'function') {
        const fallback = [];
        try {
          if (env && typeof env.ASSETS?.fetch === 'function') {
            const fallbackResponse = await env.ASSETS.fetch(new Request(new URL('/data/contacts.json', request.url)));
            if (fallbackResponse.ok) {
              const fallbackJson = await fallbackResponse.json();
              if (Array.isArray(fallbackJson)) {
                fallbackJson.forEach(item => fallback.push(item));
              }
            }
          }
        } catch (fallbackErr) {
          console.error('Fallback contacts read error:', fallbackErr);
        }

        fallback.sort((a, b) => (a.receivedAt < b.receivedAt) ? 1 : -1);
        return new Response(JSON.stringify(fallback), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      const all = [];
      let cursor;
      do {
        const list = await kv.list({ prefix: 'contact:', cursor, limit: 1000 });
        for (const key of list.keys) {
          const val = await kv.get(key.name);
          try {
            all.push(Object.assign({ id: key.name }, JSON.parse(val || '{}')));
          } catch (e) {
            all.push({ id: key.name, raw: val });
          }
        }
        cursor = list.cursor;
      } while (cursor);

      all.sort((a, b) => (a.receivedAt < b.receivedAt) ? 1 : -1);
      return new Response(JSON.stringify(all), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: 'Unable to read KV' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const result = (typeof sanitizeInput === 'function')
      ? sanitizeInput(body)
      : { data: body || {}, errors: [] };

    if (result.errors && result.errors.length) {
      return new Response(JSON.stringify({ success: false, errors: result.errors }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    let savedKey = null;
    try {
      const kv = env && env.CONTACTS_KV;
      if (kv && typeof kv.put === 'function') {
        const key = `contact:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
        await kv.put(key, JSON.stringify(result.data));
        savedKey = key;
      }
    } catch (kvErr) {
      console.error('KV put error:', kvErr);
    }

    const resp = { success: true, data: result.data };
    if (savedKey) resp.id = savedKey;
    return new Response(JSON.stringify(resp), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
