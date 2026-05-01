"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
    });
    if (error) {
      toast.error("Sign-up failed", error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="white-card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl mb-4 flex items-center justify-center">
            <Image src="/logo.svg" alt="DOXA" width={32} height={32} />
          </div>
          <h1 className="text-2xl font-extrabold">Create your account</h1>
          <p className="text-muted text-sm">Join DOXA Social today</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Cornelius D."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-4 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
