const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

(async function runTests() {
  const moduleUrl = pathToFileURL(path.resolve(__dirname, '..', 'src', 'index.js')).href;
  const workerModule = await import(moduleUrl);
  const worker = workerModule.default;

  const request = new Request('https://example.com/health', { method: 'GET' });
  const env = {
    ENVIRONMENT: 'production',
    ASSETS: {
      fetch: async () => new Response('not used', { status: 500 })
    }
  };

  const response = await worker.fetch(request, env);
  assert.strictEqual(response.status, 200, 'expected health endpoint to succeed');
  assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

  const body = await response.json();
  assert.strictEqual(body.service, 'Slimes.Hustlers AI Solutions');
  assert.strictEqual(body.status, 'healthy');
  assert.strictEqual(body.environment, 'production');
  assert.strictEqual(body.version, '1.0.0');
  assert.ok(typeof body.timestamp === 'string' && body.timestamp.length > 0, 'timestamp should be a non-empty string');
  assert.ok(!Number.isNaN(Date.parse(body.timestamp)), 'timestamp should be a valid ISO date string');

  console.log('health.test.js: OK');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
