"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Eye,
  ExternalLink,
  Filter,
  History,
  Info,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Ticket,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { toCsv } from "@/lib/csv";
import {
  EVENT_CHECKIN_ROSTER_CSV_HEADERS,
  EVENT_REGISTRATION_CSV_HEADERS,
  calculateEventRegistrationGuests,
  calculateEventRegistrationsSummary,
  eventCheckinRosterCsvRows,
  eventRegistrationCsvRows,
  type EventRegistrationRecord,
} from "@/lib/site-events";

const STORAGE_KEY = "ccm-internal-api-secret";

type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  date: string;
  dateLabel: string;
  time: string;
  location: string;
  address?: string;
  category: string;
  isPast: boolean;
  href?: string;
};

type ViewMode = "upcoming" | "past" | "all";

export default function AdminPage() {
  const [secretInput, setSecretInput] = useState("");
  const [activeSecret, setActiveSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Data state
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistrationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<ViewMode>("upcoming");
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKind, setFilterKind] = useState<string>("all");
  const [activeModalRecord, setActiveModalRecord] = useState<EventRegistrationRecord | null>(null);

  // Fetch registrations and events
  const loadData = useCallback(
    async (secret: string, isSilent = false) => {
      if (!isSilent) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMessage("");

      try {
        const headers: HeadersInit = secret ? { Authorization: `Bearer ${secret}` } : {};
        const res = await fetch("/api/events/registrations", {
          headers,
          cache: "no-store",
        });

        if (res.status === 401) {
          setUnlocked(false);
          setActiveSecret("");
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(STORAGE_KEY);
          }
          setErrorMessage(secret ? "That admin password is incorrect." : "Please enter the admin password.");
          return false;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || "Failed to load event data.");
        }

        const data = await res.json();
        setUnlocked(true);
        setActiveSecret(secret);
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(STORAGE_KEY, secret);
        }

        if (Array.isArray(data.events)) {
          setEvents(data.events);
        }
        if (Array.isArray(data.registrations)) {
          setRegistrations(data.registrations);
        }

        setLastRefreshedAt(new Date());
        return true;
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Error connecting to server.");
        return false;
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsCheckingAuth(false);
      }
    },
    []
  );

  // Check initial auth on mount
  useEffect(() => {
    let savedSecret = "";
    if (typeof window !== "undefined") {
      savedSecret = window.sessionStorage.getItem(STORAGE_KEY) || "";
    }
    void loadData(savedSecret);
  }, [loadData]);

  // Auto-refresh interval (every 15 seconds when active)
  useEffect(() => {
    if (!unlocked || !autoRefresh) return;
    const interval = setInterval(() => {
      void loadData(activeSecret, true);
    }, 15000);
    return () => clearInterval(interval);
  }, [unlocked, autoRefresh, activeSecret, loadData]);

  // Handle Login Form
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const secret = secretInput.trim();
    // Also hit auth API to set cookie
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
    } catch {
      // Ignore if fails, loadData will catch
    }
    await loadData(secret);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // Ignore
    }
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    setUnlocked(false);
    setActiveSecret("");
    setRegistrations([]);
    setEvents([]);
  };

  // Categorize events into upcoming and past
  const upcomingEvents = useMemo(() => {
    return events.filter((evt) => !evt.isPast);
  }, [events]);

  const pastEvents = useMemo(() => {
    return events.filter((evt) => evt.isPast);
  }, [events]);

  // Group registrations by eventId for fast lookup & stats
  const eventStatsMap = useMemo(() => {
    const map = new Map<
      string,
      {
        event: AdminEvent | undefined;
        registrations: EventRegistrationRecord[];
        summary: ReturnType<typeof calculateEventRegistrationsSummary>;
      }
    >();

    // Initialize map with all events
    for (const event of events) {
      map.set(event.id, {
        event,
        registrations: [],
        summary: calculateEventRegistrationsSummary([]),
      });
    }

    // Populate with actual registrations
    for (const reg of registrations) {
      const existing = map.get(reg.eventId);
      if (existing) {
        existing.registrations.push(reg);
      } else {
        // Unknown eventId present in records
        map.set(reg.eventId, {
          event: undefined,
          registrations: [reg],
          summary: calculateEventRegistrationsSummary([]),
        });
      }
    }

    // Compute summaries
    for (const entry of map.values()) {
      entry.summary = calculateEventRegistrationsSummary(entry.registrations);
    }

    return map;
  }, [events, registrations]);

  // Filtered registrations for the interactive guest list
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // 1. Event filter
      if (selectedEventId !== "all" && reg.eventId !== selectedEventId) {
        return false;
      }

      // If viewing Upcoming tab, only show upcoming events registrations (unless specific event chosen)
      if (selectedEventId === "all") {
        const ev = events.find((e) => e.id === reg.eventId);
        if (activeTab === "upcoming" && ev?.isPast) return false;
        if (activeTab === "past" && ev && !ev.isPast) return false;
      }

      // 2. Kind/Status filter
      if (filterKind === "members" && reg.membershipStatus !== "member") return false;
      if (filterKind === "guests" && reg.membershipStatus === "member") return false;
      if (filterKind === "paid" && reg.paymentStatus !== "paid") return false;
      if (filterKind === "complimentary" && reg.paymentStatus !== "complimentary") return false;
      if (filterKind === "interest" && reg.kind !== "business_interest") return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const primaryMatch =
          reg.name?.toLowerCase().includes(q) ||
          reg.email?.toLowerCase().includes(q) ||
          reg.phone?.toLowerCase().includes(q) ||
          reg.company?.toLowerCase().includes(q) ||
          reg.eventTitle?.toLowerCase().includes(q) ||
          reg.notes?.toLowerCase().includes(q);

        const companionMatch = reg.additionalGuests?.some(
          (g) =>
            g.name?.toLowerCase().includes(q) ||
            g.email?.toLowerCase().includes(q) ||
            g.phone?.toLowerCase().includes(q)
        );

        if (!primaryMatch && !companionMatch) return false;
      }

      return true;
    });
  }, [registrations, selectedEventId, activeTab, events, filterKind, searchQuery]);

  // Overall stats based on current view tab
  const overallSummary = useMemo(() => {
    if (activeTab === "upcoming") {
      const upcomingRegs = registrations.filter((r) => {
        const ev = events.find((e) => e.id === r.eventId);
        return ev && !ev.isPast;
      });
      return calculateEventRegistrationsSummary(upcomingRegs);
    }
    if (activeTab === "past") {
      const pastRegs = registrations.filter((r) => {
        const ev = events.find((e) => e.id === r.eventId);
        return ev ? ev.isPast : true;
      });
      return calculateEventRegistrationsSummary(pastRegs);
    }
    return calculateEventRegistrationsSummary(registrations);
  }, [activeTab, registrations, events]);

  // Download Party-level CSV
  const handleDownloadPartyCsv = (eventId?: string, eventTitle?: string) => {
    const list = eventId
      ? registrations.filter((r) => r.eventId === eventId)
      : filteredRegistrations;
    const csv = toCsv(EVENT_REGISTRATION_CSV_HEADERS, eventRegistrationCsvRows(list));
    const blob = new Blob([csv], { type: "text/csv; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = eventId || (selectedEventId !== "all" ? selectedEventId : activeTab);
    a.download = `${slug}-registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Check-in Roster CSV (Individual attendees)
  const handleDownloadRosterCsv = (eventId?: string, eventTitle?: string) => {
    const list = eventId
      ? registrations.filter((r) => r.eventId === eventId)
      : filteredRegistrations;
    const csv = toCsv(EVENT_CHECKIN_ROSTER_CSV_HEADERS, eventCheckinRosterCsvRows(list));
    const blob = new Blob([csv], { type: "text/csv; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = eventId || (selectedEventId !== "all" ? selectedEventId : activeTab);
    a.download = `${slug}-checkin-roster-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick initial loading state
  if (isCheckingAuth && !unlocked) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#A81C24] mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Checking admin access…</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 1. LOGIN SCREEN
  // ==========================================
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#A81C24]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#151922] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A81C24]/20 border border-[#A81C24]/40 text-red-300 font-bold text-[11px] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#A81C24]" />
              Staff Admin Area
            </div>
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              Public site <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="text-sm text-slate-400">
              Sign in with your staff password to monitor live event attendance, party headcounts, and guest lists.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder="Enter admin password…"
                  className="w-full bg-[#0B0E14] border border-slate-700 focus:border-[#A81C24] focus:ring-1 focus:ring-[#A81C24] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all pl-10"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-red w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Unlock Admin Area
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500">
              Community Commerce Melissa · Protected internal operations
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="border-b border-white/10 bg-[#151922]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A81C24] flex items-center justify-center shadow-md font-outfit font-black text-white text-lg">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-outfit font-extrabold text-base uppercase tracking-wider text-white">
                  CCM Admin
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A81C24]/20 border border-[#A81C24]/40 text-red-300 uppercase">
                  Live Operations
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Events, Headcounts & Guest Rosters</p>
            </div>
          </div>

          {/* Navigation Links & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 bg-[#0B0E14] p-1 rounded-xl border border-white/5">
              <span className="px-3 py-1.5 rounded-lg bg-[#A81C24] text-white font-bold flex items-center gap-1.5 shadow-sm">
                <Ticket className="w-3.5 h-3.5" /> Events
              </span>
              <Link
                href="/admin/members"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" /> Members
              </Link>
              <Link
                href="/admin/newsletter"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Newsletter
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => void loadData(activeSecret, false)}
                disabled={isRefreshing}
                title="Refresh live data"
                className="p-2 rounded-lg bg-[#0B0E14] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#A81C24]" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/20 text-red-300 hover:text-red-200 transition-all font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 flex-1 w-full">
        {/* Live Status Bar & Summary Metrics */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Attendance Sync
                </div>
                {lastRefreshedAt && (
                  <span className="text-xs text-slate-400">
                    Updated {lastRefreshedAt.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase tracking-tight mt-1 text-white">
                Live Event Numbers
              </h1>
            </div>

            {/* Quick Global CSV Export */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-slate-400 flex items-center gap-2 cursor-pointer bg-[#151922] px-3 py-2 rounded-lg border border-white/5">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-slate-700 text-[#A81C24] focus:ring-[#A81C24]"
                />
                Auto-refresh (15s)
              </label>

              <button
                onClick={() => handleDownloadPartyCsv()}
                className="btn-red px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Export Signups CSV
              </button>

              <button
                onClick={() => handleDownloadRosterCsv()}
                className="btn-gold-outline px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export Check-in Roster
              </button>
            </div>
          </div>

          {/* 4 Big Live Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Guests (Headcount) */}
            <div className="bg-[#151922] border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Total Guests (Headcount)</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
                  {overallSummary.totalGuests}
                </span>
                <span className="text-xs text-emerald-400 font-medium">attendees</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Sum of all guests across {activeTab === "upcoming" ? "upcoming" : activeTab === "past" ? "past" : "all"} signups
              </p>
            </div>

            {/* Total Signups (Parties) */}
            <div className="bg-[#151922] border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Registered Parties</span>
                <Ticket className="w-4 h-4 text-sky-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
                  {overallSummary.totalSignups}
                </span>
                <span className="text-xs text-sky-400 font-medium">forms</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Individual registrations submitted
              </p>
            </div>

            {/* Member vs Non-member */}
            <div className="bg-[#151922] border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Members vs Guests</span>
                <UserCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
                  {overallSummary.memberGuests}
                </span>
                <span className="text-xs text-amber-300 font-medium">
                  / {overallSummary.nonMemberGuests} guests
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {overallSummary.memberSignups} member parties · {overallSummary.nonMemberSignups} guest parties
              </p>
            </div>

            {/* Paid Revenue / Inquiries */}
            <div className="bg-[#151922] border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Paid Admissions</span>
                <Sparkles className="w-4 h-4 text-[#A81C24]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
                  ${(overallSummary.totalAmountCents / 100).toFixed(2)}
                </span>
                {overallSummary.businessInterestSignups > 0 && (
                  <span className="text-xs text-purple-300 font-medium">
                    · {overallSummary.businessInterestSignups} booths
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {overallSummary.paidSignups} paid tickets · {overallSummary.complimentarySignups} complimentary
              </p>
            </div>
          </div>
        </div>

        {/* View Tabs: Upcoming Events, Past Events, All Signups */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab("upcoming");
                  setSelectedEventId("all");
                }}
                className={`px-4 py-2.5 rounded-xl font-outfit font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "upcoming"
                    ? "bg-[#A81C24] text-white shadow-lg shadow-red-900/30"
                    : "bg-[#151922] text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Upcoming Events ({upcomingEvents.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab("past");
                  setSelectedEventId("all");
                }}
                className={`px-4 py-2.5 rounded-xl font-outfit font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "past"
                    ? "bg-[#A81C24] text-white shadow-lg shadow-red-900/30"
                    : "bg-[#151922] text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <History className="w-4 h-4" />
                Past Events ({pastEvents.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab("all");
                  setSelectedEventId("all");
                }}
                className={`px-4 py-2.5 rounded-xl font-outfit font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#A81C24] text-white shadow-lg shadow-red-900/30"
                    : "bg-[#151922] text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Layers className="w-4 h-4" />
                All Signups ({registrations.length})
              </button>
            </div>

            {/* Event selection quick dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filter view:</span>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="bg-[#151922] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                <option value="all">
                  {activeTab === "upcoming"
                    ? "All Upcoming Events"
                    : activeTab === "past"
                    ? "All Past Events"
                    : "All Events Combined"}
                </option>
                {(activeTab === "upcoming"
                  ? upcomingEvents
                  : activeTab === "past"
                  ? pastEvents
                  : events
                ).map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ========================================================= */}
          {/* EVENT CARDS: Separated by event with live numbers & actions */}
          {/* ========================================================= */}
          {activeTab !== "all" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  {activeTab === "upcoming" ? "Upcoming Event Numbers" : "Past Event Records"}
                </h2>
                <span className="text-xs text-slate-500">
                  Click &ldquo;View Guest List&rdquo; on any event to inspect attendees
                </span>
              </div>

              {(activeTab === "upcoming" ? upcomingEvents : pastEvents).length === 0 ? (
                <div className="bg-[#151922] border border-white/10 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                  <p className="text-base font-semibold text-slate-300">
                    No {activeTab} events found.
                  </p>
                  <p className="text-xs text-slate-500">
                    {activeTab === "past"
                      ? "Events will automatically move here the calendar day after they take place."
                      : "New in-house events added to the site catalog will appear here."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(activeTab === "upcoming" ? upcomingEvents : pastEvents).map((event) => {
                    const stats = eventStatsMap.get(event.id)?.summary || calculateEventRegistrationsSummary([]);
                    const isSelected = selectedEventId === event.id;

                    return (
                      <div
                        key={event.id}
                        className={`bg-[#151922] border rounded-2xl p-5 flex flex-col justify-between transition-all shadow-md ${
                          isSelected
                            ? "border-[#A81C24] ring-1 ring-[#A81C24] shadow-red-950/20"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* Card Header */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10">
                              {event.kicker || event.category}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                event.isPast
                                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                                  : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {event.isPast ? "Concluded" : "Upcoming"}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-lg font-extrabold font-outfit uppercase tracking-tight text-white line-clamp-2">
                              {event.title}
                            </h3>
                            <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{event.dateLabel || event.date}</span>
                              </div>
                              {event.time && (
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span>{event.time}</span>
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Live Numbers Grid for this Event */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                            <div className="bg-[#0B0E14] p-2.5 rounded-xl border border-white/5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Total Guests
                              </span>
                              <span className="text-2xl font-black font-outfit text-white">
                                {stats.totalGuests}
                              </span>
                              <span className="text-[10px] text-emerald-400 block">headcount</span>
                            </div>

                            <div className="bg-[#0B0E14] p-2.5 rounded-xl border border-white/5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Signups
                              </span>
                              <span className="text-2xl font-black font-outfit text-white">
                                {stats.totalSignups}
                              </span>
                              <span className="text-[10px] text-sky-400 block">parties</span>
                            </div>

                            <div className="bg-[#0B0E14] p-2 rounded-lg border border-white/5 col-span-2 flex items-center justify-between text-xs">
                              <span className="text-slate-400">
                                🎖️ {stats.memberGuests} members · {stats.nonMemberGuests} guests
                              </span>
                              <span className="text-slate-300 font-semibold">
                                {stats.totalAmountCents > 0
                                  ? `$${(stats.totalAmountCents / 100).toFixed(2)}`
                                  : stats.businessInterestSignups > 0
                                  ? `${stats.businessInterestSignups} booth inquiries`
                                  : "Free event"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedEventId(event.id)}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                              isSelected
                                ? "bg-white/15 text-white border border-white/20"
                                : "bg-[#A81C24] text-white hover:bg-[#8B1219]"
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {isSelected ? "Currently Viewing Guests" : `View Guests (${stats.totalGuests})`}
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleDownloadPartyCsv(event.id, event.title)}
                              className="py-1.5 px-2 rounded-lg bg-[#0B0E14] hover:bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              title="Export registrations as CSV"
                            >
                              <Download className="w-3 h-3" /> Signups CSV
                            </button>
                            <button
                              onClick={() => handleDownloadRosterCsv(event.id, event.title)}
                              className="py-1.5 px-2 rounded-lg bg-[#0B0E14] hover:bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              title="Export individual check-in roster"
                            >
                              <Download className="w-3 h-3" /> Check-in Sheet
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* GUEST LIST & ROSTER TABLE */}
          {/* ========================================================= */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold font-outfit uppercase tracking-tight text-white">
                    Guest Roster & Signups
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A81C24]/20 border border-[#A81C24]/40 text-red-300">
                    {filteredRegistrations.length} signups ·{" "}
                    {filteredRegistrations.reduce(
                      (acc, r) => acc + calculateEventRegistrationGuests(r),
                      0
                    )}{" "}
                    guests
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedEventId === "all"
                    ? `Displaying registrations across ${activeTab === "upcoming" ? "all upcoming events" : activeTab === "past" ? "all past events" : "all events"}.`
                    : `Filtered to: ${events.find((e) => e.id === selectedEventId)?.title || selectedEventId}`}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedEventId !== "all" && (
                  <button
                    onClick={() => setSelectedEventId("all")}
                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Show all events
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDownloadPartyCsv(
                      selectedEventId !== "all" ? selectedEventId : undefined
                    )
                  }
                  className="btn-red px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download List (CSV)
                </button>

                <button
                  onClick={() =>
                    handleDownloadRosterCsv(
                      selectedEventId !== "all" ? selectedEventId : undefined
                    )
                  }
                  className="btn-gold-outline px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Check-in Roster
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#151922] p-3 rounded-2xl border border-white/10">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by attendee name, companion guest, email, phone, company…"
                  className="w-full bg-[#0B0E14] border border-slate-700 focus:border-[#A81C24] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setFilterKind("all")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterKind === "all"
                      ? "bg-white/20 text-white"
                      : "bg-[#0B0E14] text-slate-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterKind("members")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterKind === "members"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-[#0B0E14] text-slate-400 hover:text-white"
                  }`}
                >
                  Members
                </button>
                <button
                  onClick={() => setFilterKind("guests")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterKind === "guests"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      : "bg-[#0B0E14] text-slate-400 hover:text-white"
                  }`}
                >
                  Non-members
                </button>
                <button
                  onClick={() => setFilterKind("paid")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterKind === "paid"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-[#0B0E14] text-slate-400 hover:text-white"
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => setFilterKind("interest")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterKind === "interest"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-[#0B0E14] text-slate-400 hover:text-white"
                  }`}
                >
                  Tent Inquiries
                </button>
              </div>
            </div>

            {/* Guest Table */}
            <div className="overflow-x-auto border border-white/10 rounded-2xl bg-[#151922] shadow-xl">
              <table className="w-full text-left text-sm min-w-[960px]">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 bg-[#0B0E14]/60">
                  <tr>
                    <th className="px-4 py-3.5">Event</th>
                    <th className="px-4 py-3.5">Primary Registrant</th>
                    <th className="px-4 py-3.5">Contact Info</th>
                    <th className="px-4 py-3.5">Party / Guests</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Payment</th>
                    <th className="px-4 py-3.5">Registered</th>
                    <th className="px-4 py-3.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-[#A81C24] inline-block mb-2" />
                        <p className="text-xs">Loading guest registrations…</p>
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                        <div className="max-w-sm mx-auto space-y-1">
                          <p className="text-base font-medium text-slate-300">No signups found</p>
                          <p className="text-xs text-slate-500">
                            {searchQuery
                              ? `No attendees match "${searchQuery}". Try clearing search.`
                              : "No guests have registered yet for this view."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((row) => {
                      const guestCount = calculateEventRegistrationGuests(row);
                      const hasCompanions = Array.isArray(row.additionalGuests) && row.additionalGuests.length > 0;

                      return (
                        <tr
                          key={`${row.eventId}-${row.id}-${row.email}`}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          {/* Event */}
                          <td className="px-4 py-3.5 max-w-[200px]">
                            <div className="font-semibold text-white truncate text-xs">
                              {row.eventTitle || row.eventId}
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                              {row.kind === "business_interest" ? "Booth inquiry" : "General signup"}
                            </span>
                          </td>

                          {/* Primary Registrant */}
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-white flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                                {(row.name || row.email || "G").charAt(0).toUpperCase()}
                              </span>
                              <span className="truncate">{row.name || "—"}</span>
                            </div>
                            {row.company && (
                              <div className="text-xs text-slate-400 truncate mt-0.5 ml-8">
                                {row.company}
                              </div>
                            )}
                          </td>

                          {/* Contact Info */}
                          <td className="px-4 py-3.5 text-xs space-y-0.5">
                            <a
                              href={`mailto:${row.email}`}
                              className="text-slate-300 hover:text-white flex items-center gap-1.5 truncate"
                            >
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{row.email}</span>
                            </a>
                            {row.phone && (
                              <a
                                href={`tel:${row.phone}`}
                                className="text-slate-400 hover:text-white flex items-center gap-1.5 truncate"
                              >
                                <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                                <span>{row.phone}</span>
                              </a>
                            )}
                          </td>

                          {/* Party / Headcount */}
                          <td className="px-4 py-3.5 text-xs">
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                              <Users className="w-3 h-3" />
                              Party of {guestCount}
                            </div>

                            {hasCompanions && (
                              <div className="text-[11px] text-slate-400 mt-1.5 space-y-1">
                                {row.additionalGuests.map((guest, idx) => (
                                  <div key={`${row.id}-guest-${idx}`} className="flex items-center gap-1">
                                    <span className="text-slate-500 text-[10px]">•</span>
                                    <span className="text-slate-300 font-medium">{guest.name}</span>
                                    {guest.email && (
                                      <span className="text-slate-500 text-[10px]">
                                        &lt;{guest.email}&gt;
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Membership Status */}
                          <td className="px-4 py-3.5 text-xs">
                            {row.membershipStatus === "member" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                Member
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[11px]">
                                Non-member
                              </span>
                            )}
                          </td>

                          {/* Payment / Pricing */}
                          <td className="px-4 py-3.5 text-xs">
                            {row.paymentStatus === "paid" ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                                  Paid
                                </span>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  ${(row.amountCents / 100).toFixed(2)}
                                </div>
                              </div>
                            ) : row.kind === "business_interest" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[11px]">
                                Booth Inquiry
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Complimentary</span>
                            )}
                          </td>

                          {/* Registered At */}
                          <td className="px-4 py-3.5 text-xs text-slate-400">
                            {row.createdAt ? (
                              <div>
                                <div>{new Date(row.createdAt).toLocaleDateString()}</div>
                                <div className="text-[10px] text-slate-500">
                                  {new Date(row.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => setActiveModalRecord(row)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* GUEST DETAIL MODAL */}
      {/* ========================================================= */}
      {activeModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#151922] border border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#A81C24]/20 text-red-300 border border-[#A81C24]/40">
                  {activeModalRecord.eventTitle || activeModalRecord.eventId}
                </span>
                <h3 className="text-xl font-extrabold font-outfit uppercase tracking-tight text-white mt-2">
                  {activeModalRecord.name || "Attendee Record"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalRecord(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Email Address
                </span>
                <a
                  href={`mailto:${activeModalRecord.email}`}
                  className="text-white hover:underline font-medium break-all mt-0.5 block"
                >
                  {activeModalRecord.email}
                </a>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Phone Number
                </span>
                <span className="text-white font-medium mt-0.5 block">
                  {activeModalRecord.phone || "Not provided"}
                </span>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Business / Company
                </span>
                <span className="text-white font-medium mt-0.5 block">
                  {activeModalRecord.company || "Not provided"}
                </span>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Membership Status
                </span>
                <span className="text-white font-medium mt-0.5 block">
                  {activeModalRecord.membershipStatus === "member" ? "⭐ Active Member" : "Non-member"}
                </span>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Payment Status
                </span>
                <span className="text-white font-medium mt-0.5 block">
                  {activeModalRecord.paymentStatus}
                  {activeModalRecord.amountCents > 0
                    ? ` · $${(activeModalRecord.amountCents / 100).toFixed(2)}`
                    : ""}
                </span>
              </div>

              <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Registered Date
                </span>
                <span className="text-white font-medium mt-0.5 block">
                  {activeModalRecord.createdAt
                    ? new Date(activeModalRecord.createdAt).toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>

            {/* Additional Guests List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Party Members ({calculateEventRegistrationGuests(activeModalRecord)} Total Guests)
              </h4>
              <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <span className="font-semibold text-white">{activeModalRecord.name}</span>
                    <span className="text-slate-400 text-[11px] block">{activeModalRecord.email}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                    Primary Registrant
                  </span>
                </div>

                {activeModalRecord.additionalGuests?.length > 0 ? (
                  activeModalRecord.additionalGuests.map((guest, idx) => (
                    <div
                      key={`modal-guest-${idx}`}
                      className="flex items-center justify-between pt-1 border-t border-white/5"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">{guest.name}</span>
                        {guest.email && (
                          <span className="text-slate-400 text-[11px] block">{guest.email}</span>
                        )}
                        {guest.phone && (
                          <span className="text-slate-500 text-[10px] block">{guest.phone}</span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        Guest {idx + 2}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-[11px] italic">No additional guests in this party.</p>
                )}
              </div>
            </div>

            {/* Notes */}
            {activeModalRecord.notes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Notes & Special Requests
                </h4>
                <div className="bg-[#0B0E14] p-3 rounded-xl border border-white/5 text-xs text-slate-300">
                  {activeModalRecord.notes}
                </div>
              </div>
            )}

            {/* Stripe session id */}
            {activeModalRecord.stripeSessionId && (
              <div className="text-[11px] text-slate-500">
                Stripe Session ID: <code>{activeModalRecord.stripeSessionId}</code>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModalRecord(null)}
                className="btn-gold-outline px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
