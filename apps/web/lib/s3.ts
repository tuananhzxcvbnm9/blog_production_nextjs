import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { allowedMimeTypes, maxUploadSize } from './utils';

const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.S3_BUCKET || 'your-bucket';
const prefix = process.env.S3_UPLOAD_PREFIX || 'uploads';

const s3 = new S3Client({ region });

export async function createPresignedUpload(filename: string, mimeType: string, size: number) {
  if (!allowedMimeTypes.includes(mimeType)) throw new Error('INVALID_MIME_TYPE');
  if (size > maxUploadSize) throw new Error('FILE_TOO_LARGE');

  const ext = filename.split('.').pop() || 'bin';
  const date = new Date();
  const key = `${prefix}/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: mimeType
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL || `https://${bucket}.s3.${region}.amazonaws.com`;

  return { key, uploadUrl, fileUrl: `${publicBaseUrl}/${key}` };
}
