const express = require('express');
const { prisma } = require('../../../prisma');

const router = express.Router();

/**
 * GET /api/meta/degree-programs?universityId=rwth
 * Returns list of degree programs for given universityId
 */
router.get('/', async (req, res) => {
  try {
    const { universityId } = req.query;
    if (!universityId) {
      return res.status(400).json({ error: 'universityId is required' });
    }

    const programs = await prisma.degreeProgram.findMany({
      where: { universityId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        degree: true,
        language: true,
        startSemesters: true,
        nc: true
      }
    });

    res.json(programs);
  } catch (err) {
    console.error('Error fetching degree programs:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
