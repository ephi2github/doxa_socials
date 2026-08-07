import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlatformById } from "@/lib/platforms";
import { profile } from "@/lib/schema";
import { getClientIp, trackProfileSocialUniqueClick } from "@/lib/social-clicks";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicId: string; platformId: string }> }
) {
  const { publicId, platformId } = await params;

  const userProfile = await db.query.profile.findFirst({
    where: eq(profile.publicId, publicId),
  });

  if (!userProfile) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const platform = getPlatformById(platformId);
  const links = (userProfile.links || {}) as Record<string, string>;
  const handle = links[platformId];

  if (!platform || typeof handle !== "string" || !handle.trim()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const destinationUrl = platform.url(handle);
  const isOwner = session?.user.id === userProfile.userId;
  const clientIp = isOwner ? null : getClientIp(request.headers);

  if (clientIp) {
    await trackProfileSocialUniqueClick(userProfile.userId, platformId, clientIp);
  }

  return NextResponse.redirect(destinationUrl, 302);
}
