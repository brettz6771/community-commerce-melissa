"use client";

import React, { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LaunchBanner from "@/components/LaunchBanner";
import MemberModal from "@/components/MemberModal";
import PageTitle from "@/components/PageTitle";
import TermsAgreement from "@/components/TermsAgreement";
import {
  DEFAULT_TENT_SPACE_OPTION,
  OKTOBERFEST_PRICE_LABEL,
  TENT_SPACE_OPTIONS,
  getSiteEvent,
  guestTicketPriceLabel,
  tentPromoCodeMatches,
  tentSpaceChargeLabel,
  partySizeOptions,
  resizeAdditionalGuests,
  type EventPartyGuest,
  type EventRegistrationPath,
  type SiteEvent,
  type TentSpaceOptionId,
} from "@/lib/site-events";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

type PortalState = {
  status: string;
  email?: string;
  member?: { email?: string; businessName?: string; ownerName?: string };
};

export default function EventDetailPage({ params }: EventPageProps) {
  const { slug } = use(params);
  const event = getSiteEvent(slug);
  if (!event) notFound();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <EventDetailClient event={event} />
    </Suspense>
  );
}

function EventDetailClient({ event }: { event: SiteEvent }) {
  const searchParams = useSearchParams();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [portal, setPortal] = useState<PortalState>({ status: "guest" });
  const registered = searchParams.get("registered");
  const canceled = searchParams.get("canceled") === "true";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/member-portal/me", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!cancelled) setPortal(data);
      } catch {
        if (!cancelled) setPortal({ status: "guest" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title={`${event.title} — Community Commerce Melissa`} />
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <section className="bg-[#0B0E14] text-white py-12 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link href="/events" className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 text-red-500" />
            All events
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">{event.kicker}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">{event.title}</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">{event.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-200 pt-2">
            <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-red-400" />{event.dateLabel}</span>
            <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-red-400" />{event.time}</span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                {event.location}
                {event.address ? ` · ${event.address}` : ""}
              </span>
            </span>
          </div>
        </div>
      </section>

      <main className="py-10 sm:py-12 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {registered && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-5 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold font-outfit uppercase">
                  {event.id === "tent-or-treat" && registered === "paid"
                    ? "Tent Space Confirmed"
                    : "You're registered"}
                </p>
                <p className="text-sm mt-1">
                  {registered === "paid"
                    ? event.id === "tent-or-treat"
                      ? "Tent space payment received. Your booth space is reserved and a confirmation email has been sent."
                      : "Guest ticket payment received. A confirmation is on its way."
                    : "We saved your registration and emailed a confirmation."}
                </p>
              </div>
            </div>
          )}
          {canceled && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-sm">
              Checkout was canceled. You can register again below.
            </div>
          )}

          {event.id === "tent-or-treat" ? (
            <TentOrTreatForms event={event} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-4">
                <img src={event.image} alt={event.title} className="w-full rounded-2xl border border-slate-200 shadow-lg bg-slate-900" />
                {event.id === "oktoberfest" ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-700">Admission</p>
                    <p className="text-sm text-slate-700"><strong>Members:</strong> free, plus one guest</p>
                    <p className="text-sm text-slate-700"><strong>Guests:</strong> {OKTOBERFEST_PRICE_LABEL} each, up to 4 including yourself</p>
                    <p className="text-sm text-slate-700">Complimentary appetizers, beer, and wine. Partner: Three Nations Brewing Co.</p>
                  </div>
                ) : event.id === "pack-with-purpose" ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-700">Free to Attend · Give-Back Lunch &amp; Learn</p>
                    <p className="text-sm text-slate-700">
                      Presented by <strong>Community Commerce Melissa</strong> &amp; <strong>National University</strong> in support of <strong>Soldiers&apos; Angels</strong>.
                    </p>
                    <p className="text-sm text-slate-700">
                      Join us as we come together to assemble care packages for our deployed military members. Let&apos;s show our appreciation and send a little piece of home to those who serve so far from it.
                    </p>
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-sm text-slate-700">
                      <p><strong>Donate Items:</strong> Personal care items, snacks, comfort items, and more.</p>
                      <p><strong>Get Involved:</strong> Contact us for a full list of requested items and donation drop-off details.</p>
                    </div>
                    <p className="text-xs text-slate-500 pt-1">
                      Free lunch included — gifted by <strong>Portillo&apos;s</strong> and hosted at <strong>First United Bank</strong> in McKinney.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-700">Free for attendees</p>
                    <p className="text-sm text-slate-700">Discover what CCM is about.</p>
                    <p className="text-sm text-slate-700">Connect with other local owners.</p>
                    <p className="text-sm text-slate-700">Get involved — committees and volunteer roles.</p>
                    <p className="text-xs text-slate-500">Lunch thanks to First United Bank.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 space-y-6">
                {event.id === "oktoberfest" ? (
                  <OktoberfestForm key={portal.member?.email || "guest"} event={event} portal={portal} />
                ) : (
                  <TentForm
                    event={event}
                    path="attendee"
                    title="Register free"
                    icon={<Users className="w-4 h-4" />}
                    intro={
                      event.id === "pack-with-purpose"
                        ? "Free to attend. Complimentary lunch gifted by Portillo's is included."
                        : "Free for everyone. Lunch is included."
                    }
                    submitLabel={
                      event.id === "pack-with-purpose"
                        ? "Register for Pack with Purpose"
                        : "Register for Lunch & Learn"
                    }
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MemberModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
}

const inputClass =
  "w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500";

type EventFormFields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  guests: string;
  additionalGuests: EventPartyGuest[];
  notes: string;
};

function OktoberfestForm({ event, portal }: { event: SiteEvent; portal: PortalState }) {
  const signedIn = portal.status === "ok";
  const [path, setPath] = useState<EventRegistrationPath>(signedIn ? "member" : "guest");
  const [form, setForm] = useState<EventFormFields>({
    name: portal.member?.ownerName || "",
    email: portal.member?.email || "",
    phone: "",
    company: portal.member?.businessName || "",
    guests: "1",
    additionalGuests: [],
    notes: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const submit = async (eventSubmit: React.FormEvent) => {
    eventSubmit.preventDefault();
    setBusy(true);
    setError("");
    setDone("");
    try {
      if (path === "guest") {
        const res = await fetch("/api/events/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: event.id, path, ...form }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.url) {
          setError(data.error || "Could not start checkout.");
          return;
        }
        window.location.href = data.url;
        return;
      }

      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, path, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not register.");
        if (data.needsPayment) setPath("guest");
        return;
      }
      setDone(data.message || "You're registered.");
    } catch {
      setError("Could not register. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-700">
        <Ticket className="w-4 h-4" />
        Register
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <PathButton
          active={path === "member"}
          onClick={() => {
            setPath("member");
            setForm((current) => ({
              ...current,
              guests: "1",
              additionalGuests: [],
            }));
          }}
          label="I'm a member — free"
        />
        <PathButton
          active={path === "guest"}
          onClick={() => setPath("guest")}
          label={`Guest — ${OKTOBERFEST_PRICE_LABEL} each`}
        />
      </div>
      {signedIn && path === "member" && (
        <p className="text-xs text-emerald-700 font-semibold">Signed in as {portal.member?.email}. Member admission is complimentary.</p>
      )}
      <SharedFields form={form} setForm={setForm} eventId={event.id} path={path} />
      <TermsAgreement checked={agreed} onChange={setAgreed} variant="light" includeRefund={path === "guest"} />
      {error && <p className="text-sm text-red-700">{error}</p>}
      {done && <p className="text-sm text-emerald-700 font-semibold">{done}</p>}
      <button type="submit" disabled={busy || !agreed} className="btn-red px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 inline-flex items-center gap-2">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {path === "guest" ? `Pay ${guestTicketPriceLabel(Number(form.guests) || 1)} and register` : "Register as member"}
      </button>
      {!signedIn && path === "member" && (
        <p className="text-[11px] text-slate-500">
          Use the email on your membership. No public portal link is required — we match the badge and free ticket by email.{" "}
          <Link href="/member-portal" className="text-red-700 font-bold">Sign in</Link> if you already have an account.
        </p>
      )}
    </form>
  );
}

function TentOrTreatForms({ event }: { event: SiteEvent }) {
  return (
    <div className="space-y-12">
      <section id="attend" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <img src={event.image} alt={event.title} className="w-full rounded-2xl border border-slate-200 shadow-lg bg-slate-900" />
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-red-700">Attendee signup</p>
            <p className="text-sm text-slate-700">Free for everyone. Register on the right, then jump to business tents if you want a booth.</p>
            <a href="#business-tent" className="block text-sm font-bold text-red-700 hover:text-red-800">Business tent / sponsorship →</a>
            <p className="text-xs text-slate-500">Business setup 12:30–2:00 PM. Event 2:00–5:00 PM.</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <TentForm
            event={event}
            path="attendee"
            title="Register free to attend"
            icon={<Users className="w-4 h-4" />}
            intro="Free for everyone. You’ll be entered into a drawing for prizes."
            submitLabel="Register to attend"
            drawing
          />
        </div>
      </section>

      <section id="business-tent" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          {event.businessImage ? (
            <img
              src={event.businessImage}
              alt="Business tent and sponsorship information"
              className="w-full rounded-2xl border border-slate-200 shadow-lg bg-white"
            />
          ) : null}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-red-700">Vendor Schedule & Info</p>
            <p className="text-sm text-slate-700"><strong>Business Setup:</strong> 12:30 PM – 2:00 PM</p>
            <p className="text-sm text-slate-700"><strong>Event Hours:</strong> 2:00 PM – 5:00 PM</p>
            <p className="text-sm text-slate-700"><strong>Location:</strong> Melissa Lake Park</p>
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              Questions or sponsorships: Cindy Karman,{" "}
              <a className="text-red-700 font-bold" href="mailto:cindy@barefootnaturals.com">cindy@barefootnaturals.com</a>
            </p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <TentSpaceForm event={event} />
          </div>
        </div>
      </section>
    </div>
  );
}

function TentSpaceForm({ event }: { event: SiteEvent }) {
  const [spaceOption, setSpaceOption] = useState<TentSpaceOptionId>(DEFAULT_TENT_SPACE_OPTION);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoNotice, setPromoNotice] = useState("");
  const [form, setForm] = useState<EventFormFields>({
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

  const promoApplied = tentPromoCodeMatches(appliedPromoCode) && tentPromoCodeMatches(promoCode);
  const chargeLabel = promoApplied
    ? tentSpaceChargeLabel(spaceOption, appliedPromoCode)
    : TENT_SPACE_OPTIONS[spaceOption].priceLabel;

  const applyPromoCode = () => {
    if (tentPromoCodeMatches(promoCode)) {
      setAppliedPromoCode(promoCode.trim());
      setPromoNotice("Code applied.");
      return;
    }
    setAppliedPromoCode("");
    setPromoNotice(promoCode.trim() ? "That code is not recognized. Flyer prices still apply." : "");
  };

  const changePromoCode = (value: string) => {
    setPromoCode(value);
    if (appliedPromoCode && !tentPromoCodeMatches(value)) {
      setAppliedPromoCode("");
      setPromoNotice("");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/events/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          path: "sponsor",
          spaceOption,
          promoCode: promoApplied ? promoCode : "",
          ...form,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Could not start checkout.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not start checkout. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-700">
        <Building2 className="w-4 h-4" />
        Reserve Business Tent Space
      </div>
      <p className="text-sm text-slate-600">
        Select your tent space tier below and proceed through checkout to secure your spot at Melissa Lake Park.
      </p>

      {/* Tier Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          Select Space Tier (Flyer Pricing) *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {Object.values(TENT_SPACE_OPTIONS).map((opt) => {
            const isSelected = spaceOption === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSpaceOption(opt.id)}
                className={`p-3.5 rounded-xl text-left border transition text-xs flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "bg-red-50 border-red-600 ring-2 ring-red-500/20 text-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{opt.name}</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{opt.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-red-700 font-extrabold text-sm">
                    {promoApplied ? tentSpaceChargeLabel(opt.id, appliedPromoCode) : opt.priceLabel}
                  </span>
                  {isSelected ? (
                    <span className="text-[10px] font-bold text-red-700 uppercase">Selected</span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500">Choose</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <span className="block text-xs font-bold text-slate-700 uppercase">Promotion code</span>
        <div className="flex gap-2">
          <input
            className={inputClass}
            value={promoCode}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => changePromoCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyPromoCode();
              }
            }}
            placeholder="Optional"
          />
          <button
            type="button"
            onClick={applyPromoCode}
            className="shrink-0 px-4 rounded-xl border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-800 hover:border-red-600"
          >
            Apply
          </button>
        </div>
        {promoNotice ? (
          <p className={`text-xs ${promoApplied ? "text-emerald-700" : "text-slate-500"}`}>{promoNotice}</p>
        ) : null}
      </div>

      <SharedFields
        form={form}
        setForm={setForm}
        eventId={event.id}
        path="sponsor"
        requireCompany={true}
        showNotes={true}
      />

      <TermsAgreement checked={agreed} onChange={setAgreed} variant="light" id="agree-sponsor" includeRefund={true} />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={busy || !agreed}
        className="btn-red px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 inline-flex items-center gap-2 shadow-md hover:scale-[1.01] transition"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Pay {chargeLabel} and reserve tent space
      </button>

      <p className="text-xs text-slate-500 pt-1">
        Questions about tent spaces or sponsorships? Contact Cindy Karman,{" "}
        <a className="text-red-700 font-bold" href="mailto:cindy@barefootnaturals.com">
          cindy@barefootnaturals.com
        </a>
      </p>
    </form>
  );
}

function TentForm({
  event,
  path,
  title,
  icon,
  intro,
  submitLabel,
  requireCompany = false,
  nested = false,
  drawing = false,
}: {
  event: SiteEvent;
  path: EventRegistrationPath;
  title: string;
  icon: React.ReactNode;
  intro: string;
  submitLabel: string;
  requireCompany?: boolean;
  nested?: boolean;
  drawing?: boolean;
}) {
  const [form, setForm] = useState<EventFormFields>({
    name: "",
    email: "",
    phone: "",
    company: "",
    guests: "1",
    additionalGuests: [],
    notes: drawing ? "Enter me in the prize drawing" : "",
  });
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const submit = async (eventSubmit: React.FormEvent) => {
    eventSubmit.preventDefault();
    setBusy(true);
    setError("");
    setDone("");
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, path, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not submit.");
        return;
      }
      setDone(data.message || "Submitted.");
    } catch {
      setError("Could not submit. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={nested ? "space-y-4" : "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4"}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-700">
        {icon}
        {title}
      </div>
      <p className="text-sm text-slate-600">{intro}</p>
      <SharedFields
        form={form}
        setForm={setForm}
        eventId={event.id}
        path={path}
        requireCompany={requireCompany}
        showNotes={path === "sponsor" || event.id === "pack-with-purpose"}
      />
      <TermsAgreement checked={agreed} onChange={setAgreed} variant="light" id={`agree-${path}`} />
      {error && <p className="text-sm text-red-700">{error}</p>}
      {done && <p className="text-sm text-emerald-700 font-semibold">{done}</p>}
      <button type="submit" disabled={busy || !agreed} className="btn-red px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 inline-flex items-center gap-2">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {submitLabel}
      </button>
    </form>
  );
}

function SharedFields({
  form,
  setForm,
  eventId,
  path,
  requireCompany = false,
  showNotes = false,
}: {
  form: EventFormFields;
  setForm: React.Dispatch<React.SetStateAction<EventFormFields>>;
  eventId: SiteEvent["id"];
  path: EventRegistrationPath;
  requireCompany?: boolean;
  showNotes?: boolean;
}) {
  const sizes = partySizeOptions(eventId, path);
  const showGuestParty = path !== "sponsor";
  const updateAdditionalGuest = (index: number, field: keyof EventPartyGuest, value: string) => {
    const next = form.additionalGuests.map((guest, guestIndex) =>
      guestIndex === index ? { ...guest, [field]: value } : guest
    );
    setForm({ ...form, additionalGuests: next });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="block space-y-1 sm:col-span-2">
        <span className="block text-xs font-bold text-slate-600 uppercase">Full name *</span>
        <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label className="block space-y-1">
        <span className="block text-xs font-bold text-slate-600 uppercase">Email *</span>
        <input type="email" className={inputClass} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="block space-y-1">
        <span className="block text-xs font-bold text-slate-600 uppercase">Phone</span>
        <input type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </label>
      <label className="block space-y-1">
        <span className="block text-xs font-bold text-slate-600 uppercase">{requireCompany ? "Business name *" : "Business / company"}</span>
        <input className={inputClass} required={requireCompany} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      </label>
      {showGuestParty && (
        <label className="block space-y-1">
          <span className="block text-xs font-bold text-slate-600 uppercase">Guests (including yourself)</span>
          <select
            className={inputClass}
            value={form.guests}
            onChange={(e) => {
              const guests = e.target.value;
              setForm({
                ...form,
                guests,
                additionalGuests: resizeAdditionalGuests(form.additionalGuests, Number(guests) || 1),
              });
            }}
          >
            {sizes.map((size) => (
              <option key={size} value={String(size)}>
                {size}
              </option>
            ))}
          </select>
        </label>
      )}
      {showGuestParty && form.additionalGuests.map((guest, index) => (
        <div key={`guest-${index + 2}`} className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="sm:col-span-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            Guest {index + 2} details
          </p>
          <label className="block space-y-1 sm:col-span-2">
            <span className="block text-xs font-bold text-slate-600 uppercase">Full name *</span>
            <input
              className={inputClass}
              required
              value={guest.name}
              onChange={(e) => updateAdditionalGuest(index, "name", e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="block text-xs font-bold text-slate-600 uppercase">Email *</span>
            <input
              type="email"
              className={inputClass}
              required
              value={guest.email}
              onChange={(e) => updateAdditionalGuest(index, "email", e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="block text-xs font-bold text-slate-600 uppercase">Phone</span>
            <input
              type="tel"
              className={inputClass}
              value={guest.phone}
              onChange={(e) => updateAdditionalGuest(index, "phone", e.target.value)}
            />
          </label>
        </div>
      ))}
      {showNotes && (
        <label className="block space-y-1 sm:col-span-2">
          <span className="block text-xs font-bold text-slate-600 uppercase">Notes for staff</span>
          <textarea className={inputClass} rows={3} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </label>
      )}
    </div>
  );
}

function PathButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
        active ? "bg-red-700 text-white border-red-700" : "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
