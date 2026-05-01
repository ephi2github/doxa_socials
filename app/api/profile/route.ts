import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
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

  const data = await req.json();
  const { displayName, photoUrl, links } = data;

  // Simple validation for links
  // In a real app, we'd check against PLATFORM_KEYS from lib/platforms
  
  await db
    .update(profile)
    .set({
      displayName,
      photoUrl,
      links: links || {},
      updatedAt: new Date(),
    })
    .where(eq(profile.userId, session.user.id));

  return NextResponse.json({ success: true });
}
