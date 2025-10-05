const express = require('express');
const rateLimit = require('express-rate-limit');
const { prisma } = require('../../../prisma');
const argon2 = require('argon2');
const { sendTemplatedEmail } = require('../email_sender/email_sender/email.service'); // ← fixed path

const router = express.Router();
const ttlDays = 30;

/* ---------------- Email verification config ---------------- */
const VERIFICATION_TTL_MIN  = parseInt(process.env.VERIFICATION_TTL_MIN || '15', 10);
const VERIFICATION_CODE_LEN = parseInt(process.env.VERIFICATION_CODE_LEN || '6', 10);
const MAX_ATTEMPTS          = parseInt(process.env.VERIFICATION_MAX_ATTEMPTS || '5', 10);
const VERIFICATION_TTL_MS   = VERIFICATION_TTL_MIN * 60 * 1000;

/* -------------------- Rate limit: /register ---------------- */
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

/* --------------- Random numeric code generator ------------- */
function makeNumericCode(len = VERIFICATION_CODE_LEN) {
  const digits = '0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += digits[Math.floor(Math.random() * 10)];
  return out;
}

/* ----------------- Whitelist request body ------------------ */
function pickRegistrationData(body) {
  const email          = (body.email || '').toLowerCase().trim();
  const password       = body.password || '';
  const username       = body.username?.trim() || null;
  const avatarUrl      = body.avatarUrl?.trim() || null;
  const startSemester  = body.startSemester?.trim() || null;
  const universityId   = body.universityId || null;
  const degreeProgramId= body.degreeProgramId || null;
  return {
    email, password, username, avatarUrl, startSemester, universityId, degreeProgramId
  };
}

/* ------ Integrity check: program must belong to university -- */
async function programBelongsToUniversity(degreeProgramId, universityId) {
  if (!degreeProgramId || !universityId) return true; // let 'required' validators handle empties
  const prog = await prisma.degreeProgram.findUnique({
    where: { id: degreeProgramId },
    select: { universityId: true },
  });
  return !!prog && prog.universityId === universityId;
}

/* =========================== REGISTER =========================== */
/* Legacy “immediate create” flow (kept in case you still call it) */
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const {
      email, password, username, avatarUrl,
      startSemester, universityId, degreeProgramId
    } = pickRegistrationData(req.body);

    // Basic validation
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'invalid email' });
    if (password.length < 6 || password.length > 200) return res.status(400).json({ error: 'password must be 6–200 characters' });
    if (username && !/^[a-zA-Z0-9._-]{3,20}$/.test(username))
      return res.status(400).json({ error: 'username must be 3–20 chars: letters, numbers, . _ -' });
    if (avatarUrl && !/^https?:\/\/.+/i.test(avatarUrl))
      return res.status(400).json({ error: 'avatarUrl must be a valid URL' });

    // Existence checks
    if (universityId) {
      const uni = await prisma.university.findUnique({ where: { id: universityId }, select: { id: true } });
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
    if (!belongs) return res.status(400).json({ error: 'Selected degree program does not belong to the chosen university.' });

    // Hash password
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id, timeCost: 3, memoryCost: 19456, parallelism: 1,
    });

    // Build relation connects
    const relationData = {};
    if (universityId)    relationData.university    = { connect: { id: universityId } };
    if (degreeProgramId) relationData.degreeProgram = { connect: { id: degreeProgramId } };

    // Create user (return relations, not scalar FKs)
    const user = await prisma.user.create({
      data: {
        email,
        username: username || null,
        passwordHash,
        avatarUrl,
        startSemester,
        role: 'USER',
        isActive: true,
        emailVerified: false,
        ...relationData,
      },
      include: {
        university:    { select: { id: true, name: true } },
        degreeProgram: { select: { id: true, name: true, degree: true } },
      },
    });

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

/* ------------- Email verification: start (send code) ------------- */
router.post('/register/start', registerLimiter, async (req, res) => {
  try {
    const {
      email, password, username, avatarUrl,
      startSemester, universityId, degreeProgramId
    } = pickRegistrationData(req.body);

    // Basic validation
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'invalid email' });
    if (password.length < 6 || password.length > 200) return res.status(400).json({ error: 'password must be 6–200 characters' });
    if (username && !/^[a-zA-Z0-9._-]{3,20}$/.test(username))
      return res.status(400).json({ error: 'username must be 3–20 chars: letters, numbers, . _ -' });
    if (avatarUrl && !/^https?:\/\/.+/i.test(avatarUrl))
      return res.status(400).json({ error: 'avatarUrl must be a valid URL' });

    // Uniqueness checks
    const existingEmail = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingEmail) return res.status(409).json({ error: 'email already in use' });
    if (username) {
      const existingUname = await prisma.user.findUnique({ where: { username }, select: { id: true } });
      if (existingUname) return res.status(409).json({ error: 'username already in use' });
    }

    // Referential integrity
    if (universityId) {
      const uni = await prisma.university.findUnique({ where: { id: universityId }, select: { id: true } });
      if (!uni) return res.status(400).json({ error: 'invalid universityId' });
    }
    if (degreeProgramId) {
      const prog = await prisma.degreeProgram.findUnique({
        where: { id: degreeProgramId },
        select: { id: true, universityId: true },
      });
      if (!prog) return res.status(400).json({ error: 'invalid degreeProgramId' });
    }
    const belongs = await programBelongsToUniversity(degreeProgramId, universityId);
    if (!belongs) return res.status(400).json({ error: 'Selected degree program does not belong to the chosen university.' });

    // Hash password **now**; never store raw password
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id, timeCost: 3, memoryCost: 19456, parallelism: 1,
    });

    // Generate and hash code
    const code = makeNumericCode();
    const codeHash = await argon2.hash(code, { type: argon2.argon2id });

    // Persist payload (without raw password)
    const payload = {
      email,
      username,
      avatarUrl,
      startSemester,
      universityId,
      degreeProgramId,
      passwordHash,
    };

    const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS);

    await prisma.emailVerification.upsert({
      where: { email },
      update: {
        codeHash,
        payloadJson: JSON.stringify(payload),
        expiresAt,
        attempts: 0,
        lastSentAt: new Date(),
      },
      create: {
        email,
        codeHash,
        payloadJson: JSON.stringify(payload),
        expiresAt,
      },
    });

    // Send the email
    await sendTemplatedEmail({
      to: [email],
      subject: 'Your StudentDrive verification code',
      header: 'Verify your email',
      contentHtml: `
        <p>Your verification code is:</p>
        <p style="font-size:20px; font-weight:700; letter-spacing:2px">${code}</p>
        <p>This code expires in ${VERIFICATION_TTL_MIN} minutes.</p>
      `,
    });

    return res.json({ ok: true, expiresInMinutes: VERIFICATION_TTL_MIN });
  } catch (e) {
    console.error('register/start error:', e);
    return res.status(500).json({ error: 'internal error' });
  }
});

