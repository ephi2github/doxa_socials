import "server-only";

import { randomUUID } from "node:crypto";

import { db } from "@/lib/db";
import { profileView } from "@/lib/schema";
import { getClientIp, hashClientIp } from "@/lib/social-clicks";

// Link-unfurl bots are a large share of traffic for a link-in-bio product and would
// badly inflate the scan count if they were recorded as reads.
const BOT_USER_AGENT =
  /bot|crawler|spider|crawling|facebookexternalhit|slackbot|whatsapp|telegram|discordbot|twitterbot|linkedinbot|embedly|preview|monitor|headless|lighthouse|curl|wget|python-requests/i;

interface RecordProfileViewOptions {
  profileUserId: string;
  headers: Headers;
  isOwner: boolean;
}

export async function recordProfileView({
  profileUserId,
  headers,
  isOwner,
}: RecordProfileViewOptions) {
  // Owners looking at their own page aren't reads — same exclusion the click tracker uses.
  if (isOwner) return;

  // App Router prefetches render the page without anyone actually seeing it.
  if (headers.get("next-router-prefetch") || headers.get("purpose") === "prefetch") return;

  const userAgent = headers.get("user-agent") || "";
  if (BOT_USER_AGENT.test(userAgent)) return;

  // Local dev has no forwarding headers. Still record the view so totals are correct;
  // unique visitors just collapse to one bucket.
  const ipHash = hashClientIp(getClientIp(headers) ?? "unknown");

  try {
    await db.insert(profileView).values({
      id: randomUUID(),
      profileUserId,
      ipHash,
      createdAt: new Date(),
    });
  } catch (error) {
    // A tracking failure must never break the public page.
    console.error("[profile-views] Failed to record view", error);
  }
}
