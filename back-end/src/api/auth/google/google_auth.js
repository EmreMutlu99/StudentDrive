// src/api/auth/google/google_auth.js
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// POST /api/auth/google
router.post('/', async (req, res) => {
  try {
    const idToken = req.body.id_token;

    const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!resp.ok) return res.status(401).send('Invalid token');

    const data = await resp.json();

    if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).send('Wrong audience');
    }

    // Example: set cookie (replace with real session logic)
    res.cookie(
      'session',
      `session-for-${data.sub}`,
      { httpOnly: true, secure: true, sameSite: 'lax' }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
