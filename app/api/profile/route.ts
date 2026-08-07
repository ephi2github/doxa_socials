import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLATFORM_KEYS } from "@/lib/platforms";
import { deleteR2ObjectByUrl, getR2KeyFromPublicUrl } from "@/lib/r2";
import { profile } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userProfile = await db.query.profile.findFirst({
    where: eq(profile.userId, session.user.id),
  });

  return NextResponse.json(userProfile);
}

export async function PUT(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userProfile = await db.query.profile.findFirst({
    where: eq(profile.userId, session.user.id),
  });

  const data = await req.json();
  const { displayName, photoUrl, links } = data;
  const nextDisplayName = typeof displayName === "string" ? displayName : "";
  const nextPhotoUrl = typeof photoUrl === "string" && photoUrl.trim() ? photoUrl.trim() : null;
  const nextLinks =
    links && typeof links === "object"
      ? Object.fromEntries(
          Object.entries(links).filter(
            ([platformId, value]) => PLATFORM_KEYS.has(platformId) && typeof value === "string"
          )
        )
      : {};
  
  await db
    .update(profile)
    .set({
      displayName: nextDisplayName,
      photoUrl: nextPhotoUrl,
      links: nextLinks,
      updatedAt: new Date(),
    })
    .where(eq(profile.userId, session.user.id));

  const previousKey = getR2KeyFromPublicUrl(userProfile?.photoUrl);
  const nextKey = getR2KeyFromPublicUrl(nextPhotoUrl);

  if (previousKey && previousKey !== nextKey) {
    await deleteR2ObjectByUrl(userProfile?.photoUrl);
  }

  return NextResponse.json({ success: true });
}
