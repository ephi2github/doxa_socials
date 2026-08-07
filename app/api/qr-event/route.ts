import { randomUUID } from "node:crypto";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { QR_EVENT_KINDS, qrEvent, type QrEventKind } from "@/lib/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isQrEventKind(value: unknown): value is QrEventKind {
  return typeof value === "string" && (QR_EVENT_KINDS as readonly string[]).includes(value);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const kind = (body as { kind?: unknown } | null)?.kind;

  if (!isQrEventKind(kind)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  await db.insert(qrEvent).values({
    id: randomUUID(),
    profileUserId: session.user.id,
    kind,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
