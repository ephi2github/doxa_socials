import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import PlatformIcon from "@/components/platform-icon";
import { PLATFORMS } from "@/lib/platforms";
import Image from "next/image";

export default async function UserPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  
  const userProfile = await db.query.profile.findFirst({
    where: eq(profile.publicId, publicId),
  });

  if (!userProfile) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isOwner = session?.user.id === userProfile.userId;
  const links = (userProfile.links || {}) as Record<string, string>;
  const activePlatforms = PLATFORMS.filter(p => links[p.id]);

  const initials = (userProfile.displayName || "·").match(/\p{L}|\p{N}/u)?.[0]?.toUpperCase() || "·";

  return (
    <div className="max-w-[460px] mx-auto px-6 pt-12 pb-20 relative min-h-screen">
      {isOwner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <Link href="/dashboard" className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-accent transition-all flex items-center gap-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit your card
          </Link>
        </div>
      )}

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-on-dark mb-8">
           <Image src="/logo.svg" alt="" width={16} height={16} />
           DOXA Social
        </div>

        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-primary/40 ring-4 ring-white/10 mb-6">
          {userProfile.photoUrl ? (
            <img src={userProfile.photoUrl} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            initials
          )}
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2">{userProfile.displayName || "My Socials"}</h1>
        <p className="text-sm text-muted-on-dark opacity-60">@{publicId.slice(0, 8)}</p>
      </div>

      <div className="space-y-4">
        {activePlatforms.map(p => {
          const handle = links[p.id];
          const url = p.url(handle);
          return (
            <a 
              key={p.id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlatformIcon id={p.id} size={24} />
              </div>
              <span className="flex-1 font-bold text-accent">{p.name}</span>
              <svg className="text-slate-300 group-hover:translate-x-1 transition-transform" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          );
        })}
        {activePlatforms.length === 0 && (
          <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-3xl text-muted-on-dark italic">
            No links added yet.
          </div>
        )}
      </div>

      <footer className="mt-16 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity">
          Made with 
          <span className="text-white">DOXA Social</span>
          <div className="w-4 h-4 invert opacity-80">
            <Image src="/logo.svg" alt="" width={16} height={16} />
          </div>
        </Link>
      </footer>
    </div>
  );
}
