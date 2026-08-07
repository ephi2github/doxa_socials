import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { profileSocialUniqueClick } from "@/lib/schema";

const CLICK_TRACKER_SECRET = process.env.CLICK_TRACKER_SECRET ?? process.env.BETTER_AUTH_SECRET ?? "";

export function getClientIp(headers: Headers): string | null {
  const forwardedIp = headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((value) => value.trim())
    .find(Boolean);

  return (
    headers.get("cf-connecting-ip")?.trim() ||
    forwardedIp ||
    headers.get("x-real-ip")?.trim() ||
    null
  );
}

export function hashClientIp(ip: string): string {
  return createHash("sha256")
    .update(`${CLICK_TRACKER_SECRET}:${ip}`)
    .digest("hex");
}

export async function trackProfileSocialUniqueClick(profileUserId: string, platformId: string, ip: string) {
  await db
    .insert(profileSocialUniqueClick)
    .values({
      id: randomUUID(),
      profileUserId,
      platformId,
      ipHash: hashClientIp(ip),
      createdAt: new Date(),
    })
    .onConflictDoNothing();
}

export async function getProfileSocialUniqueClickCounts(profileUserId: string): Promise<Record<string, number>> {
  const rows = await db
    .select({
      platformId: profileSocialUniqueClick.platformId,
      uniqueClicks: sql<number>`count(*)`,
    })
    .from(profileSocialUniqueClick)
    .where(eq(profileSocialUniqueClick.profileUserId, profileUserId))
    .groupBy(profileSocialUniqueClick.platformId);

  return Object.fromEntries(
    rows.map(({ platformId, uniqueClicks }) => [platformId, Number(uniqueClicks) || 0])
  );
}
