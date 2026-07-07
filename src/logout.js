export async function handleLogoutRequest(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const headers = {
    'Content-Type': 'application/json',
    'Set-Cookie': 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
  };

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}
