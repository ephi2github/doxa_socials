"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    // Deliberately identical UI whether or not the address exists — the server endpoint
    // is written to resist account enumeration and the client must not undo that.
    if (error && error.status !== 200) {
      toast.error("Couldn't send the reset link", error.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="white-card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl mb-4 flex items-center justify-center">
            <Image src="/logo.svg" alt="DOXA" width={32} height={32} />
          </div>
          <h1 className="text-2xl font-extrabold">Forgot your password?</h1>
          <p className="text-muted text-sm text-center">
            {sent
              ? "Check your inbox for the next step."
              : "We'll email you a link to set a new one."}
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-[var(--muted)]">
            If an account exists for <strong className="text-[var(--text)]">{email}</strong>, a reset
            link is on its way. The link expires in one hour.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Email</label>
              <input
                type="email"
                required
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary mt-4 disabled:opacity-50">
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-muted">
          Remembered it?{" "}
          <Link href="/sign-in" className="text-primary font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
