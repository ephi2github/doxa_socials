import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile } from "@/lib/schema";
import { getProfileSocialUniqueClickCounts } from "@/lib/social-clicks";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  let userProfile = await db.query.profile.findFirst({
    where: eq(profile.userId, session.user.id),
  });

  // This shouldn't happen because of the better-auth hook, but just in case
  if (!userProfile) {
    redirect("/");
  }

  const clickCountsByPlatform = await getProfileSocialUniqueClickCounts(session.user.id);

  return (
    <DashboardClient 
      initialProfile={userProfile} 
      user={session.user}
      clickCountsByPlatform={clickCountsByPlatform}
    />
  );
}
