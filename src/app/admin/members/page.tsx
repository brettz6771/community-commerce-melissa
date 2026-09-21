"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { KeyRound, Loader2, Mail, Search, Users } from "lucide-react";

const STORAGE_KEY = "ccm-internal-api-secret";

function authHeaders(secret: string): HeadersInit {
  return secret ? { Authorization: `Bearer ${secret}` } : {};
}

type AdminMember = {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  memberId: string;
  isActive: boolean;
  hasPassword: boolean;
  createdAt: string;
};

export default function AdminMembersPage() {
  const [secretInput, setSecretInput] = useState("");
  const [activeSecret, setActiveSecret] = useState("");
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [query, setQuery] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteBusiness, setInviteBusiness] = useState("");
  const [inviteOwner, setInviteOwner] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);

  const loadMembers = async (nextSecret: string) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/member-portal/members", {
        headers: authHeaders(nextSecret),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setUnlocked(false);
        setMembers([]);
        setErrorMessage(nextSecret ? "That password is incorrect." : "An admin password is required.");
        return false;
      }
      if (res.status === 503) {
        setUnlocked(true);
        setActiveSecret(nextSecret);
        setMembers([]);
        setErrorMessage(data?.error || "Member storage is not configured.");
        return true;
      }
      if (!res.ok) throw new Error(data?.error || "Could not load members.");
      setUnlocked(true);
      setActiveSecret(nextSecret);
      setMembers(Array.isArray(data.members) ? data.members : []);
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load members.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextSecret = secretInput.trim() || window.sessionStorage.getItem(STORAGE_KEY) || "";
    const ok = await loadMembers(nextSecret);
    if (ok) window.sessionStorage.setItem(STORAGE_KEY, nextSecret);
  };

  const sendInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setInviteBusy(true);
    setInviteMessage("");
    setInviteUrl("");
    try {
      const res = await fetch("/api/member-portal/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(activeSecret) },
        body: JSON.stringify({
          email: inviteEmail,
          businessName: inviteBusiness,
          ownerName: inviteOwner,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setInviteMessage(data.error || "Could not send invite.");
        return;
      }
      setInviteMessage(data.message || "Invite sent.");
      if (data.inviteUrl) setInviteUrl(data.inviteUrl);
      setInviteEmail("");
      setInviteBusiness("");
      setInviteOwner("");
      await loadMembers(activeSecret);
    } catch {
      setInviteMessage("Could not send invite.");
    } finally {
      setInviteBusy(false);
    }
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return members;
    return members.filter((row) =>
      [row.email, row.businessName, row.ownerName, row.memberId].join(" ").toLowerCase().includes(needle)
    );
  }, [members, query]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-outfit font-extrabold text-sm uppercase tracking-wider">Member invites</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">Portal accounts</p>
          </div>
          <div className="flex gap-4 text-xs">
            <Link href="/admin/newsletter" className="text-slate-300 hover:text-white">Newsletter</Link>
            <Link href="/" className="text-slate-300 hover:text-white">Back to site</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {!unlocked ? (
          <form onSubmit={unlock} className="max-w-md bg-[#151922] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 font-bold text-[10px] uppercase tracking-widest">
              <KeyRound className="w-3.5 h-3.5" />
              Staff only
            </div>
            <h1 className="text-2xl font-extrabold font-outfit uppercase">Invite existing members</h1>
            <p className="text-sm text-slate-400">
              Enter <code className="text-slate-200">INTERNAL_API_SECRET</code>. This page is not in the public nav.
            </p>
            <input
              type="password"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              className="w-full bg-[#0B0E14] border border-slate-700 rounded-lg px-3 py-2.5 text-sm"
              placeholder="INTERNAL_API_SECRET"
            />
            {errorMessage && <p className="text-xs text-red-200">{errorMessage}</p>}
            <button type="submit" disabled={isLoading} className="btn-red w-full py-3 rounded-lg text-xs font-bold uppercase">
              {isLoading ? "Checking…" : "Unlock"}
            </button>
          </form>
        ) : (
          <>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 text-slate-200 font-bold text-[10px] uppercase tracking-widest mb-2">
                <Users className="w-3.5 h-3.5" />
                {members.length} members
              </div>
              <h1 className="text-3xl font-extrabold font-outfit uppercase">Invite members to set a password</h1>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                Existing members can create a portal account. The badge links automatically to that email once they accept.
              </p>
            </div>

            <form onSubmit={sendInvite} className="bg-[#151922] border border-white/10 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <label className="block space-y-1 md:col-span-1">
                <span className="text-[11px] uppercase text-slate-400 font-bold">Member email *</span>
                <input className="w-full bg-[#0B0E14] border border-slate-700 rounded-lg px-3 py-2 text-sm" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required type="email" />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] uppercase text-slate-400 font-bold">Business name</span>
                <input className="w-full bg-[#0B0E14] border border-slate-700 rounded-lg px-3 py-2 text-sm" value={inviteBusiness} onChange={(e) => setInviteBusiness(e.target.value)} placeholder="If not already in the directory" />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] uppercase text-slate-400 font-bold">Contact name</span>
                <input className="w-full bg-[#0B0E14] border border-slate-700 rounded-lg px-3 py-2 text-sm" value={inviteOwner} onChange={(e) => setInviteOwner(e.target.value)} />
              </label>
              <button type="submit" disabled={inviteBusy} className="btn-red py-2.5 rounded-lg text-xs font-bold uppercase inline-flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {inviteBusy ? "Sending…" : "Send invite"}
              </button>
              {inviteMessage && <p className="md:col-span-4 text-sm text-emerald-300">{inviteMessage}</p>}
              {inviteUrl && (
                <p className="md:col-span-4 text-xs text-slate-300">
                  Dev invite link: <Link href={inviteUrl} className="text-red-300 underline break-all">{inviteUrl}</Link>
                </p>
              )}
            </form>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members"
                className="w-full bg-[#151922] border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-sm"
              />
            </div>

            {errorMessage && <p className="text-sm text-amber-200">{errorMessage}</p>}

            <div className="overflow-x-auto border border-white/10 rounded-2xl bg-[#151922]">
              <table className="w-full text-left text-sm min-w-[720px]">
                <thead className="text-[11px] uppercase tracking-widest text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3">Business</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Member ID</th>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                        Loading…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-400">No members match this view.</td>
                    </tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.id} className="border-t border-white/5">
                        <td className="px-4 py-3">
                          <div className="font-medium">{row.businessName}</div>
                          <div className="text-xs text-slate-400">{row.ownerName || "—"}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-200">{row.email || "—"}</td>
                        <td className="px-4 py-3 font-mono text-xs">{row.memberId || "—"}</td>
                        <td className="px-4 py-3 text-xs">
                          {row.hasPassword ? "Password set" : "Invite to create account"}
                          {!row.isActive ? " · inactive" : ""}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {row.email && (
                            <button
                              type="button"
                              className="text-xs font-bold uppercase text-red-300 hover:text-white"
                              onClick={() => {
                                setInviteEmail(row.email);
                                setInviteBusiness(row.businessName);
                                setInviteOwner(row.ownerName);
                              }}
                            >
                              Invite
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
