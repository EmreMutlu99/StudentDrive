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
  const username = body.username?.trim() || null;
  const avatarUrl = body.avatarUrl?.trim() || null;
  const startSemester = body.startSemester?.trim() || null;

  // IDs are optional; we’ll connect if present
  const universityId = body.universityId || null;
  const degreeProgramId = body.degreeProgramId || null;

  return { email, password, username, avatarUrl, startSemester, universityId, degreeProgramId };
}

async function programBelongsToUniversity(degreeProgramId, universityId) {
  if (!degreeProgramId || !universityId) return true; // let required validators handle empties
  const prog = await prisma.degreeProgram.findUnique({
    where: { id: degreeProgramId },
    select: { universityId: true },
  });
  return !!prog && prog.universityId === universityId;
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
    console.log('/register : ', req.body);
    const {
      email, password, username, avatarUrl,
      startSemester, universityId, degreeProgramId
    } = pickRegistrationData(req.body);

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'invalid email' });
    }
    if (password.length < 6 || password.length > 200) {
      return res.status(400).json({ error: 'password must be 6–200 characters' });
    }
    if (username && !/^[a-zA-Z0-9._-]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'username must be 3–20 chars: letters, numbers, . _ -' });
    }
    if (avatarUrl && !/^https?:\/\/.+/i.test(avatarUrl)) {
      return res.status(400).json({ error: 'avatarUrl must be a valid URL' });
    }

    // Existence checks
    if (universityId) {
      const uni = await prisma.university.findUnique({
        where: { id: universityId },
        select: { id: true },
      });
      if (!uni) return res.status(400).json({ error: 'invalid universityId' });
    }

    if (degreeProgramId) {
      const prog = await prisma.degreeProgram.findUnique({
        where: { id: degreeProgramId },
        select: { id: true, universityId: true },
      });
      if (!prog) return res.status(400).json({ error: 'invalid degreeProgramId' });
    }

    // Belongs-to check
    const belongs = await programBelongsToUniversity(degreeProgramId, universityId);
    if (!belongs) {
      return res.status(400).json({ error: 'Selected degree program does not belong to the chosen university.' });
    }

    // Hash password
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 19456,
      parallelism: 1,
    });

    // Build relation connects (works whether you have scalar FKs or not)
    const relationData = {};
    if (universityId) {
      relationData.university = { connect: { id: universityId } };
    }
    if (degreeProgramId) {
      relationData.degreeProgram = { connect: { id: degreeProgramId } };
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username || null,
        passwordHash,
        avatarUrl,
        startSemester,
        role: 'USER',
        isActive: true,
        emailVerified: false,
        ...relationData,
      },
      // If you no longer have scalar FK columns, use include to return ids
      include: {
        university: { select: { id: true, name: true } },
        degreeProgram: { select: { id: true, name: true, degree: true } },
      },
    });

    // Shape a slender response
    return res.status(201).json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      startSemester: user.startSemester,
      university: user.university ? { id: user.university.id, name: user.university.name } : null,
      degreeProgram: user.degreeProgram
        ? { id: user.degreeProgram.id, name: user.degreeProgram.name, degree: user.degreeProgram.degree }
        : null,
      createdAt: user.createdAt,
    });
  } catch (e) {
    if (e?.code === 'P2002') {
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
