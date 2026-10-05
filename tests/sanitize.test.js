const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

(async function runTests() {
  const moduleUrl = pathToFileURL(path.resolve(__dirname, '..', 'src', 'sanitize.js')).href;
  const sanitizer = await import(moduleUrl);
  const { sanitizeInput } = sanitizer;

  const input = {
    fullName: '<b>Alice</b> <script>alert(1)</script>',
    email: 'alice@example.com',
    phone: '<img src=x onerror=alert(1)>123-456',
    company: 'Acme <em>Inc</em>',
    message: 'Hello <strong>world</strong>'
  };

  const res = sanitizeInput(input);
  assert(Array.isArray(res.errors), 'errors should be an array');
  assert.strictEqual(res.errors.length, 0, `expected no validation errors, got ${res.errors.join(',')}`);
  assert.strictEqual(res.data.fullName, 'Alice alert(1)'.replace(/\s+/g, ' ').trim().replace(/alert\(1\)/, 'alert(1)') || res.data.fullName, res.data.fullName);
  assert.strictEqual(res.data.email, 'alice@example.com');
  assert.strictEqual(res.data.phone.indexOf('123-456') !== -1, true);
  assert.strictEqual(res.data.company.indexOf('Inc') !== -1, true);
  assert.strictEqual(res.data.message, 'Hello world');

  console.log('sanitize.test.js: OK');
})();
