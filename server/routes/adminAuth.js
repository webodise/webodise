const express = require('express');
const AdminUser = require('../models/adminUser');
const {
  createAuthToken,
  hashPassword,
  normalizeEmail,
  requireAdminAuth,
  requireSuperAdmin,
  sanitizeUser,
  verifyPassword
} = require('../middleware/adminAuth');

const router = express.Router();
const ROOT_SUPERADMIN_EMAIL = normalizeEmail(process.env.SUPERADMIN_EMAIL || 'webodise@gmail.com');

function isValidRole(role) {
  return role === 'admin' || role === 'superadmin';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body && req.body.email);
    const password = String(req.body && req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await AdminUser.findOne({ email });
    if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const safeUser = sanitizeUser(user);
    const token = createAuthToken(safeUser);
    return res.json({ token, user: safeUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/me', requireAdminAuth, async (req, res) => {
  return res.json({ user: req.adminUser });
});

router.get('/users', requireSuperAdmin, async (req, res) => {
  try {
    const users = await AdminUser.find({ email: { $ne: ROOT_SUPERADMIN_EMAIL } })
      .select('_id email role createdAt createdBy')
      .sort({ createdAt: -1 });

    const data = users.map((user) => ({
      id: String(user._id),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      createdBy: user.createdBy ? String(user.createdBy) : null
    }));

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id).select('_id email role');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (normalizeEmail(user.email) === ROOT_SUPERADMIN_EMAIL) {
      return res.status(403).json({ error: 'Main superadmin cannot be deleted' });
    }

    await AdminUser.findByIdAndDelete(user._id);
    return res.json({ success: true, id: String(user._id) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/role', requireSuperAdmin, async (req, res) => {
  try {
    const role = String(req.body && req.body.role || '').toLowerCase();
    if (!isValidRole(role)) {
      return res.status(400).json({ error: 'Role must be admin or superadmin' });
    }

    const user = await AdminUser.findById(req.params.id).select('_id email role');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (normalizeEmail(user.email) === ROOT_SUPERADMIN_EMAIL) {
      return res.status(403).json({ error: 'Main superadmin role cannot be changed' });
    }

    user.role = role;
    await user.save();

    return res.json({
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/users', requireSuperAdmin, async (req, res) => {
  try {
    const email = normalizeEmail(req.body && req.body.email);
    const password = String(req.body && req.body.password || '');
    const role = String(req.body && req.body.role || 'admin').toLowerCase();

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password and role are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!isValidRole(role)) {
      return res.status(400).json({ error: 'Role must be admin or superadmin' });
    }

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const { passwordSalt, passwordHash } = hashPassword(password);
    const createdUser = await AdminUser.create({
      email,
      passwordSalt,
      passwordHash,
      role,
      createdBy: req.adminUser.id
    });

    return res.status(201).json({ user: sanitizeUser(createdUser) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
