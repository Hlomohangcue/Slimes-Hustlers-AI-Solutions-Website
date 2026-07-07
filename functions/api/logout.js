export async function onRequest(context) {
  const { request, env } = context;

  // Accept POST to clear auth cookie or token
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  // For cookie-based auth, instruct client to clear cookie by setting expired Set-Cookie
  const headers = {
    'Content-Type': 'application/json',
    'Set-Cookie': 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
  };

  // If tokens are server-side invalidated, that logic would go here.
  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}