/* ---------------- Email verification: confirm code --------------- */
// Body: { email, code }
router.post('/register/confirm', registerLimiter, async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    const code  = (req.body.code || '').trim();

    if (!email || !code) return res.status(400).json({ error: 'email and code are required' });

    const row = await prisma.emailVerification.findUnique({ where: { email } });
    if (!row) return res.status(400).json({ error: 'no verification pending for this email' });

    if (row.expiresAt < new Date()) {
      await prisma.emailVerification.delete({ where: { email } }).catch(() => {});
      return res.status(400).json({ error: 'verification code expired' });
    }

    if ((row.attempts || 0) >= MAX_ATTEMPTS) {
      await prisma.emailVerification.delete({ where: { email } }).catch(() => {});
      return res.status(429).json({ error: 'too many attempts' });
    }

    const ok = await argon2.verify(row.codeHash, code);
    if (!ok) {
      await prisma.emailVerification.update({
        where: { email },
        data: { attempts: { increment: 1 } },
      });
      return res.status(401).json({ error: 'invalid code' });
    }

    // Parse stored payload
    let payload;
    try {
      payload = JSON.parse(row.payloadJson || '{}');
    } catch {
      return res.status(500).json({ error: 'invalid stored payload' });
    }

    if (payload.email !== email) {
      return res.status(400).json({ error: 'email mismatch' });
    }

    // Build relation connects
    const relationData = {};
    if (payload.universityId)    relationData.university    = { connect: { id: payload.universityId } };
    if (payload.degreeProgramId) relationData.degreeProgram = { connect: { id: payload.degreeProgramId } };

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username: payload.username || null,
        passwordHash: payload.passwordHash,
        avatarUrl: payload.avatarUrl || null,
        startSemester: payload.startSemester || null,
        role: 'USER',
        isActive: true,
        emailVerified: true,
        ...relationData,
      },
      include: {
        university:    { select: { id: true, name: true } },
        degreeProgram: { select: { id: true, name: true, degree: true } },
      },
    });

    // Cleanup verification row
    await prisma.emailVerification.delete({ where: { email } }).catch(() => {});

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
    console.error('register/confirm error:', e);
    return res.status(500).json({ error: 'internal error' });
  }
});

/* ============================ LOGIN ============================= */
router.post('/login', async (req, res) => {
  const email = (req.body.email || '').toLowerCase().trim();
  const password = req.body.password || '';
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'invalid email' });

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      university:    { select: { id: true, name: true } },
      degreeProgram: { select: { id: true, name: true, degree: true } },
    }
  });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt,
      userAgent: req.headers['user-agent']?.toString().slice(0, 400) || null,
      lastSeenAt: new Date(),
    }
  });

  res.cookie('sid', session.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
  });

  res.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      startSemester: user.startSemester,
      university: user.university ? { id: user.university.id, name: user.university.name } : null,
      degreeProgram: user.degreeProgram
        ? { id: user.degreeProgram.id, name: user.degreeProgram.name, degree: user.degreeProgram.degree }
        : null,
    }
  });
});

/* ============================== ME ============================== */
router.get('/me', async (req, res) => {
  const sid = req.cookies?.sid;
  if (!sid) return res.status(401).json({ error: 'unauthorized' });

  const s = await prisma.session.findUnique({
    where: { id: sid },
    include: {
      user: {
        include: {
          university:    { select: { id: true, name: true } },
          degreeProgram: { select: { id: true, name: true, degree: true } },
        }
      }
    }
  });

  if (!s || s.revokedAt || s.expiresAt < new Date()) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Touch lastSeenAt (non-blocking)
  prisma.session.update({ where: { id: sid }, data: { lastSeenAt: new Date() } }).catch(() => {});

  const u = s.user;
  res.json({
    id: u.id,
    email: u.email,
    username: u.username,
    avatarUrl: u.avatarUrl,
    startSemester: u.startSemester,
    university: u.university ? { id: u.university.id, name: u.university.name } : null,
    degreeProgram: u.degreeProgram
      ? { id: u.degreeProgram.id, name: u.degreeProgram.name, degree: u.degreeProgram.degree }
      : null,
    createdAt: u.createdAt,
  });
});

/* ============================ LOGOUT ============================ */
router.post('/logout', async (req, res) => {
  const sid = req.cookies?.sid;
  if (sid) {
    await prisma.session.updateMany({ where: { id: sid }, data: { revokedAt: new Date() } });
    res.clearCookie('sid');
  }
  res.json({ ok: true });
});

module.exports = router;
