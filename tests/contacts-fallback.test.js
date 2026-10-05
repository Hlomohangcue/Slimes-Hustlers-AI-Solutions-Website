const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

(async function runTests() {
  const moduleUrl = pathToFileURL(path.resolve(__dirname, '..', 'src', 'contacts.js')).href;
  const { handleContactsRequest } = await import(moduleUrl);

  const request = new Request('https://example.com/api/contacts', {
    method: 'GET',
    headers: { Authorization: 'Bearer test-token' }
  });

  const env = {
    ADMIN_TOKEN: 'test-token',
    ASSETS: {
      fetch: async () => new Response(JSON.stringify([{ id: 'fallback-1', fullName: 'Fallback User', receivedAt: '2026-01-01T00:00:00.000Z' }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  };

  const response = await handleContactsRequest(request, env);
  assert.strictEqual(response.status, 200, 'expected fallback contacts response to succeed');

  const body = await response.json();
  assert.strictEqual(body[0].fullName, 'Fallback User');
  console.log('contacts-fallback.test.js: OK');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
