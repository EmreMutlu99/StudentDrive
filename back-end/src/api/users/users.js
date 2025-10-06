// src/routes/users/users.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const { prisma } = require('../../../prisma');

const router = express.Router();

// same rules you enforce at register time
const USERNAME_RE = /^[a-zA-Z0-9._-]{3,20}$/;

const checkLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 120,                // plenty for typing; still sane
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/users/username-available?username=foo
router.get('/username-available', checkLimiter, async (req, res) => {
  const username = String(req.query.username || '').trim();

  if (!username) return res.status(400).json({ error: 'username is required' });
  if (!USERNAME_RE.test(username)) {
    return res.status(400).json({
      error: 'invalid username',
      rules: '3–20 chars: letters, numbers, . _ -'
    });
  }

  try {
    const hit = await prisma.user.findUnique({
      where: { username },           // exact match (same as your register flow)
      select: { id: true },
    });

    // optional simple suggestions if taken
    const suggestions = [];
    if (hit) {
      const base = username.replace(/[^a-zA-Z0-9._-]/g, '');
      const ts = Date.now().toString().slice(-3);
      suggestions.push(
        `${base}${Math.floor(10 + Math.random()*89)}`,
        `${base}_${ts}`,
        `${base}.dev`
      );
    }

    return res.json({ available: !hit, suggestions });
  } catch (e) {
    console.error('username-available error:', e);
    return res.status(500).json({ error: 'internal error' });
  }
});

// GET /api/users/email-available?email=foo@bar.com
router.get('/email-available', checkLimiter, async (req, res) => {
    const email = String(req.query.email || '').toLowerCase().trim();
  
    if (!email) return res.status(400).json({ error: 'email is required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'invalid email' });
    }
  
    try {
      const hit = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      return res.json({ available: !hit });
    } catch (e) {
      console.error('email-available error:', e);
      return res.status(500).json({ error: 'internal error' });
    }
  });
  

module.exports = router;
