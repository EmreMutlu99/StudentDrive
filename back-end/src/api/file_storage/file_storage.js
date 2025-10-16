const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const MinioStorage = require('../../service/minIO_Storage/minIO_Storage');
const { PrismaClient } = require('../../generated/prisma'); // ⬅️ adjust path if needed

const prisma = new PrismaClient();
const router = express.Router();

// Initialize MinIO storage (your existing class)
const storage = new MinioStorage();
const storageBackend = 'minio';

// Multer memory storage (100 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'audio/wav',
  'audio/mpeg',
];

function validateFileType(mimetype) {
  return ALLOWED_MIME_TYPES.includes(mimetype);
}

/**
 * Helper to convert Prisma File record (camelCase) → API response (snake_case)
 */
function toSnake(file) {
  if (!file) return null;
  return {
    id: file.id,
    user_id: file.userId,
    filename: file.filename,
    original_filename: file.originalFilename,
    mimetype: file.mimetype,
    size_bytes: file.sizeBytes,
    storage_path: file.storagePath,
    storage_backend: file.storageBackend,
    created_at: file.createdAt,
    verified_at: file.verifiedAt,
  };
}

/**
 * POST /api/files
 * Upload → MinIO, then DB; rollback MinIO on DB failure.
 */
router.post('/', upload.single('file'), async (req, res) => {
  let uploadedObjectKey = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided', statusCode: 400 });
    }

    const userId = req.body.user_id; // String (User.id is cuid() string)
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required', statusCode: 400 });
    }

    if (!validateFileType(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type. Only PDF, JPEG, PNG, WAV, and MP3 are allowed',
        statusCode: 400,
      });
    }

    const ext = path.extname(req.file.originalname);
    const uniqueFilename = `${uuidv4()}${ext}`;

    // PHASE 1: Upload to MinIO
    const storagePath = await storage.upload(req.file.buffer, uniqueFilename, req.file.mimetype);
    uploadedObjectKey = storagePath;

    // PHASE 2: Create DB record via Prisma
    try {
      const created = await prisma.file.create({
        data: {
          userId,
          filename: uniqueFilename,           // human-ish name (uuid.ext)
          originalFilename: req.file.originalname,
          mimetype: req.file.mimetype,
          sizeBytes: req.file.size,
          storagePath: storagePath,           // object key in MinIO
          storageBackend: storageBackend,     // enum default is 'minio'
        },
      });

      return res.status(201).json(toSnake(created));
    } catch (dbError) {
      // Rollback MinIO to avoid orphan object
      try {
        await storage.delete(uploadedObjectKey);
      } catch (rollbackError) {
        console.error('Rollback failed (orphaned in MinIO):', uploadedObjectKey, rollbackError);
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Storage service error', statusCode: 500 });
  }
});

/**
 * GET /api/files/:id
 * DB → MinIO; graceful if object missing.
 */
router.get('/:id', async (req, res) => {
  try {
    const fileId = Number(req.params.id);
    if (!Number.isInteger(fileId)) {
      return res.status(400).json({ error: 'Invalid file id', statusCode: 400 });
    }

    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'user_id query parameter is required', statusCode: 400 });
    }

    // Fetch metadata
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({ error: 'File not found', statusCode: 404 });
    }

    // Ownership check
    if (file.userId !== userId) {
      return res.status(403).json({ error: 'Access denied', statusCode: 403 });
    }

    // Download from MinIO
    try {
      const buffer = await storage.download(file.storagePath);

      res.setHeader('Content-Type', file.mimetype);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.originalFilename}"`
      );
      return res.send(buffer);
    } catch (storageError) {
      console.error('Storage download error:', storageError);
      return res.status(500).json({
        error: 'File data not found in storage',
        statusCode: 500,
        details:
          'The file record exists but the file data is missing. This may indicate a storage inconsistency.',
      });
    }
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Server error', statusCode: 500 });
  }
});

/**
 * GET /api/files
 * List files for a user (snake_case fields).
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'user_id query parameter is required', statusCode: 400 });
    }

    const rows = await prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(rows.map(toSnake));
  } catch (error) {
    console.error('List files error:', error);
    return res.status(500).json({ error: 'Server error', statusCode: 500 });
  }
});

/**
 * DELETE /api/files/:id
 * DB delete first → then MinIO; accept orphan if MinIO fails.
 */
router.delete('/:id', async (req, res) => {
  try {
    const fileId = Number(req.params.id);
    if (!Number.isInteger(fileId)) {
      return res.status(400).json({ error: 'Invalid file id', statusCode: 400 });
    }

    const userId = req.body.user_id || req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required', statusCode: 400 });
    }

    // Fetch metadata for checks & MinIO key
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({ error: 'File not found', statusCode: 404 });
    }

    if (file.userId !== userId) {
      return res.status(403).json({ error: 'Access denied', statusCode: 403 });
    }

    const storagePathToDelete = file.storagePath;

    // Phase 1: delete DB record
    await prisma.file.delete({ where: { id: fileId } });

    // Phase 2: best-effort MinIO delete
    try {
      await storage.delete(storagePathToDelete);
      return res.json({ message: 'File deleted successfully' });
    } catch (storageError) {
      console.warn('MinIO deletion failed - orphaned file:', storagePathToDelete, storageError.message);
      return res.json({ message: 'File deleted successfully', warning: 'Storage cleanup pending' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Server error', statusCode: 500 });
  }
});

module.exports = router;
