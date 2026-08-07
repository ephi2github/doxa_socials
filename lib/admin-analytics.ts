import "server-only";

import { desc, gte, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  profile,
  profileSocialUniqueClick,
  profileView,
  qrEvent,
  session,
  user,
} from "@/lib/schema";

const DAY_MS = 24 * 60 * 60 * 1000;
const SERIES_DAYS = 14;

export interface DailyPoint {
  day: string;
  signups: number;
  views: number;
}

export interface RecentSignup {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  publicId: string | null;
  linkCount: number;
  views: number;
}

export interface TopProfile {
  publicId: string;
  displayName: string;
  views: number;
  uniqueVisitors: number;
}

export interface AdminOverview {
  totalAccounts: number;
  newAccounts7d: number;
  newAccounts30d: number;
  activeUsers30d: number;
  profilesWithLinks: number;
  qrIssued: number;
  qrDownloads: number;
  qrCopies: number;
  totalViews: number;
  uniqueVisitors: number;
  socialClicks: number;
  daily: DailyPoint[];
  recentSignups: RecentSignup[];
  topProfiles: TopProfile[];
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS);
}

function toNumber(value: unknown) {
  return Number(value) || 0;
}

/** UTC day key, matching SQLite's date(col, 'unixepoch'). */
function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const since7d = daysAgo(7);
  const since30d = daysAgo(30);
  const seriesStart = daysAgo(SERIES_DAYS - 1);

  const countAll = sql<number>`count(*)`;

  const [
    [accounts],
    [accounts7d],
    [accounts30d],
    [active30d],
    [profiles],
    [withLinks],
    qrEventRows,
    [views],
    [clicks],
    signupSeries,
    viewSeries,
    recentUsers,
    topProfileRows,
  ] = await Promise.all([
    db.select({ value: countAll }).from(user),
    db.select({ value: countAll }).from(user).where(gte(user.createdAt, since7d)),
    db.select({ value: countAll }).from(user).where(gte(user.createdAt, since30d)),
    // "Active" = signed in recently enough to still hold a session touched in the window.
    db
      .select({ value: sql<number>`count(distinct ${session.userId})` })
      .from(session)
      .where(gte(session.updatedAt, since30d)),
    // Every profile carries exactly one permanent QR code, so this is also "QR codes issued".
    db.select({ value: countAll }).from(profile),
    // A profile counts as "set up" once at least one platform has a non-empty handle.
    // `key is not null` skips profiles whose links were stored as a JSON scalar rather
    // than an object — json_each yields a single null-keyed row for those.
    db
      .select({ value: countAll })
      .from(profile)
      .where(
        sql`exists (
          select 1 from json_each(${profile.links})
          where json_each.key is not null and json_each.value != ''
        )`
      ),
    db.select({ kind: qrEvent.kind, value: countAll }).from(qrEvent).groupBy(qrEvent.kind),
    db
      .select({
        total: countAll,
        unique: sql<number>`count(distinct ${profileView.ipHash})`,
      })
      .from(profileView),
    db.select({ value: countAll }).from(profileSocialUniqueClick),
    db
      .select({
        day: sql<string>`date(${user.createdAt}, 'unixepoch')`,
        value: countAll,
      })
      .from(user)
      .where(gte(user.createdAt, seriesStart))
      .groupBy(sql`date(${user.createdAt}, 'unixepoch')`),
    db
      .select({
        day: sql<string>`date(${profileView.createdAt}, 'unixepoch')`,
        value: countAll,
      })
      .from(profileView)
      .where(gte(profileView.createdAt, seriesStart))
      .groupBy(sql`date(${profileView.createdAt}, 'unixepoch')`),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        publicId: profile.publicId,
        links: profile.links,
        views: sql<number>`(
          select count(*) from ${profileView}
          where ${profileView.profileUserId} = ${user.id}
        )`,
      })
      .from(user)
      .leftJoin(profile, sql`${profile.userId} = ${user.id}`)
      .orderBy(desc(user.createdAt))
      .limit(10),
    db
      .select({
        publicId: profile.publicId,
        displayName: profile.displayName,
        views: countAll,
        unique: sql<number>`count(distinct ${profileView.ipHash})`,
      })
      .from(profileView)
      .innerJoin(profile, sql`${profile.userId} = ${profileView.profileUserId}`)
      .groupBy(profile.publicId, profile.displayName)
      .orderBy(desc(countAll))
      .limit(5),
  ]);

  const qrCountsByKind = Object.fromEntries(
    qrEventRows.map((row) => [row.kind, toNumber(row.value)])
  );

  const signupsByDay = new Map(signupSeries.map((row) => [row.day, toNumber(row.value)]));
  const viewsByDay = new Map(viewSeries.map((row) => [row.day, toNumber(row.value)]));

  const daily: DailyPoint[] = Array.from({ length: SERIES_DAYS }, (_, index) => {
    const day = dayKey(new Date(Date.now() - (SERIES_DAYS - 1 - index) * DAY_MS));
    return {
      day,
      signups: signupsByDay.get(day) ?? 0,
      views: viewsByDay.get(day) ?? 0,
    };
  });

  const totalAccounts = toNumber(accounts?.value);

  return {
    totalAccounts,
    newAccounts7d: toNumber(accounts7d?.value),
    newAccounts30d: toNumber(accounts30d?.value),
    activeUsers30d: toNumber(active30d?.value),
    profilesWithLinks: toNumber(withLinks?.value),
    qrIssued: toNumber(profiles?.value),
    qrDownloads: qrCountsByKind.download ?? 0,
    qrCopies: qrCountsByKind.copy_link ?? 0,
    totalViews: toNumber(views?.total),
    uniqueVisitors: toNumber(views?.unique),
    socialClicks: toNumber(clicks?.value),
    daily,
    recentSignups: recentUsers.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.createdAt,
      publicId: row.publicId ?? null,
      linkCount: countLinks(row.links),
      views: toNumber(row.views),
    })),
    topProfiles: topProfileRows.map((row) => ({
      publicId: row.publicId,
      displayName: row.displayName,
      views: toNumber(row.views),
      uniqueVisitors: toNumber(row.unique),
    })),
  };
}

function countLinks(links: unknown): number {
  if (!links || typeof links !== "object") return 0;

  return Object.values(links as Record<string, unknown>).filter(
    (value) => typeof value === "string" && value.trim() !== ""
  ).length;
}
