import express from 'express';
import { prisma } from './prisma.js';
import argon2 from 'argon2';

const router = express.Router();
const ttlDays = 30;

// Register
router.post('/register', async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    const password = req.body.password || '';
    const displayName = req.body.displayName || null;

    if (!email || !password) return res.status(400).json({ error: 'email+password required' });

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await prisma.user.create({
      data: { email, passwordHash, displayName }
    });

    res.status(201).json({ id: user.id, email: user.email, displayName: user.displayName });
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'email already exists' });
    console.error(e);
    res.status(500).json({ error: 'internal error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const email = (req.body.email || '').toLowerCase().trim();
  const password = req.body.password || '';
  if (!email || !password) return res.status(400).json({ error: 'email+password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({ data: { userId: user.id, expiresAt } });

  res.cookie('sid', session.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt
  });

  res.json({ ok: true, user: { id: user.id, email: user.email, displayName: user.displayName } });
});

// Me
router.get('/me', async (req, res) => {
  const sid = req.cookies?.sid;
  if (!sid) return res.status(401).json({ error: 'unauthorized' });

  const s = await prisma.session.findUnique({ where: { id: sid }, include: { user: true } });
  if (!s || s.revokedAt || s.expiresAt < new Date()) return res.status(401).json({ error: 'unauthorized' });

  res.json({ id: s.user.id, email: s.user.email, displayName: s.user.displayName });
});

// Logout
router.post('/logout', async (req, res) => {
  const sid = req.cookies?.sid;
  if (sid) {
    await prisma.session.updateMany({ where: { id: sid }, data: { revokedAt: new Date() } });
    res.clearCookie('sid');
  }
  res.json({ ok: true });
});

export default router;
