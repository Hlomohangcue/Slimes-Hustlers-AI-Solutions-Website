;(function(){
  'use strict';

  function stripTags(s){
    if (s === undefined || s === null) return '';
    return String(s).replace(/<[^>]*>/g, '').trim();
  }

  function isEmail(e){
    return typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function sanitizeInput(obj){
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

  // CommonJS export for Node tests
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sanitizeInput, stripTags, isEmail };
  }

  // Make available on globalThis for Cloudflare Functions when imported
  if (typeof globalThis !== 'undefined') {
    globalThis.sanitizeInput = sanitizeInput;
  }
})();
