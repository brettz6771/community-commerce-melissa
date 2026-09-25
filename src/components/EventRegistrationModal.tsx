"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  Ticket,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import TermsAgreement from "@/components/TermsAgreement";
import {
  OKTOBERFEST_PRICE_LABEL,
  guestTicketPriceLabel,
  partySizeOptions,
  resizeAdditionalGuests,
  type EventPartyGuest,
  type EventRegistrationPath,
  type SiteEvent,
} from "@/lib/site-events";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: SiteEvent | null;
  initialPath?: EventRegistrationPath;
}

type PortalState = {
  status: string;
  email?: string;
  member?: { email?: string; businessName?: string; ownerName?: string };
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  guests: string;
  additionalGuests: EventPartyGuest[];
  notes: string;
};

const inputClass =
  "w-full bg-[#151922] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition";

export default function EventRegistrationModal({
  isOpen,
  onClose,
  event,
  initialPath,
}: EventRegistrationModalProps) {
  const [portal, setPortal] = useState<PortalState>({ status: "guest" });
  const [activePath, setActivePath] = useState<EventRegistrationPath>("attendee");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    guests: "1",
    additionalGuests: [],
    notes: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  // Load portal member info if available
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/member-portal/me", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data?.status === "ok") {
          setPortal(data);
        }
      } catch {
        if (!cancelled) setPortal({ status: "guest" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // When event or initialPath changes, synchronize state
  useEffect(() => {
    if (!event) return;

    let path: EventRegistrationPath = "attendee";
    if (event.id === "oktoberfest") {
      path = initialPath || (portal.status === "ok" ? "member" : "guest");
    } else if (event.id === "tent-or-treat") {
      path = initialPath === "sponsor" ? "sponsor" : "attendee";
    }

    setActivePath(path);
    setError("");
    setSuccess(null);
    setAgreed(false);
    setForm({
      name: portal.member?.ownerName || "",
      email: portal.member?.email || "",
      phone: "",
      company: portal.member?.businessName || "",
      guests: "1",
      additionalGuests: [],
      notes:
        event.id === "tent-or-treat" && path === "attendee"
          ? "Enter me in the prize drawing"
          : "",
    });
  }, [event, initialPath, portal, isOpen]);

  if (!isOpen || !event) return null;

  const isTentOrTreat = event.id === "tent-or-treat";
  const isOktoberfest = event.id === "oktoberfest";
  const isLunchAndLearn = event.id === "lunch-and-learn";

  const handlePathChange = (newPath: EventRegistrationPath) => {
    setActivePath(newPath);
    setError("");
    setForm((prev) => ({
      ...prev,
      guests: "1",
      additionalGuests: [],
      notes:
        isTentOrTreat && newPath === "attendee"
          ? "Enter me in the prize drawing"
          : "",
    }));
  };

  const updateAdditionalGuest = (
    index: number,
    field: keyof EventPartyGuest,
    value: string
  ) => {
    const updated = form.additionalGuests.map((guest, i) =>
      i === index ? { ...guest, [field]: value } : guest
    );
    setForm({ ...form, additionalGuests: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (activePath === "guest") {
        const res = await fetch("/api/events/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: event.id, path: activePath, ...form }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.url) {
          setError(data.error || "Could not start checkout.");
          setBusy(false);
          return;
        }
        window.location.href = data.url;
        return;
      }

      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, path: activePath, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not complete registration.");
        if (data.needsPayment) {
          setActivePath("guest");
        }
        setBusy(false);
        return;
      }

      setSuccess(data.message || "Registration received!");
    } catch {
      setError("Registration failed. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const sizes = partySizeOptions(event.id, activePath);
  const showGuestParty = activePath !== "sponsor";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0B0E14] border border-white/15 rounded-2xl w-full max-w-xl text-white shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Strip */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#111620] relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-8 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-700/20 text-red-300 border border-red-500/30">
                <Sparkles className="w-3 h-3 text-red-400" />
                {event.kicker}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {event.dateLabel}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-outfit text-white leading-tight">
              {event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                {event.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {success ? (
            <div className="text-center py-6 sm:py-8 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold font-outfit text-white">
                  {activePath === "sponsor" ? "Interest Received!" : "You're Registered!"}
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  {success}
                </p>
              </div>

              <div className="bg-[#151922] border border-white/10 rounded-xl p-4 text-xs space-y-2.5 text-left max-w-md mx-auto">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{event.dateLabel} · {event.time}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{event.location}{event.address ? ` · ${event.address}` : ""}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    event.title
                  )}&dates=20261026T230000Z/20261027T010000Z&details=${encodeURIComponent(
                    event.description
                  )}&location=${encodeURIComponent(event.location + (event.address ? `, ${event.address}` : ""))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full btn-red py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Add to Calendar
                </a>

                <button
                  onClick={onClose}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition border border-white/10"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Event Specific Path Selectors */}
              {isOktoberfest && (
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Admission Option
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePathChange("member")}
                      className={`p-3 rounded-xl text-left border transition text-xs flex flex-col gap-1 ${
                        activePath === "member"
                          ? "bg-red-700/20 border-red-500 text-white"
                          : "bg-[#151922] border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>CCM Member</span>
                        <span className="text-emerald-400 uppercase text-[10px] font-black">Free</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Member admission + 1 guest included
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePathChange("guest")}
                      className={`p-3 rounded-xl text-left border transition text-xs flex flex-col gap-1 ${
                        activePath === "guest"
                          ? "bg-red-700/20 border-red-500 text-white"
                          : "bg-[#151922] border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>Guest / Non-Member</span>
                        <span className="text-amber-300 font-black">{OKTOBERFEST_PRICE_LABEL}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Up to 4 guests ($20 each at checkout)
                      </span>
                    </button>
                  </div>
                  {portal.status === "ok" && activePath === "member" && (
                    <p className="text-xs text-emerald-400 font-semibold pt-0.5">
                      ✓ Signed in as {portal.member?.email}. Member ticket is complimentary.
                    </p>
                  )}
                </div>
              )}

              {isTentOrTreat && (
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Registration Type
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePathChange("attendee")}
                      className={`p-3 rounded-xl text-left border transition text-xs flex flex-col gap-1 ${
                        activePath === "attendee"
                          ? "bg-red-700/20 border-red-500 text-white"
                          : "bg-[#151922] border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Users className="w-3.5 h-3.5 text-red-400" />
                        <span>Attendee / Family</span>
                        <span className="ml-auto text-emerald-400 text-[10px] font-black uppercase">Free</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Free admission + automatic entry in prize drawing
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePathChange("sponsor")}
                      className={`p-3 rounded-xl text-left border transition text-xs flex flex-col gap-1 ${
                        activePath === "sponsor"
                          ? "bg-red-700/20 border-red-500 text-white"
                          : "bg-[#151922] border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Booth / Table / Sponsor</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Interest form for business tents & tables
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {isLunchAndLearn && (
                <div className="bg-red-700/15 border border-red-500/30 rounded-xl p-3 text-xs text-red-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-400 shrink-0" />
                  <span>
                    Free for all attendees. Complimentary lunch provided thanks to First United Bank!
                  </span>
                </div>
              )}

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="block space-y-1 sm:col-span-2">
                  <span className="block text-xs font-bold text-slate-300 uppercase">
                    Full Name *
                  </span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-1">
                  <span className="block text-xs font-bold text-slate-300 uppercase">
                    Email Address *
                  </span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-1">
                  <span className="block text-xs font-bold text-slate-300 uppercase">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(972) 555-0199"
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-1 sm:col-span-2">
                  <span className="block text-xs font-bold text-slate-300 uppercase">
                    {activePath === "sponsor" ? "Business Name *" : "Company / Business Name"}
                  </span>
                  <input
                    type="text"
                    required={activePath === "sponsor"}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder={activePath === "sponsor" ? "Your Melissa business or booth name" : "Business or organization (optional)"}
                    className={inputClass}
                  />
                </label>

                {showGuestParty && (
                  <label className="block space-y-1 sm:col-span-2">
                    <span className="block text-xs font-bold text-slate-300 uppercase">
                      Guests Attending (Including Yourself)
                    </span>
                    <select
                      value={form.guests}
                      onChange={(e) => {
                        const guests = e.target.value;
                        setForm({
                          ...form,
                          guests,
                          additionalGuests: resizeAdditionalGuests(
                            form.additionalGuests,
                            Number(guests) || 1
                          ),
                        });
                      }}
                      className={inputClass}
                    >
                      {sizes.map((size) => (
                        <option key={size} value={String(size)}>
                          {size} {size === 1 ? "person" : "people"}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {/* Additional Guests Inputs */}
                {showGuestParty &&
                  form.additionalGuests.map((guest, index) => (
                    <div
                      key={`guest-${index + 2}`}
                      className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-slate-700 bg-[#151922]/70 p-3"
                    >
                      <p className="sm:col-span-2 text-xs font-bold uppercase tracking-wider text-red-400">
                        Guest {index + 2} Details
                      </p>
                      <label className="block space-y-1 sm:col-span-2">
                        <span className="block text-[11px] font-bold text-slate-300 uppercase">
                          Full Name *
                        </span>
                        <input
                          className={inputClass}
                          required
                          value={guest.name}
                          onChange={(e) =>
                            updateAdditionalGuest(index, "name", e.target.value)
                          }
                          placeholder="Guest full name"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="block text-[11px] font-bold text-slate-300 uppercase">
                          Email *
                        </span>
                        <input
                          type="email"
                          className={inputClass}
                          required
                          value={guest.email}
                          onChange={(e) =>
                            updateAdditionalGuest(index, "email", e.target.value)
                          }
                          placeholder="guest@example.com"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="block text-[11px] font-bold text-slate-300 uppercase">
                          Phone
                        </span>
                        <input
                          type="tel"
                          className={inputClass}
                          value={guest.phone}
                          onChange={(e) =>
                            updateAdditionalGuest(index, "phone", e.target.value)
                          }
                          placeholder="(optional)"
                        />
                      </label>
                    </div>
                  ))}

                {/* Notes Field */}
                {(activePath === "sponsor" || isTentOrTreat) && (
                  <label className="block space-y-1 sm:col-span-2">
                    <span className="block text-xs font-bold text-slate-300 uppercase">
                      {activePath === "sponsor"
                        ? "Tent / Table Questions or Special Requests"
                        : "Notes (Optional)"}
                    </span>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder={
                        activePath === "sponsor"
                          ? "Let us know if you need standard 10x10 tent space, power, or food vendor setup..."
                          : "Optional message for event staff"
                      }
                      className={inputClass}
                    />
                  </label>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="pt-2">
                <TermsAgreement
                  checked={agreed}
                  onChange={setAgreed}
                  variant="dark"
                  id={`modal-agree-${event.id}-${activePath}`}
                  includeRefund={activePath === "guest"}
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs">
                  {error}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={busy || !agreed}
                className="w-full btn-red py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] transition"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {activePath === "guest"
                    ? `Proceed to Checkout (${guestTicketPriceLabel(Number(form.guests) || 1)})`
                    : activePath === "sponsor"
                    ? "Submit Business Booth Interest"
                    : isOktoberfest && activePath === "member"
                    ? "Confirm Free Member Registration"
                    : "Confirm Registration & RSVP"}
                </span>
              </button>

              <div className="pt-1 text-center">
                <Link
                  href={event.href}
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white underline underline-offset-2 transition"
                >
                  View full event details & map →
                </Link>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
