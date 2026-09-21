"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Download, KeyRound, Loader2, Ticket } from "lucide-react";
import { toCsv } from "@/lib/csv";
import {
  EVENT_REGISTRATION_CSV_HEADERS,
  eventRegistrationCsvRows,
  type EventRegistrationRecord,
} from "@/lib/site-events";

const STORAGE_KEY = "ccm-internal-api-secret";

function authHeaders(secret: string): HeadersInit {
  return secret ? { Authorization: `Bearer ${secret}` } : {};
}

type CatalogEvent = { id: string; title: string; date: string };

export default function AdminEventsPage() {
  const [secretInput, setSecretInput] = useState("");
  const [activeSecret, setActiveSecret] = useState("");
  const [events, setEvents] = useState<CatalogEvent[]>([]);
  const [eventId, setEventId] = useState("");
  const [rows, setRows] = useState<EventRegistrationRecord[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRows = async (nextSecret: string, nextEventId: string) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const query = nextEventId ? `?eventId=${encodeURIComponent(nextEventId)}` : "";
      const res = await fetch(`/api/events/registrations${query}`, {
        headers: authHeaders(nextSecret),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setUnlocked(false);
        setRows([]);
        setErrorMessage(nextSecret ? "That password is incorrect." : "An admin password is required.");
        return false;
      }
      if (!res.ok) throw new Error(data?.error || "Could not load registrations.");
      setUnlocked(true);
      setActiveSecret(nextSecret);
      setEvents(Array.isArray(data.events) ? data.events : []);
      setRows(Array.isArray(data.registrations) ? data.registrations : []);
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load registrations.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextSecret = secretInput.trim() || window.sessionStorage.getItem(STORAGE_KEY) || "";
    const ok = await loadRows(nextSecret, eventId);
    if (ok) window.sessionStorage.setItem(STORAGE_KEY, nextSecret);
  };

  const downloadCsv = () => {
    const csv = toCsv(EVENT_REGISTRATION_CSV_HEADERS, eventRegistrationCsvRows(rows));
    const blob = new Blob([csv], { type: "text/csv; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventId || "all-events"}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const counts = useMemo(() => {
    return {
      total: rows.length,
      paid: rows.filter((row) => row.paymentStatus === "paid").length,
      interest: rows.filter((row) => row.kind === "business_interest").length,
    };
  }, [rows]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-outfit font-extrabold text-sm uppercase tracking-wider">Event signups</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">Who is going</p>
          </div>
          <div className="flex gap-4 text-xs">
            <Link href="/admin/members" className="text-slate-300 hover:text-white">Members</Link>
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
            <h1 className="text-2xl font-extrabold font-outfit uppercase">Export event registrations</h1>
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 text-slate-200 font-bold text-[10px] uppercase tracking-widest mb-2">
                  <Ticket className="w-3.5 h-3.5" />
                  {counts.total} signups
                </div>
                <h1 className="text-3xl font-extrabold font-outfit uppercase">Who is going</h1>
                <p className="text-sm text-slate-400 mt-2">Free, paid, member, guest, and tent interest forms are all stored here.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={eventId}
                  onChange={(e) => {
                    const next = e.target.value;
                    setEventId(next);
                    void loadRows(activeSecret, next);
                  }}
                  className="bg-[#151922] border border-slate-700 rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="">All events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={downloadCsv} className="btn-red px-4 py-2.5 rounded-lg text-xs font-bold uppercase inline-flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {errorMessage && <p className="text-sm text-amber-200">{errorMessage}</p>}

            <div className="overflow-x-auto border border-white/10 rounded-2xl bg-[#151922]">
              <table className="w-full text-left text-sm min-w-[880px]">
                <thead className="text-[11px] uppercase tracking-widest text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Party</th>
                    <th className="px-4 py-3">Kind</th>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                        Loading…
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-400">No signups yet for this view.</td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={`${row.eventId}-${row.id}-${row.email}`} className="border-t border-white/5">
                        <td className="px-4 py-3">{row.eventTitle}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{row.name || "—"}</div>
                          <div className="text-xs text-slate-400">{row.phone || row.company || "—"}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-200">{row.email}</td>
                        <td className="px-4 py-3 text-xs">
                          <div>{row.guests} including registrant</div>
                          {row.additionalGuests?.length ? (
                            <div className="text-slate-400 mt-1 space-y-0.5">
                              {row.additionalGuests.map((guest) => (
                                <div key={`${row.id}-${guest.email}`}>{guest.name}</div>
                              ))}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-xs">{row.kind === "business_interest" ? "Business interest" : "Attendance"}</td>
                        <td className="px-4 py-3 text-xs">{row.membershipStatus === "member" ? "Member" : "Non-member"}</td>
                        <td className="px-4 py-3 text-xs">
                          {row.paymentStatus}
                          {row.pricing === "paid" ? ` · $${(row.amountCents / 100).toFixed(2)}` : ""}
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
