"use client";

import { Suspense, useState } from "react";
import { resetPassword } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="white-card w-full max-w-md p-8">{children}</div>
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-12 h-12 bg-accent rounded-xl mb-4 flex items-center justify-center">
        <Image src="/logo.svg" alt="DOXA" width={32} height={32} />
      </div>
      <h1 className="text-2xl font-extrabold text-center">{title}</h1>
      <p className="text-muted text-sm text-center">{subtitle}</p>
    </div>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  // Better Auth's emailed link redirects here with ?error=INVALID_TOKEN when the token
  // has expired or was already used.
  const linkError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  if (!token || linkError) {
    return (
      <>
        <CardHeader
          title="This link has expired"
          subtitle="Reset links are valid for one hour and can only be used once."
        />
        <Link href="/forgot-password" className="btn-primary block w-full text-center">
          Request a new link
        </Link>
        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/sign-in" className="text-primary font-bold">Back to sign in</Link>
        </p>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords don't match", "Re-enter the same password in both fields.");
      return;
    }

    setLoading(true);
    const { error } = await resetPassword({ newPassword: password, token });

    if (error) {
      toast.error("Couldn't reset your password", error.message);
      setLoading(false);
      return;
    }

    toast.success("Password updated", "Sign in with your new password.");
    router.push("/sign-in");
  };

  return (
    <>
      <CardHeader title="Set a new password" subtitle="Choose something you haven't used before." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">New password</label>
          <input
            type="password"
            required
            minLength={8}
            autoFocus
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Confirm password</label>
          <input
            type="password"
            required
            minLength={8}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="w-full btn-primary mt-4 disabled:opacity-50">
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPassword() {
  return (
    <AuthCard>
      <Suspense fallback={<CardHeader title="Set a new password" subtitle="Loading…" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
