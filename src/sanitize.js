'use strict';

// Remove HTML tags and normalize user-provided text input.
function stripTags(s) {
  if (s === undefined || s === null) return '';
  return String(s).replace(/<[^>]*>/g, '').trim();
}

// Basic email shape validation for contact submissions.
function isEmail(e) {
  return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// Sanitize and validate incoming contact payload.
function sanitizeInput(obj) {
  const sanitized = {
    fullName: stripTags(obj && obj.fullName),
    email: stripTags(obj && obj.email),
    phone: stripTags(obj && obj.phone),
    company: stripTags(obj && obj.company),
    message: stripTags(obj && obj.message),
    receivedAt: new Date().toISOString()
  };

  const errors = [];
  if (!sanitized.fullName) errors.push('fullName is required');
  if (!isEmail(sanitized.email)) errors.push('email is invalid');
  if (!sanitized.message) errors.push('message is required');

  return { data: sanitized, errors };
}

// CommonJS export for Node-based tests.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sanitizeInput, stripTags, isEmail };
}

// Expose utility globally for fallback/runtime compatibility.
if (typeof globalThis !== 'undefined') {
  globalThis.sanitizeInput = sanitizeInput;
}

export { sanitizeInput, stripTags, isEmail };
