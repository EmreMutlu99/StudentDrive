const express = require('express');
const { prisma } = require('../../../prisma'); // adjust if your prisma.js lives elsewhere
const argon2 = require('argon2');

const router = express.Router();
const ttlDays = 30;

/**
 * Helper: pick only allowed fields to prevent clients from setting role/isActive/etc.
 */
function pickRegistrationData(body) {
  const email = (body.email || '').toLowerCase().trim();
  const password = body.password || '';
  const username = body.username?.trim() || null;          // unique (optional)
  const avatarUrl = body.avatarUrl?.trim() || null;        // optional
  const startSemester = body.startSemester?.trim() || null;// e.g. "WS2024/25"

  // IDs are optional. If provided, we just set them (no create).
  const universityId = body.universityId || null;
  const facultyId = body.facultyId || null;

  return { email, password, username, avatarUrl, startSemester, universityId, facultyId };
}

// src/api/auth/auth.js
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, avatarUrl, startSemester, universityId, facultyId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    if (username && !/^[a-zA-Z0-9._-]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'username must be 3–20 chars: letters, numbers, . _ -' });
    }

    if (universityId) {
      const uni = await prisma.university.findUnique({ where: { id: universityId } });
      if (!uni) return res.status(400).json({ error: 'invalid universityId' });
    }
    if (facultyId) {
      const fac = await prisma.faculty.findUnique({ where: { id: facultyId } });
      if (!fac) return res.status(400).json({ error: 'invalid facultyId' });
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username?.trim() || null,
        passwordHash,
        avatarUrl,
        startSemester,
        universityId,
        facultyId
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        startSemester: true,
        universityId: true,
        facultyId: true,
        createdAt: true
      }
    });

    return res.status(201).json(user);
  } catch (e) {
    if (e?.code === 'P2002') {
      return res.status(409).json({ error: 'email or username already in use' });
    }
    console.error('Register error:', e);
    return res.status(500).json({ error: 'internal error' });
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
  const email = (req.body.email || '').toLowerCase().trim();
  const password = req.body.password || '';
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt,
      userAgent: req.headers['user-agent']?.toString().slice(0, 400) || null,
      lastSeenAt: new Date()
    }
  });

  res.cookie('sid', session.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt
  });

  res.json({
    ok: true,
    user: {
      id: user.id, email: user.email, displayName: user.displayName,
      username: user.username, avatarUrl: user.avatarUrl,
      startSemester: user.startSemester, universityId: user.universityId, facultyId: user.facultyId
    }
  });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const sid = req.cookies?.sid;
  if (!sid) return res.status(401).json({ error: 'unauthorized' });

  const s = await prisma.session.findUnique({
    where: { id: sid },
    include: { user: true }
  });

  if (!s || s.revokedAt || s.expiresAt < new Date()) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // touch lastSeenAt lightly (non-blocking)
  prisma.session.update({
    where: { id: sid },
    data: { lastSeenAt: new Date() }
  }).catch(() => {});

  const u = s.user;
  res.json({
    id: u.id, email: u.email, displayName: u.displayName,
    username: u.username, avatarUrl: u.avatarUrl,
    startSemester: u.startSemester, universityId: u.universityId, facultyId: u.facultyId,
    createdAt: u.createdAt
  });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const sid = req.cookies?.sid;
  if (sid) {
    await prisma.session.updateMany({ where: { id: sid }, data: { revokedAt: new Date() } });
    res.clearCookie('sid');
  }
  res.json({ ok: true });
});

module.exports = router;
