import { auth } from "@/lib/auth";
import { R2_BUCKET, R2_CONFIGURED, R2_PUBLIC_URL, s3 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!R2_CONFIGURED) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  try {
    const { contentType, size } = await req.json();
    
    if (!contentType?.startsWith('image/')) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (typeof size !== "number" || size <= 0 || size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Image must be 10 MB or smaller" }, { status: 400 });
    }

    const key = `u/${session.user.id}/profile-image`;
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    const signedUrl = await getSignedUrl(s3 as any, command, { expiresIn: 3600 });
    const publicUrl = `${R2_PUBLIC_URL}/${key}?v=${Date.now()}`;

    return NextResponse.json({ signedUrl, publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
