import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import QRPreview from "@/components/qr-preview";
import PlatformIcon from "@/components/platform-icon";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const previewLinks = [
    { id: "ig", label: "Instagram" },
    { id: "tt", label: "TikTok" },
    { id: "li", label: "LinkedIn" },
    { id: "sp", label: "Spotify" },
    { id: "wa", label: "WhatsApp" },
  ];

  const platformStrip = ["ig", "tt", "yt", "tw", "li", "sp", "wa", "tg", "tv", "fb", "th", "pi"];

  const steps = [
    {
      n: "1",
      title: "Sign up",
      copy: "Make a free account in seconds.",
    },
    {
      n: "2",
      title: "Add your links",
      copy: "Pick the platforms you actually use.",
    },
    {
      n: "3",
      title: "Share one QR",
      copy: "Print it, post it, tape it on anything.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
      <header className="flex items-center justify-between mb-14">
        <div className="flex items-center gap-3 font-extrabold text-xl">
          <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
            <Image src="/logo.svg" alt="DOXA" width={28} height={28} />
          </div>
          <div className="flex flex-col leading-none">
            <small className="text-[11px] font-semibold text-secondary tracking-widest uppercase">DOXA</small>
            <span>Social</span>
          </div>
        </div>
        {session ? (
          <Link
            href="/dashboard"
            className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit your card
          </Link>
        ) : (
          <Link
            href="/sign-in"
            className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          >
            Sign in
          </Link>
        )}
      </header>

      <main className="space-y-24">
        <section className="grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5">
              All your links.
              <br />
              <span className="accent-text">One scan.</span>
            </h1>

            <p className="text-lg text-muted-on-dark mb-8 max-w-md">
              A single QR for every place you exist online. Change what&apos;s behind it whenever you want.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sign-up" className="btn-primary text-center">
                Create your page
              </Link>
              <Link
                href="#how"
                className="bg-white/5 hover:bg-white/10 border border-white/15 py-3 px-6 rounded-full font-semibold text-center transition-all"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[340px]">
            <div className="absolute -inset-10 rounded-[60px] bg-primary/25 blur-3xl" />
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-secondary/30 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary/30 blur-3xl" />

            <div className="relative rounded-[40px] border border-white/15 bg-gradient-to-b from-white/15 to-white/5 p-4 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(120,81,169,0.6)]">
              <div className="rounded-[28px] bg-gradient-to-b from-[#1f0747] to-[#2e0d5e] p-6 text-center">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-on-dark mb-6">
                  <Image src="/logo.svg" alt="" width={14} height={14} />
                  DOXA Socials
                </div>

                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-primary/50 ring-4 ring-white/10 mb-4">
                  A
                </div>

                <h3 className="text-xl font-extrabold mb-6">Alex Carter</h3>

                <div className="space-y-2.5 text-left">
                  {previewLinks.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-3 bg-white/95 px-3.5 py-2.5 rounded-xl shadow-lg"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <PlatformIcon id={l.id} size={18} />
                      </div>
                      <span className="text-sm font-bold text-accent">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-secondary mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Three steps. That&apos;s it.</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="absolute -top-6 -left-2 text-[120px] font-extrabold text-white/5 leading-none select-none">
                  {s.n}
                </div>
                <div className="relative">
                  <h3 className="text-xl font-extrabold mb-2">{s.title}</h3>
                  <p className="text-muted-on-dark">{s.copy}</p>
                </div>
              </div>
            ))}
          </div>

          {!session && (
            <div className="flex justify-center pt-2">
              <Link
                href="/sign-up"
                className="bg-white text-black hover:bg-white/90 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
        </section>

        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-secondary mb-3">
              Works with everything
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              90+ platforms, one card.
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
            {platformStrip.map((id) => (
              <div
                key={id}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <PlatformIcon id={id} size={26} />
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-[1fr_auto] gap-8 items-center bg-gradient-to-r from-white/5 to-white/0 border border-white/10 rounded-[40px] p-8 md:p-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Your QR never changes.
            </h2>
            <p className="text-muted-on-dark mb-6 max-w-md">
              Update your links, photo, and name anytime. Same scan, fresh page.
            </p>
            <Link href="/sign-up" className="btn-primary inline-block">
              Get started — it&apos;s free
            </Link>
          </div>
          <div className="hidden md:block">
            <QRPreview value="https://socials.doxaplc.com" size={160} showDownload={false} />
          </div>
        </section>

        <footer className="pt-4 text-center">
          <Link
            href="https://doxaplc.com"
            className="inline-flex items-center gap-2 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity"
          >
            Made by
            <span className="text-white">DOXA Innovations</span>
            <Image src="/logo.svg" alt="" width={16} height={16} className="opacity-80" />
          </Link>
        </footer>
      </main>
    </div>
  );
}
