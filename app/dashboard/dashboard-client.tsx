"use client";

import { useState } from "react";
import { PLATFORMS } from "@/lib/platforms";
import PlatformIcon from "@/components/platform-icon";
import QRPreview from "@/components/qr-preview";
import Image from "next/image";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardClient({ initialProfile, user }: { initialProfile: any, user: any }) {
  const [displayName, setDisplayName] = useState(initialProfile.displayName || user.name || "");
  const [links, setLinks] = useState<Record<string, string>>(initialProfile.links || {});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const activePlatforms = PLATFORMS.filter(p => links[p.id] !== undefined);
  const availablePlatforms = PLATFORMS.filter(p => 
    links[p.id] === undefined && 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const togglePlatform = (id: string) => {
    setLinks(prev => {
      const next = { ...prev };
      if (next[id] !== undefined) {
        delete next[id];
      } else {
        next[id] = "";
      }
      return next;
    });
  };

  const updateHandle = (id: string, value: string) => {
    setLinks(prev => ({ ...prev, [id]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, links }),
      });
      if (res.ok) {
        alert("Profile updated!");
      }
    } catch (err) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = `${window.location.origin}/u/${initialProfile.publicId}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 font-extrabold text-xl">
          <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
            <Image src="/logo.svg" alt="DOXA" width={28} height={28} />
          </div>
          <div className="flex flex-col leading-none">
            <small className="text-[11px] font-semibold text-secondary tracking-widest uppercase">DOXA</small>
            <span>Social</span>
          </div>
        </div>
        <button 
          onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}
          className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity"
        >
          Sign Out
        </button>
      </header>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="space-y-8">
          <section className="white-card p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Profile Info</h2>
            <div>
              <label className="block text-sm font-bold text-muted mb-2">Display Name</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="How you want to be seen"
              />
            </div>
          </section>

          <section className="white-card p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Your Socials</h2>
            
            <div className="space-y-4 mb-8">
              {activePlatforms.map(p => (
                <div
                  key={p.id}
                  className="group rounded-[24px] border border-[var(--border)] bg-gradient-to-br from-slate-50 via-white to-slate-50/80 p-4 shadow-[0_12px_32px_rgba(25,0,58,0.05)] transition-all hover:border-primary/20 hover:shadow-[0_18px_40px_rgba(25,0,58,0.08)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white bg-white shadow-sm shadow-primary/5">
                      <PlatformIcon id={p.id} size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                          {p.name}
                        </label>

                        <button
                          onClick={() => togglePlatform(p.id)}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-300 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${p.name}`}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
                        <input
                          type="text"
                          className="w-full border-none bg-transparent p-0 text-sm font-semibold text-accent placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0"
                          value={links[p.id]}
                          onChange={e => updateHandle(p.id, e.target.value)}
                          placeholder={p.ph}
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {activePlatforms.length === 0 && (
                <div className="text-center py-10 text-muted italic">No platforms added yet. Pick some below!</div>
              )}
            </div>

            <div className="border-t pt-8">
              <div className="relative mb-6">
                <input 
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Search platforms..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <svg className="absolute left-3 top-2.5 text-slate-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <div className="flex flex-wrap gap-2">
                {availablePlatforms.slice(0, 15).map(p => (
                  <button 
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-white hover:shadow-md border border-slate-100 rounded-xl px-3 py-2 transition-all group"
                  >
                    <PlatformIcon id={p.id} size={16} className="opacity-60 group-hover:opacity-100" />
                    <span className="text-sm font-semibold text-muted group-hover:text-accent">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <button 
            onClick={save}
            disabled={saving}
            className="w-full btn-primary disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>

        <aside className="sticky top-10 space-y-6">
          <div className="glass-card p-6 text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-60">Your Live QR Code</h2>
            <QRPreview value={publicUrl} />
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary mb-2">Public Link</p>
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                <code className="text-[10px] truncate opacity-80">{publicUrl}</code>
                <button 
                  onClick={() => { navigator.clipboard.writeText(publicUrl); alert('Copied!'); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
              </div>
            </div>
          </div>

          <a 
            href={`/u/${initialProfile.publicId}`} 
            target="_blank"
            className="block w-full bg-white text-accent font-bold py-3 px-6 rounded-full text-center hover:bg-secondary hover:text-white transition-all shadow-xl"
          >
            View Public Page
          </a>
        </aside>
      </div>
    </div>
  );
}
