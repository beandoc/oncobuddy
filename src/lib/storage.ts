import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const BUCKET = process.env.AWS_S3_BUCKET || 'oncobuddy-clinical-assets';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

/**
 * Standard Clinical Asset Storage (Technical Guidance Section 4).
 * Directly uploads to S3 via pre-signed URLs to avoid server proxying.
 */
export async function createUploadUrl(
  patientId: string,
  filename: string,
  contentType: string,
  fileSizeMb: number
) {
  // Section 4: MIME/Size Validation
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
  const MAX_SIZE = Number(process.env.FILE_UPLOAD_MAX_SIZE_MB || 10);

  if (!ALLOWED_TYPES.includes(contentType)) throw new Error('CLINICAL_STORAGE_TYPE_REJECTED');
  if (fileSizeMb > MAX_SIZE) throw new Error('CLINICAL_STORAGE_SIZE_REJECTED');

  // Section 4: Identity Obfuscation (Hashed Pathing)
  const hashedPatientId = crypto.createHash('sha256').update(patientId).digest('hex');
  const documentId = crypto.randomUUID();
  const key = `patients/${hashedPatientId}/documents/${documentId}/${filename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType
  });

  // Section 4: 15min Expiry for Upload
  const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });

  return { url, key, documentId };
}

/**
 * Download Access for Clinical Assets (Section 4).
 */
export async function createDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key
  });

  // Section 4: 1hr Expiry for Download
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
