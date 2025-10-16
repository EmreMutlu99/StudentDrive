// src/services/minio-prisma-storage.js
const Minio = require('minio');
const { PrismaClient } = require('../../generated/prisma');
const { extname } = require('path');
const uuidv4 = require('uuid').v4; // CJS-friendly import

class MinioPrismaStorage {
  constructor(prismaInstance) {
    this.prisma = prismaInstance || new PrismaClient();
    this.validateConfig();

    const endpointUrl = new URL(process.env.MINIO_ENDPOINT);
    const useSSL = process.env.MINIO_USE_SSL === 'true';

    // Keep the same prop name as your original service for compatibility
    this.minioClient = new Minio.Client({
      endPoint: endpointUrl.hostname,
      port: parseInt(endpointUrl.port) || (useSSL ? 443 : 9000),
      useSSL,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      region: process.env.MINIO_REGION || 'us-east-1'
    });

    this.bucket = process.env.MINIO_BUCKET;
    console.log(`MinIO storage ready`);
  }

  /**
   * Same name/signature as before
   * Upload a file to MinIO and return the object key (storage_path)
   */
  async upload(fileBuffer, objectKey, mimetype) {
    try {
      const metadata = {
        'Content-Type': mimetype,
        'X-Upload-Date': new Date().toISOString()
      };

      await this.minioClient.putObject(
        this.bucket,
        objectKey,
        fileBuffer,
        fileBuffer.length,
        metadata
      );

      console.log(`Uploaded: ${objectKey} (${mimetype}, ${fileBuffer.length} bytes)`);
      return objectKey;
    } catch (error) {
      if (error.code === 'NoSuchBucket') throw new Error('Bucket not found');
      if (error.code === 'AccessDenied' || error.code === 'Forbidden') throw new Error('Storage authentication failed');
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') throw new Error('Storage service unavailable');
      throw new Error(`MinIO upload failed: ${error.message}`);
    }
  }

  /**
   * Same name/signature as before
   * Download a file from MinIO by object key
   */
  async download(objectKey) {
    try {
      const stream = await this.minioClient.getObject(this.bucket, objectKey);
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const fileBuffer = Buffer.concat(chunks);

      console.log(`Downloaded: ${objectKey} (${fileBuffer.length} bytes)`);
      return fileBuffer;
    } catch (error) {
      if (error.code === 'NoSuchKey' || error.code === 'NotFound') throw new Error('File not found');
      if (error.code === 'NoSuchBucket') throw new Error('Bucket not found');
      if (error.code === 'AccessDenied' || error.code === 'Forbidden') throw new Error('Storage authentication failed');
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') throw new Error('Storage service unavailable');
      throw new Error(`MinIO download failed: ${error.message}`);
    }
  }

  /**
   * Same name/signature as before
   * Delete a file from MinIO by object key
   */
  async delete(objectKey) {
    try {
      await this.minioClient.removeObject(this.bucket, objectKey);
      console.log(`Deleted: ${objectKey}`);
      return true;
    } catch (error) {
      if (error.code === 'NoSuchBucket') throw new Error('Bucket not found');
      if (error.code === 'AccessDenied' || error.code === 'Forbidden') throw new Error('Storage authentication failed');
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') throw new Error('Storage service unavailable');
      console.warn(`MinIO delete warning: ${error.message}`);
      return false;
    }
  }

  /**
   * Same helpers as your old class
   */
  validateConfig() {
    const required = ['MINIO_ENDPOINT', 'MINIO_ACCESS_KEY', 'MINIO_SECRET_KEY', 'MINIO_BUCKET'];
    const missing = required.filter(k => !process.env[k]);
    if (missing.length > 0) throw new Error(`Missing required MinIO configuration: ${missing.join(', ')}`);
  }

  async ensureBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucket);
      if (!exists) {
        console.log(`Bucket '${this.bucket}' not found, creating...`);
        await this.createBucket();
      } else {
        console.log(`Bucket '${this.bucket}' exists and is accessible`);
      }
    } catch (error) {
      if (error.code === 'Forbidden' || error.code === 'AccessDenied') throw new Error('Storage authentication failed: Invalid MinIO credentials');
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') throw new Error(`MinIO connection failed: Cannot reach ${process.env.MINIO_ENDPOINT}`);
      throw new Error(`MinIO bucket check failed: ${error.message}`);
    }
  }

  async createBucket() {
    try {
      await this.minioClient.makeBucket(this.bucket, process.env.MINIO_REGION || 'us-east-1');
      console.log(`Bucket '${this.bucket}' created successfully`);
      console.log('CORS: Configure in MinIO console if browser uploads are needed');
    } catch (error) {
      throw new Error(`Failed to create bucket: ${error.message}`);
    }
  }

  // ---------- Optional Prisma helpers (use only if you want DB integration here) ----------

  buildObjectKey(originalFilename, keyPrefix) {
    const ext = (extname(originalFilename) || '').toLowerCase();
    const id = uuidv4();
    return keyPrefix ? `${keyPrefix.replace(/\/+$/,'')}/${id}${ext}` : `${id}${ext}`;
    // Example keyPrefix: `uploads/2025/10`
  }

  /** Upload to MinIO AND create a DB row */
  async uploadAndCreate({ userId, buffer, originalFilename, mimetype, keyPrefix, storageBackend = 'minio' }) {
    const objectKey = this.buildObjectKey(originalFilename, keyPrefix);

    await this.upload(buffer, objectKey, mimetype); // reuse same-name method

    const file = await this.prisma.file.create({
      data: {
        userId,
        filename: objectKey,
        originalFilename,
        mimetype,
        sizeBytes: buffer.length,
        storagePath: objectKey,
        storageBackend
      }
    });
    return file;
  }

  /** Download by DB id */
  async downloadById(id) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new Error('File not found in database');
    const buffer = await this.download(file.storagePath);
    return { buffer, mimetype: file.mimetype, filename: file.originalFilename };
  }

  /** Delete MinIO + DB by id */
  async deleteById(id) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) return false;
    try { await this.delete(file.storagePath); } catch (_) {} // best-effort
    await this.prisma.file.delete({ where: { id } });
    return true;
  }

  /** Verify object exists and touch verifiedAt */
  async verifyAndTouch(id) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) return false;
    try {
      await this.minioClient.statObject(this.bucket, file.storagePath);
      await this.prisma.file.update({ where: { id }, data: { verifiedAt: new Date() } });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = MinioPrismaStorage;
