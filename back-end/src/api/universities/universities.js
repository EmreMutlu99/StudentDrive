const express = require('express');
const { prisma } = require('../../../prisma');

const router = express.Router();

/**
 * GET /api/meta/universities
 * Returns list of universities
 */
router.get('/', async (req, res) => {
  try {
    const universities = await prisma.university.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, country: true, city: true }
    });
    res.json(universities);
  } catch (err) {
    console.error('Error fetching universities:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
