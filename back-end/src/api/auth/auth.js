const express = require('express');
const rateLimit = require('express-rate-limit');             // ← NEW
const { prisma } = require('../../../prisma');
const argon2 = require('argon2');

const router = express.Router();
const ttlDays = 30;

/* -------------------- Rate limit: /register -------------------- */
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});

/* --------------- Whitelist input (no mass assignment) ----------- */
function pickRegistrationData(body) {
  const email = (body.email || '').toLowerCase().trim();
  const password = body.password || '';
  const username = body.username?.trim() || null;           // unique (optional)
  const avatarUrl = body.avatarUrl?.trim() || null;         // optional
  const startSemester = body.startSemester?.trim() || null; // e.g. "WS2024/25"
  const universityId = body.universityId || null;           // optional
  const facultyId = body.facultyId || null;                 // optional
  return { email, password, username, avatarUrl, startSemester, universityId, facultyId };
}

/* --------- Integrity check: faculty must belong to uni ---------- */
async function facultyBelongsToUniversity(facultyId, universityId) {
  if (!facultyId || !universityId) return true; // nothing to validate if one is missing
  const fac = await prisma.faculty.findFirst({
    where: { id: facultyId, universityId },
    select: { id: true },
  });
  return !!fac;
}

/* =========================== REGISTER =========================== */
// POST /api/auth/register
router.post('/register', registerLimiter, async (req, res) => {
  try {
    console.log("/register : ", req.body);
    // 1) pick only allowed fields
    const {
      email, password, username, avatarUrl,
      startSemester, universityId, facultyId
    } = pickRegistrationData(req.body);

    // 2) basic validation (no Zod version)
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    // email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'invalid email' });
    }
    // password length
    if (password.length < 6 || password.length > 200) {
      return res.status(400).json({ error: 'password must be 6–200 characters' });
    }
    // username rules (if provided)
    if (username && !/^[a-zA-Z0-9._-]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'username must be 3–20 chars: letters, numbers, . _ -' });
    }
    // avatarUrl (if provided)
    if (avatarUrl && !/^https?:\/\/.+/i.test(avatarUrl)) {
      return res.status(400).json({ error: 'avatarUrl must be a valid URL' });
    }

    // 3) integrity: check referenced ids exist + belong together
    if (universityId) {
      const uni = await prisma.university.findUnique({ where: { id: universityId }, select: { id: true } });
      if (!uni) return res.status(400).json({ error: 'invalid universityId' });
    }
    if (facultyId) {
      const facExists = await prisma.faculty.findUnique({ where: { id: facultyId }, select: { id: true, universityId: true } });
      if (!facExists) return res.status(400).json({ error: 'invalid facultyId' });
    }
    const ok = await facultyBelongsToUniversity(facultyId, universityId);
    if (!ok) {
      return res.status(400).json({ error: 'Selected faculty does not belong to the chosen university.' });
    }

    // 4) hash password (argon2id, strong params)
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 19456, // ~19MB
      parallelism: 1,
    });

    // 5) create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username || null,
        passwordHash,
        avatarUrl,
        startSemester,
        universityId,
        facultyId,
        role: 'USER',
        isActive: true,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        startSemester: true,
        universityId: true,
        facultyId: true,
        createdAt: true,
      }
    });

    // (We do NOT auto-login here; frontend can call /login next.)
    return res.status(201).json(user);
  } catch (e) {
    if (e?.code === 'P2002') {
      // Unique constraint (email or username)
      const fields = Array.isArray(e.meta?.target) ? e.meta.target.join(', ') : 'email/username';
      return res.status(409).json({ error: `${fields} already in use` });
    }
    console.error('Register error:', e);
    return res.status(500).json({ error: 'internal error' });
  }
});

/* ============================ LOGIN ============================= */
// POST /api/auth/login
router.post('/login', async (req, res) => {
  const email = (req.body.email || '').toLowerCase().trim();
  const password = req.body.password || '';
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  // minimal email sanity
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

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
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      startSemester: user.startSemester,
      universityId: user.universityId,
      facultyId: user.facultyId
      // displayName removed — not in your Prisma model
    }
  });
});

/* ============================== ME ============================== */
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
    id: u.id,
    email: u.email,
    username: u.username,
    avatarUrl: u.avatarUrl,
    startSemester: u.startSemester,
    universityId: u.universityId,
    facultyId: u.facultyId,
    createdAt: u.createdAt
  });
});

/* ============================ LOGOUT ============================ */
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
