export async function handleLoginRequest(request, env) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const password = body && body.password;
    if (!password) {
      return new Response(JSON.stringify({ success: false, error: 'Password required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!env || !env.ADMIN_PASSWORD || !env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ success: false, error: 'Server not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if (password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const cookie = `admin_token=${encodeURIComponent(env.ADMIN_TOKEN)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24}`;

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
