import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
      <header className="flex items-center justify-between mb-20">
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
          No database · No accounts
        </div>
      </header>

      <main className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            One scan. <br />
            <span className="accent-text">All your links.</span>
          </h1>
          <p className="text-lg text-muted-on-dark mb-10 max-w-lg">
            Pick the platforms you use, type your handles, and share the QR. 
            Everything lives in a permanent URL — edit your links anytime without 
            changing your QR code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sign-up" className="btn-primary text-center">
              Create your QR Card
            </Link>
            <Link href="/sign-in" className="bg-white/10 hover:bg-white/20 border border-white/20 py-3 px-8 rounded-full font-bold text-center transition-all">
              Sign In
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl overflow-hidden group">
             <div className="bg-white p-6 rounded-3xl shadow-inner mb-6 aspect-square flex items-center justify-center">
                {/* Mock QR */}
                <div className="w-full h-full bg-slate-100 rounded-xl animate-pulse" />
             </div>
             <div className="space-y-3">
               <div className="h-4 bg-white/20 rounded-full w-3/4" />
               <div className="h-4 bg-white/10 rounded-full w-1/2" />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
