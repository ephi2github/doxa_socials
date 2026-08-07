import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getAdminOverview, type DailyPoint } from "@/lib/admin-analytics";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — DOXA Social",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 404 rather than 403 — a non-admin can't even confirm this route exists.
  if (!session || !isAdminEmail(session.user.email)) {
    notFound();
  }

  const overview = await getAdminOverview();

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 text-lg font-extrabold sm:text-xl">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
            <Image src="/logo.svg" alt="DOXA" width={28} height={28} />
          </div>
          <div className="flex flex-col leading-none">
            <small className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
              DOXA Social
            </small>
            <span>Admin analytics</span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
            {session.user.email}
          </span>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition-all hover:bg-white/15"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="space-y-8">
        <section>
          <SectionLabel>Accounts</SectionLabel>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatTile label="Total accounts" value={overview.totalAccounts} />
            <StatTile label="Active users" value={overview.activeUsers30d} hint="Last 30 days" />
            <StatTile label="New accounts" value={overview.newAccounts7d} hint="Last 7 days" />
            <StatTile label="New accounts" value={overview.newAccounts30d} hint="Last 30 days" />
          </div>
        </section>

        <section>
          <SectionLabel>QR codes</SectionLabel>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatTile label="QR codes issued" value={overview.qrIssued} hint="One per account" />
            <StatTile
              label="Profiles with links"
              value={overview.profilesWithLinks}
              hint="At least one handle"
            />
            <StatTile label="QR downloads" value={overview.qrDownloads} />
            <StatTile label="Link copies" value={overview.qrCopies} />
          </div>
        </section>

        <section>
          <SectionLabel>Reads &amp; engagement</SectionLabel>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatTile label="Profile views" value={overview.totalViews} hint="Every scan or visit" />
            <StatTile
              label="Unique visitors"
              value={overview.uniqueVisitors}
              hint="Distinct IP hashes"
            />
            <StatTile
              label="Social link clicks"
              value={overview.socialClicks}
              hint="Unique per visitor"
            />
            <StatTile
              label="Views per profile"
              value={
                overview.qrIssued > 0
                  ? Math.round((overview.totalViews / overview.qrIssued) * 10) / 10
                  : 0
              }
              hint="Average"
            />
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6">
          <SectionLabel>Last 14 days</SectionLabel>
          <ActivityStrip daily={overview.daily} />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass-card overflow-hidden p-5 sm:p-6">
            <SectionLabel>Recent signups</SectionLabel>
            {overview.recentSignups.length === 0 ? (
              <EmptyState>No accounts yet.</EmptyState>
            ) : (
              <ul className="divide-y divide-white/10">
                {overview.recentSignups.map((signup) => (
                  <li key={signup.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{signup.name || "—"}</p>
                      <p className="truncate text-xs text-muted-on-dark opacity-70">{signup.email}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold">{formatDate(signup.createdAt)}</p>
                      <p className="text-[11px] text-muted-on-dark opacity-70">
                        {signup.linkCount} link{signup.linkCount === 1 ? "" : "s"} · {signup.views}{" "}
                        view{signup.views === 1 ? "" : "s"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="glass-card overflow-hidden p-5 sm:p-6">
            <SectionLabel>Top profiles by views</SectionLabel>
            {overview.topProfiles.length === 0 ? (
              <EmptyState>No profile views recorded yet.</EmptyState>
            ) : (
              <ul className="divide-y divide-white/10">
                {overview.topProfiles.map((item, index) => (
                  <li key={item.publicId} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="w-5 shrink-0 text-sm font-extrabold text-secondary">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{item.displayName || "—"}</p>
                        <Link
                          href={`/u/${item.publicId}`}
                          className="truncate text-xs text-muted-on-dark opacity-70 hover:opacity-100"
                        >
                          /u/{item.publicId.slice(0, 8)}
                        </Link>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold">{item.views}</p>
                      <p className="text-[11px] text-muted-on-dark opacity-70">
                        {item.uniqueVisitors} unique
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <p className="pb-4 text-center text-xs text-muted-on-dark opacity-60">
          Visible only to addresses listed in ADMIN_EMAIL. Days are UTC.
        </p>
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-secondary">
      {children}
    </p>
  );
}

function StatTile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="glass-card min-w-0 p-4 sm:p-5">
      <p className="truncate text-[11px] font-bold uppercase tracking-wider text-muted-on-dark opacity-70">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{value.toLocaleString()}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted-on-dark opacity-60">{hint}</p> : null}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 py-8 text-center text-sm italic text-muted-on-dark">
      {children}
    </div>
  );
}

function ActivityStrip({ daily }: { daily: DailyPoint[] }) {
  const peak = Math.max(1, ...daily.map((point) => Math.max(point.views, point.signups)));

  return (
    <div>
      <div className="flex items-end gap-1.5 sm:gap-2">
        {daily.map((point) => (
          <div key={point.day} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div className="flex h-28 w-full items-end justify-center gap-[2px]">
              <Bar
                height={(point.views / peak) * 100}
                className="bg-secondary"
                title={`${point.day}: ${point.views} view${point.views === 1 ? "" : "s"}`}
              />
              <Bar
                height={(point.signups / peak) * 100}
                className="bg-white/70"
                title={`${point.day}: ${point.signups} signup${point.signups === 1 ? "" : "s"}`}
              />
            </div>
            <span className="text-[9px] text-muted-on-dark opacity-50 sm:text-[10px]">
              {point.day.slice(8)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-on-dark">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-secondary" /> Profile views
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-white/70" /> Signups
        </span>
      </div>
    </div>
  );
}

function Bar({ height, className, title }: { height: number; className: string; title: string }) {
  return (
    <div
      title={title}
      className={`w-1/2 rounded-t-sm ${className}`}
      style={{ height: `${Math.max(height, height > 0 ? 4 : 2)}%`, opacity: height > 0 ? 1 : 0.25 }}
    />
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
