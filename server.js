const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const publicDir = path.join(__dirname);
const dataDir = path.join(__dirname, 'data');
const contactsFile = path.join(dataDir, 'contacts.json');

// Configuration from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ALLOWED_IPS = (process.env.ALLOWED_IPS || 'localhost,127.0.0.1,::1').split(',').map(ip => ip.trim());
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT || '3600000'); // 1 hour in milliseconds

// Session storage (in-memory, use database in production)
const sessions = new Map();

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(contactsFile);
  } catch (error) {
    await fs.writeFile(contactsFile, '[]', 'utf8');
  }
}

// Session management helpers
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

function createSession(ipAddress) {
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + SESSION_TIMEOUT;
  sessions.set(sessionId, { ipAddress, expiresAt });
  return sessionId;
}

function isSessionValid(sessionId, ipAddress) {
  if (!sessions.has(sessionId)) return false;
  const session = sessions.get(sessionId);
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return false;
  }
  // Verify IP matches for additional security
  if (session.ipAddress !== ipAddress) return false;
  return true;
}

function getSessionIdFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('admin_session='));
  return sessionCookie ? sessionCookie.split('=')[1] : null;
}

function isIpAllowed(ip) {
  // Handle IPv6 localhost
  const normalizedIp = ip === '::1' ? '::1' : ip;
  return ALLOWED_IPS.includes(normalizedIp) || ALLOWED_IPS.includes(ip);
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
}

function normalizePath(urlPath) {
  let filePath = urlPath.split('?')[0];
  if (filePath === '/') filePath = '/index.html';
  return path.join(publicDir, path.normalize(filePath.replace(/^\//, '')));
}

function getContentType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function validateContact(payload) {
  const { fullName, email, phone, company, message } = payload;
  return (
    typeof fullName === 'string' && fullName.trim() &&
    typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof phone === 'string' && /\+?[0-9()\s-]{7,20}/.test(phone) &&
    typeof company === 'string' && company.trim() &&
    typeof message === 'string' && message.trim()
  );
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const clientIp = getClientIp(req);
  const cookieHeader = req.headers['cookie'];
  const sessionId = getSessionIdFromCookie(cookieHeader);

  // Handle admin login
  if (url === '/api/login' && method === 'POST') {
    if (!isIpAllowed(clientIp)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Access denied from your IP address' }));
    }

    try {
      const payload = await parseBody(req);
      if (payload.password === ADMIN_PASSWORD) {
        const newSessionId = createSession(clientIp);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': `admin_session=${newSessionId}; Path=/; HttpOnly; Max-Age=${SESSION_TIMEOUT / 1000}; SameSite=Strict`
        });
        return res.end(JSON.stringify({ success: true, message: 'Login successful' }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid password' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Bad request' }));
    }
  }

  // Handle admin logout
  if (url === '/api/logout' && method === 'POST') {
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin_session=; Path=/; HttpOnly; Max-Age=0'
    });
    return res.end(JSON.stringify({ success: true }));
  }

  // Protected API endpoint - Get contacts (requires authentication)
  if (url.startsWith('/api/contacts') && method === 'GET') {
    if (!isSessionValid(sessionId, clientIp)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Unauthorized. Please login to access admin panel.' }));
    }

    try {
      await ensureDataFile();
      const content = await fs.readFile(contactsFile, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(content);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Server error', details: error.message }));
    }
  }

  // Public contact form submission
  if (url === '/api/contacts' && method === 'POST') {
    try {
      await ensureDataFile();
      const payload = await parseBody(req);
      if (!validateContact(payload)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid submission data' }));
      }

      const current = JSON.parse(await fs.readFile(contactsFile, 'utf8'));
      const newEntry = {
        id: Date.now(),
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        company: payload.company.trim(),
        message: payload.message.trim(),
        receivedAt: new Date().toISOString()
      };
      current.push(newEntry);
      await fs.writeFile(contactsFile, JSON.stringify(current, null, 2), 'utf8');

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Server error', details: error.message }));
    }
  }

  // Protected page - admin.html (requires authentication)
  if (url === '/admin.html' || url.startsWith('/admin.html?')) {
    if (!isSessionValid(sessionId, clientIp)) {
      res.writeHead(302, { 'Location': '/login.html' });
      return res.end();
    }
  }

  const filePath = normalizePath(url);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad request');
  }

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Admin login at http://localhost:${PORT}/login.html`);
  console.log(`Admin password: ${ADMIN_PASSWORD === 'admin123' ? '(default - CHANGE THIS!)' : '(configured)'}`);
  console.log(`Allowed IPs: ${ALLOWED_IPS.join(', ')}`);
  console.log(`Session timeout: ${SESSION_TIMEOUT / 1000 / 60} minutes`);
});
