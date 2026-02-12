const crypto = require('crypto');
const AdminUser = require('../models/adminUser');

const TOKEN_TTL_HOURS = Number(process.env.ADMIN_TOKEN_TTL_HOURS || 24);
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'change-this-admin-auth-secret';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function toBase64Url(value) {
  return String(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function hashPassword(password, salt) {
  const passwordSalt = salt || crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(String(password), passwordSalt, 120000, 64, 'sha512').toString('hex');
  return { passwordSalt, passwordHash };
}

function verifyPassword(password, passwordSalt, passwordHash) {
  if (!password || !passwordSalt || !passwordHash) return false;
  const candidate = crypto.pbkdf2Sync(String(password), passwordSalt, 120000, 64, 'sha512').toString('hex');
  const candidateBuffer = Buffer.from(candidate, 'hex');
  const hashBuffer = Buffer.from(passwordHash, 'hex');
  if (candidateBuffer.length !== hashBuffer.length) return false;
  return crypto.timingSafeEqual(candidateBuffer, hashBuffer);
}

function base64UrlEncode(value) {
  return toBase64Url(Buffer.from(value, 'utf8').toString('base64'));
}

function base64UrlDecode(value) {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(normalized + '='.repeat(padding), 'base64').toString('utf8');
}

function signPayload(payloadEncoded) {
  return toBase64Url(crypto.createHmac('sha256', AUTH_SECRET).update(payloadEncoded).digest('base64'));
}

function createAuthToken(user) {
  const payload = {
    sub: String(user._id || user.id),
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (TOKEN_TTL_HOURS * 60 * 60)
  };
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

function verifyAuthToken(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 2) return null;

  const [payloadEncoded, providedSignature] = parts;
  const expectedSignature = signPayload(payloadEncoded);
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const providedBuffer = Buffer.from(providedSignature, 'utf8');

  if (expectedBuffer.length !== providedBuffer.length) return null;
  if (!crypto.timingSafeEqual(expectedBuffer, providedBuffer)) return null;

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadEncoded));
  } catch (error) {
    return null;
  }

  if (!payload || !payload.sub || !payload.exp) return null;
  if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

  return payload;
}

function sanitizeUser(user) {
  return {
    id: String(user._id),
    email: user.email,
    role: user.role
  };
}

function getTokenFromRequest(req) {
  const authorization = req.headers.authorization || '';
  if (authorization.startsWith('Bearer ')) {
    return authorization.slice(7).trim();
  }
  return '';
}

async function requireAdminAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await AdminUser.findById(payload.sub).select('_id email role');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.adminUser = sanitizeUser(user);
    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function requireRole(...allowedRoles) {
  return function roleCheck(req, res, next) {
    if (!req.adminUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.adminUser.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}

const requireAnyAdmin = [requireAdminAuth, requireRole('admin', 'superadmin')];
const requireSuperAdmin = [requireAdminAuth, requireRole('superadmin')];

async function ensureDefaultSuperAdmin() {
  const email = normalizeEmail(process.env.SUPERADMIN_EMAIL || 'webodise@gmail.com');
  const password = String(process.env.SUPERADMIN_PASSWORD || 'Vicki@9117');

  if (!email || !password) return;

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    let shouldSave = false;

    if (existing.role !== 'superadmin') {
      existing.role = 'superadmin';
      shouldSave = true;
    }

    if (!verifyPassword(password, existing.passwordSalt, existing.passwordHash)) {
      const { passwordSalt, passwordHash } = hashPassword(password);
      existing.passwordSalt = passwordSalt;
      existing.passwordHash = passwordHash;
      shouldSave = true;
    }

    if (shouldSave) {
      await existing.save();
      console.log(`Updated default superadmin account: ${email}`);
    }
    return;
  }

  const { passwordSalt, passwordHash } = hashPassword(password);
  await AdminUser.create({
    email,
    passwordSalt,
    passwordHash,
    role: 'superadmin'
  });
  console.log(`Created default superadmin: ${email}`);
}

module.exports = {
  createAuthToken,
  ensureDefaultSuperAdmin,
  hashPassword,
  normalizeEmail,
  requireAdminAuth,
  requireAnyAdmin,
  requireRole,
  requireSuperAdmin,
  sanitizeUser,
  verifyAuthToken,
  verifyPassword
};
