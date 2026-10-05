const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

const REQUIRED_HEADERS = [
  'Content-Security-Policy',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy'
];

function assertHasSecurityHeaders(response, context) {
  for (const headerName of REQUIRED_HEADERS) {
    const value = response.headers.get(headerName);
    assert.ok(value && value.length > 0, `${context}: missing ${headerName}`);
  }
}

(async function runTests() {
  const moduleUrl = pathToFileURL(path.resolve(__dirname, '..', 'src', 'index.js')).href;
  const workerModule = await import(moduleUrl);
  const worker = workerModule.default;

  const env = {
    ENVIRONMENT: 'production',
    ASSETS: {
      fetch: async () => new Response('<html><body>ok</body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      })
    }
  };

  const healthResponse = await worker.fetch(new Request('https://example.com/health', { method: 'GET' }), env);
  assert.strictEqual(healthResponse.status, 200);
  assertHasSecurityHeaders(healthResponse, '/health');

  const notFoundApiResponse = await worker.fetch(new Request('https://example.com/api/unknown', { method: 'GET' }), env);
  assert.strictEqual(notFoundApiResponse.status, 404);
  assertHasSecurityHeaders(notFoundApiResponse, '/api/unknown');

  const staticAssetResponse = await worker.fetch(new Request('https://example.com/index.html', { method: 'GET' }), env);
  assert.strictEqual(staticAssetResponse.status, 200);
  assertHasSecurityHeaders(staticAssetResponse, '/index.html');

  console.log('security-headers.test.js: OK');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
