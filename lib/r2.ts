import 'server-only';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const R2_CONFIGURED = !!(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET &&
  process.env.R2_PUBLIC_URL
);

export const s3 = R2_CONFIGURED
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  : null;

export const R2_BUCKET = process.env.R2_BUCKET || '';
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

export function getR2KeyFromPublicUrl(url: string | null | undefined) {
  if (!url || !R2_PUBLIC_URL) return null;

  try {
    const publicBase = new URL(R2_PUBLIC_URL);
    const publicFile = new URL(url);

    if (publicBase.origin !== publicFile.origin) return null;

    const basePath = publicBase.pathname.replace(/\/$/, '');
    if (!publicFile.pathname.startsWith(`${basePath}/`)) return null;

    const key = publicFile.pathname.slice(basePath.length).replace(/^\/+/, '');
    return key || null;
  } catch {
    return null;
  }
}

export async function deleteR2ObjectByUrl(url: string | null | undefined) {
  if (!R2_CONFIGURED || !s3 || !url) return;

  const key = getR2KeyFromPublicUrl(url);
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    }),
  );
}
