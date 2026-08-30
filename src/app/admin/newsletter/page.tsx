"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  KeyRound,
  Loader2,
  Mail,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";
import { toCsv } from "@/lib/csv";
import { NEWSLETTER_CSV_HEADERS, newsletterSubscriberCsvRows, type NewsletterSubscriber } from "@/lib/newsletter";

const STORAGE_KEY = "ccm-internal-api-secret";

function authHeaders(secret: string): HeadersInit {
  return secret ? { Authorization: `Bearer ${secret}` } : {};
}

export default function NewsletterAdminPage() {
  const [secretInput, setSecretInput] = useState("");
  const [activeSecret, setActiveSecret] = useState("");
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy emails");

  const loadSubscribers = async (nextSecret: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/export-newsletter?format=json", {
        headers: authHeaders(nextSecret),
        cache: "no-store",
      });

      if (res.status === 401) {
        setUnlocked(false);
        setSubscribers([]);
        setErrorMessage(nextSecret ? "That export password is incorrect." : "An export password is required.");
        return false;
      }

      const data = await res.json().catch(() => ({}));

      if (res.status === 503) {
        setUnlocked(true);
        setActiveSecret(nextSecret);
        setSubscribers([]);
        setErrorMessage(
          data?.error ||
            "Postgres is not connected. Set DATABASE_URL in Railway so newsletter signups can be exported. Until then, each signup is still emailed to info@communitycommercemelissa.org."
        );
        return true;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Could not load newsletter subscribers.");
      }

      setUnlocked(true);
      setActiveSecret(nextSecret);
      setSubscribers(Array.isArray(data.subscribers) ? data.subscribers : []);
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load newsletter subscribers.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextSecret = secretInput.trim() || window.sessionStorage.getItem(STORAGE_KEY) || "";
    const ok = await loadSubscribers(nextSecret);
    if (ok) {
      window.sessionStorage.setItem(STORAGE_KEY, nextSecret);
    }
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return subscribers;
    return subscribers.filter((row) =>
      [row.firstName, row.lastName, row.email, row.company, row.source]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [query, subscribers]);

  const downloadCsv = () => {
    const csv = toCsv(NEWSLETTER_CSV_HEADERS, newsletterSubscriberCsvRows(filtered));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `newsletter-subscribers-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const copyEmails = async () => {
    const emails = filtered.map((row) => row.email).join("\n");
    await navigator.clipboard.writeText(emails);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy emails"), 1600);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-outfit font-extrabold text-sm uppercase tracking-wider">Newsletter Subscribers</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">Admin export</p>
          </div>
          <Link href="/" className="text-xs text-slate-300 hover:text-white transition">
            Back to site
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {!unlocked ? (
          <form onSubmit={unlock} className="max-w-md bg-[#151922] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 font-bold text-[10px] uppercase tracking-widest">
              <KeyRound className="w-3.5 h-3.5" />
              Protected export
            </div>
            <h1 className="text-2xl font-extrabold font-outfit uppercase tracking-tight">
              Unlock subscriber list
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enter the <code className="text-slate-200">INTERNAL_API_SECRET</code> from Railway. This page is not linked from the public site. Local development can leave this blank if that secret is unset.
            </p>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Export password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              className="w-full bg-[#0B0E14] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              placeholder="INTERNAL_API_SECRET"
            />
            {errorMessage && (
              <div className="bg-red-950/80 border border-red-500/50 rounded-lg p-3 text-xs text-red-200">
                {errorMessage}
              </div>
            )}
            <button type="submit" disabled={isLoading} className="btn-red w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock list"}
            </button>
          </form>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-[10px] uppercase tracking-widest mb-2">
                  <Users className="w-3.5 h-3.5" />
                  {subscribers.length} unique subscriber{subscribers.length === 1 ? "" : "s"}
                </div>
                <h1 className="text-3xl font-extrabold font-outfit uppercase tracking-tight">
                  Community newsletter
                </h1>
                <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                  Names, emails, and company names from the homepage and footer newsletter forms. Duplicate emails are combined, keeping the newest signup.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void loadSubscribers(activeSecret)}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/15 text-slate-200 hover:bg-white/5 disabled:opacity-40"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={copyEmails}
                  disabled={filtered.length === 0}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/15 text-slate-200 hover:bg-white/5 disabled:opacity-40 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {copyLabel}
                </button>
                <button
                  type="button"
                  onClick={downloadCsv}
                  disabled={filtered.length === 0}
                  className="btn-red px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, or company"
                className="w-full bg-[#151922] border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {errorMessage && (
              <div className="bg-amber-950/50 border border-amber-500/40 rounded-lg p-4 text-sm text-amber-100 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="overflow-x-auto border border-white/10 rounded-2xl bg-[#151922]">
              <table className="w-full text-left text-sm min-w-[720px]">
                <thead className="text-[11px] uppercase tracking-widest text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 font-bold">Name</th>
                    <th className="px-4 py-3 font-bold">Email</th>
                    <th className="px-4 py-3 font-bold">Company</th>
                    <th className="px-4 py-3 font-bold">Source</th>
                    <th className="px-4 py-3 font-bold">Signed up</th>
                    <th className="px-4 py-3 font-bold">Signups</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                        Loading subscribers…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        No newsletter subscribers match this view yet.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.email} className="border-t border-white/5">
                        <td className="px-4 py-3 font-medium">
                          {[row.firstName, row.lastName].filter(Boolean).join(" ") || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-200">{row.email}</td>
                        <td className="px-4 py-3 text-slate-300">{row.company || "—"}</td>
                        <td className="px-4 py-3 text-slate-400">{row.source || "—"}</td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{row.signedUpAt || "—"}</td>
                        <td className="px-4 py-3 text-slate-400">{row.signupCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500">
              You can also download CSV with{" "}
              <code className="text-slate-300">
                curl -H &quot;Authorization: Bearer $INTERNAL_API_SECRET&quot; https://communitycommercemelissa.org/api/export-newsletter -o newsletter-subscribers.csv
              </code>
            </p>
          </>
        )}
      </main>
    </div>
  );
}
