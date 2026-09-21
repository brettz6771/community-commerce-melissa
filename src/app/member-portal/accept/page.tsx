"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <AcceptInviteClient />
    </Suspense>
  );
}

function AcceptInviteClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/member-portal/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not create the account.");
        return;
      }
      router.replace("/member-portal");
    } catch {
      setError("Could not create the account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="Create portal account — Community Commerce Melissa" />
      <Navbar />
      <main className="flex-1 py-12">
        <form onSubmit={submit} className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-700">
            <KeyRound className="w-4 h-4" />
            Member invite
          </div>
          <h1 className="font-outfit font-extrabold text-2xl text-slate-900 uppercase">Set a password</h1>
          <p className="text-sm text-slate-600">
            This creates your portal account. Your official badge is already linked to the membership email on this invite.
          </p>
          {!token && <p className="text-sm text-red-700">This invite link is missing a token. Ask staff to send a new invite.</p>}
          <label className="block space-y-1">
            <span className="block text-xs font-bold text-slate-600 uppercase">Password *</span>
            <input
              type="password"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={10}
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="block text-xs font-bold text-slate-600 uppercase">Confirm password *</span>
            <input
              type="password"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={10}
              required
            />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy || !token} className="btn-red px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50">
            {busy ? "Creating account…" : "Create account and open portal"}
          </button>
          <p className="text-xs text-slate-500">
            Already have a password? <Link href="/member-portal" className="text-red-700 font-bold">Sign in</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
