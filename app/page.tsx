import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import QRPreview from "@/components/qr-preview";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  const highlights = [
    {
      title: "One public link",
      description: "Send one clean URL instead of repeating usernames and profile links everywhere.",
    },
    {
      title: "A QR that stays usable",
      description: "Print or share the same QR once, then keep updating the destinations behind it.",
    },
    {
      title: "Photo, name, and socials",
      description: "Present yourself with a profile picture, display name, and only the platforms you want to show.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create your profile",
      description: "Set the display name people should see and upload a profile photo for your public DOXA page.",
    },
    {
      number: "02",
      title: "Add your platforms",
      description: "Drop in handles for TikTok, X, LinkedIn, WhatsApp, Spotify, and more.",
    },
    {
      number: "03",
      title: "Share one card everywhere",
      description: "Use the public link or QR code online, on print, at events, or in your bio.",
    },
  ];

  const useCases = [
    {
      title: "Creators and public figures",
      description: "Share every active profile from one polished page instead of sending people to search for you.",
    },
    {
      title: "Consultants and professionals",
      description: "Turn a QR on your card, desk, or presentation into a clean directory of your key channels.",
    },
    {
      title: "Events, campaigns, and teams",
      description: "Use one destination that can be updated as links, priorities, and campaigns change over time.",
    },
  ];

  const companyPoints = [
    "Built by Doxa Innovations PLC as a practical digital identity tool.",
    "Designed to make online discovery cleaner, faster, and easier to maintain.",
    "Flexible enough for personal brands, businesses, and campaign-focused sharing.",
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-24">
      <header className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-3 font-extrabold text-xl">
          <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
            <Image src="/logo.svg" alt="DOXA" width={28} height={28} />
          </div>
          <div className="flex flex-col leading-none">
            <small className="text-[11px] font-semibold text-secondary tracking-widest uppercase">DOXA</small>
            <span>Social</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-semibold">
          By Doxa Innovations PLC
        </div>
      </header>

      <main className="space-y-16">
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary mb-6">
              Doxa Innovations PLC presents DOXA Social
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight mb-6">
              A real homepage
              <br />
              <span className="accent-text">for your digital presence.</span>
            </h1>

            <p className="text-lg text-muted-on-dark mb-8 max-w-2xl">
              DOXA Social is a shareable social profile and QR experience from Doxa Innovations PLC.
              It gives individuals, brands, and teams one public destination for their most important
              platforms, profile photo, and identity details, so people can find the right links fast
              and you can update them anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/sign-up" className="btn-primary text-center">
                Create Your Page
              </Link>
              <Link
                href="#about"
                className="bg-white/10 hover:bg-white/20 border border-white/20 py-3 px-8 rounded-full font-bold text-center transition-all"
              >
                Learn More
              </Link>
            </div>

            <p className="text-sm text-muted-on-dark/80 mb-8 max-w-xl">
              Built for landing, discovery, and sharing. Use it as the page behind your QR code,
              your bio link, your campaign handoff, or your public social card with a real profile
              picture and branded presence.
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {highlights.map((item) => (
                <div key={item.title} className="glass-card p-4">
                  <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                  <p className="text-sm text-muted-on-dark">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[44px] bg-primary/20 blur-3xl" />
            <div className="relative rounded-[40px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl">
              <div className="grid gap-5">
                <div className="white-card p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-2">
                        Public Profile
                      </p>
                      <h2 className="text-2xl font-extrabold leading-tight">cornelius.d</h2>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-extrabold">
                      C
                    </div>
                  </div>

                  <div className="space-y-3">
                    {["TikTok", "LinkedIn", "WhatsApp"].map((label) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <span className="font-semibold text-accent">{label}</span>
                        <span className="text-slate-400">open</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-[1.05fr_0.95fr] gap-5">
                  <div className="white-card p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-4">
                      Editor
                    </p>
                    <div className="space-y-3">
                      {["x / twitter", "linkedin", "spotify"].map((label) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2">
                            {label}
                          </p>
                          <div className="h-3 rounded-full bg-slate-100" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-secondary mb-4">
                      Live QR
                    </p>
                    <div className="mb-4">
                      <QRPreview value="https://socials.doxaplc.com" size={170} showDownload={false} />
                    </div>
                    <p className="text-sm text-muted-on-dark">
                      Update your destinations without replacing the code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="white-card p-8 md:p-10">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-3">
                About The Product
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-accent mb-4">
                DOXA Social is more than a QR tool.
              </h2>
              <p className="text-base text-muted max-w-xl">
                It works as a proper landing page for your online identity. Instead of leaving people
                to jump across disconnected profiles, it gives them one focused place to understand
                who you are, what you look like, where to find you, and which channels matter most.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {steps.map((step) => (
                <div key={step.number} className="rounded-[28px] border border-[var(--border)] bg-slate-50 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-4">
                    {step.number}
                  </p>
                  <h3 className="text-lg font-extrabold text-accent mb-2">{step.title}</h3>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <div className="glass-card p-8 md:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-secondary mb-3">
              Doxa Innovations PLC
            </p>
            <h2 className="text-3xl font-extrabold mb-4">
              A product shaped around clarity, access, and better digital handoffs.
            </h2>
            <p className="text-muted-on-dark mb-6">
              Doxa Innovations PLC is positioning DOXA Social as a practical tool for modern identity
              sharing: something simple enough to use instantly, but strong enough to support
              professional, brand, and campaign use cases.
            </p>
            <div className="space-y-3">
              {companyPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                  <p className="text-sm text-muted-on-dark">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="white-card p-8 md:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-3">
              Who It Helps
            </p>
            <h2 className="text-3xl font-extrabold text-accent mb-6">
              Useful wherever one smart public page beats many scattered links.
            </h2>
            <div className="grid gap-4">
              {useCases.map((item) => (
                <div key={item.title} className="rounded-[26px] border border-[var(--border)] bg-slate-50 p-5">
                  <h3 className="text-lg font-extrabold text-accent mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-card p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-secondary mb-3">
              Landing And Additional Info
            </p>
            <h2 className="text-3xl font-extrabold mb-3">
              Use the homepage to explain the product, and the profile page to drive action.
            </h2>
            <p className="text-muted-on-dark max-w-2xl">
              DOXA Social can introduce the product as a Doxa Innovations PLC offering while still
              giving each user their own focused public destination for scanning, tapping, and
              connecting.
            </p>
          </div>

          <Link href="/sign-up" className="btn-primary text-center whitespace-nowrap">
            Start Building
          </Link>
        </section>

        <footer className="pt-2 text-center text-sm text-muted-on-dark/75">
          <p>DOXA Social is a product by Doxa Innovations PLC.</p>
        </footer>
      </main>
    </div>
  );
}
