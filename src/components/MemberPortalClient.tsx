"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  Building2,
  Download,
  Eye,
  EyeOff,
  ImageDown,
  Loader2,
  Lock,
  LogOut,
  Printer,
  Share2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import MemberBadgeCard from "@/components/MemberBadgeCard";
import { BUSINESS_CATEGORIES } from "@/data/mockData";
import { getBadgeValidThrough, toBadgeRenderData } from "@/lib/member-badge";
import { renderBadgePngBlob, triggerPngDownload } from "@/lib/member-badge-canvas";

type PortalMember = {
  id: number;
  memberId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  website: string;
  city: string;
  state: string;
  tier: string;
  badge: string;
  createdAt?: string;
  listingVisible: boolean;
  showPhone: boolean;
  showWebsite: boolean;
  showDescription: boolean;
  showLocation: boolean;
  showEmail: boolean;
};

type ProfileForm = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  website: string;
  city: string;
  state: string;
};

function emptyProfile(): ProfileForm {
  return {
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "General Business / Other",
    description: "",
    website: "",
    city: "Melissa",
    state: "TX",
  };
}

function profileFromMember(member: PortalMember): ProfileForm {
  return {
    businessName: member.businessName || "",
    ownerName: member.ownerName || "",
    email: member.email || "",
    phone: member.phone || "",
    category: member.category || "General Business / Other",
    description: member.description || "",
    website: member.website || "",
    city: member.city || "Melissa",
    state: member.state || "TX",
  };
}

export default function MemberPortalClient() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [status, setStatus] = useState<"guest" | "awaiting_code" | "membership_required" | "ok">("guest");
  const [member, setMember] = useState<PortalMember | null>(null);
  const [email, setEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [code, setCode] = useState("");
  const [debugCode, setDebugCode] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [profile, setProfile] = useState<ProfileForm>(emptyProfile());
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);

  const [visibilityBusy, setVisibilityBusy] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState("");
  const [visibilityError, setVisibilityError] = useState("");
  const [badgeBusy, setBadgeBusy] = useState<"download" | "share" | "photos" | "">("");
  const [badgeMessage, setBadgeMessage] = useState("");

  const badgeData = useMemo(
    () => (member ? toBadgeRenderData(member) : null),
    [member]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/member-portal/me", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (data?.status === "ok" && data.member) {
          setMember(data.member);
          setProfile(profileFromMember(data.member));
          setStatus("ok");
        } else if (data?.status === "membership_required") {
          setStatus("membership_required");
          if (data.email) setEmail(data.email);
        } else {
          setStatus("guest");
        }
      } catch {
        if (!cancelled) setAuthError("Could not load the member portal. Refresh and try again.");
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyMember = (next: PortalMember) => {
    setMember(next);
    setProfile(profileFromMember(next));
    setStatus("ok");
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    setAuthMessage("");
    setDebugCode("");
    try {
      const res = await fetch("/api/member-portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, memberId }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.status === "membership_required") {
        setStatus("membership_required");
        return;
      }
      if (data?.status === "logged_in" && data.member) {
        applyMember(data.member);
        return;
      }
      if (data?.status === "code_sent") {
        setStatus("awaiting_code");
        setAuthMessage(data.message || "Enter the 6-digit code we sent to your membership email.");
        if (data.debugCode) setDebugCode(data.debugCode);
        return;
      }
      setAuthError(data?.error || "Could not sign in. Try again.");
    } catch {
      setAuthError("Could not sign in. Try again.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      const res = await fetch("/api/member-portal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.status === "membership_required") {
        setStatus("membership_required");
        return;
      }
      if (data?.status === "logged_in" && data.member) {
        applyMember(data.member);
        return;
      }
      setAuthError(data?.error || "That sign-in code did not work.");
    } catch {
      setAuthError("Could not verify the sign-in code.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/member-portal/logout", { method: "POST" });
    setMember(null);
    setProfile(emptyProfile());
    setStatus("guest");
    setCode("");
    setMemberId("");
    setAuthMessage("");
    setAuthError("");
  };

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileBusy(true);
    setProfileError("");
    setProfileMessage("");
    setProfileErrors({});
    try {
      const res = await fetch("/api/member-portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setProfileErrors(data?.errors || {});
        setProfileError(data?.error || "Could not save your profile.");
        return;
      }
      if (data.member) applyMember(data.member);
      setProfileMessage(data.message || "Profile saved.");
    } catch {
      setProfileError("Could not save your profile.");
    } finally {
      setProfileBusy(false);
    }
  };

  const handleVisibilitySave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!member) return;
    setVisibilityBusy(true);
    setVisibilityError("");
    setVisibilityMessage("");
    try {
      const res = await fetch("/api/member-portal/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingVisible: member.listingVisible,
          showPhone: member.showPhone,
          showWebsite: member.showWebsite,
          showDescription: member.showDescription,
          showLocation: member.showLocation,
          showEmail: member.showEmail,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setVisibilityError(data?.error || "Could not save directory visibility.");
        return;
      }
      if (data.member) applyMember(data.member);
      setVisibilityMessage(data.message || "Directory visibility saved.");
    } catch {
      setVisibilityError("Could not save directory visibility.");
    } finally {
      setVisibilityBusy(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!badgeData) return;
    setBadgeBusy("download");
    setBadgeMessage("");
    try {
      const blob = await renderBadgePngBlob(badgeData);
      triggerPngDownload(blob, badgeData.memberId);
      setBadgeMessage("Badge PNG downloaded. On a phone, check Downloads or Photos.");
    } catch {
      setBadgeMessage("Could not create the badge image. Try opening the full-size image instead.");
    } finally {
      setBadgeBusy("");
    }
  };

  const handleShareBadge = async () => {
    if (!badgeData) return;
    setBadgeBusy("share");
    setBadgeMessage("");
    try {
      const blob = await renderBadgePngBlob(badgeData);
      const file = new File([blob], `CCM-Official-Badge-${badgeData.memberId}.png`, { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };
      if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
        await nav.share({
          files: [file],
          title: "Community Commerce Melissa badge",
          text: `${badgeData.businessName} — official member badge`,
        });
        setBadgeMessage("Share sheet opened. On iPhone and Android, choose Save Image / Add to Photos.");
        return;
      }
      triggerPngDownload(blob, badgeData.memberId);
      setBadgeMessage("Sharing is not available here. The PNG download was started instead.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setBadgeMessage("");
        return;
      }
      setBadgeMessage("Could not share the badge. Use Save to Photos or Download PNG.");
    } finally {
      setBadgeBusy("");
    }
  };

  const handleSaveToPhotos = async () => {
    setBadgeBusy("photos");
    window.location.href = "/member-portal/save-badge";
  };

  if (bootstrapping) {
    return (
      <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="Member Portal — Community Commerce Melissa" />
      <Navbar />

      <section className="bg-[#0B0E14] text-white py-12 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 font-bold text-xs uppercase tracking-widest">
            <Lock className="w-4 h-4" />
            MEMBERS ONLY
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
            MEMBER <span className="text-red-500">PORTAL</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Update your listing, control what appears in the Melissa Business Directory, and save your official member badge to your phone.
          </p>
        </div>
      </section>

      <main className="py-10 sm:py-12 bg-[#E5E9EE] flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {status !== "ok" && (
            <AuthCard
              status={status}
              email={email}
              memberId={memberId}
              code={code}
              debugCode={debugCode}
              message={authMessage}
              error={authError}
              busy={authBusy}
              onEmail={setEmail}
              onMemberId={setMemberId}
              onCode={setCode}
              onLogin={handleLogin}
              onVerify={handleVerify}
              onBack={() => {
                setStatus("guest");
                setAuthError("");
                setAuthMessage("");
                setCode("");
              }}
            />
          )}

          {status === "ok" && member && badgeData && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Signed in as</p>
                  <p className="font-outfit font-extrabold text-slate-900">{member.businessName}</p>
                  <p className="text-xs text-slate-600">{member.email} · {member.memberId}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-white border border-slate-300 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>

              <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-5">
                <div>
                  <h2 className="font-outfit font-extrabold text-xl text-slate-900 uppercase">Profile</h2>
                  <p className="text-xs text-slate-500 mt-1">These are the same member fields collected at signup and stored on your directory listing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Business name *" error={profileErrors.businessName}>
                    <input className={inputClass} value={profile.businessName} onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} required />
                  </Field>
                  <Field label="Primary contact name *" error={profileErrors.ownerName}>
                    <input className={inputClass} value={profile.ownerName} onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })} required />
                  </Field>
                  <Field label="Email address *" error={profileErrors.email}>
                    <input type="email" className={inputClass} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required />
                  </Field>
                  <Field label="Phone number *" error={profileErrors.phone}>
                    <input type="tel" className={inputClass} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} required />
                  </Field>
                  <Field label="Business category *" error={profileErrors.category}>
                    <select className={inputClass} value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })}>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Website" error={profileErrors.website}>
                    <input type="url" className={inputClass} value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} placeholder="https://yourwebsite.com" />
                  </Field>
                  <Field label="City *" error={profileErrors.city}>
                    <input className={inputClass} value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} required />
                  </Field>
                  <Field label="State *" error={profileErrors.state}>
                    <input className={inputClass} value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} required />
                  </Field>
                </div>

                <Field label={`Directory bio * (${profile.description.length}/250)`} error={profileErrors.description}>
                  <textarea
                    className={inputClass}
                    rows={3}
                    maxLength={250}
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value.slice(0, 250) })}
                    required
                  />
                </Field>

                {profileError && <Notice tone="error">{profileError}</Notice>}
                {profileMessage && <Notice tone="success">{profileMessage}</Notice>}

                <button type="submit" disabled={profileBusy} className="btn-red px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50">
                  {profileBusy ? "Saving…" : "Save profile"}
                </button>
              </form>

              <form onSubmit={handleVisibilitySave} className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-5">
                <div>
                  <h2 className="font-outfit font-extrabold text-xl text-slate-900 uppercase">Directory visibility</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Control what the public Melissa Business Directory shows for your listing. Hidden fields stay saved on your profile.
                  </p>
                </div>

                <Toggle
                  checked={member.listingVisible}
                  onChange={(listingVisible) => setMember({ ...member, listingVisible })}
                  label="Show my business on the public directory"
                  hint="Turn this off to hide your entire listing."
                  icon={member.listingVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                />
                <Toggle checked={member.showDescription} onChange={(showDescription) => setMember({ ...member, showDescription })} label="Show directory bio" />
                <Toggle checked={member.showLocation} onChange={(showLocation) => setMember({ ...member, showLocation })} label="Show city and state" />
                <Toggle checked={member.showPhone} onChange={(showPhone) => setMember({ ...member, showPhone })} label="Show phone number" />
                <Toggle checked={member.showWebsite} onChange={(showWebsite) => setMember({ ...member, showWebsite })} label="Show website" />
                <Toggle
                  checked={member.showEmail}
                  onChange={(showEmail) => setMember({ ...member, showEmail })}
                  label="Show membership email on my listing"
                  hint="Email is hidden by default and is not shown unless you opt in."
                />

                {visibilityError && <Notice tone="error">{visibilityError}</Notice>}
                {visibilityMessage && <Notice tone="success">{visibilityMessage}</Notice>}

                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" disabled={visibilityBusy} className="btn-red px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50">
                    {visibilityBusy ? "Saving…" : "Save visibility"}
                  </button>
                  <Link href="/directory" className="text-xs font-bold text-red-700 hover:text-red-800">
                    Preview public directory →
                  </Link>
                </div>
              </form>

              <section className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-5">
                <div>
                  <h2 className="font-outfit font-extrabold text-xl text-slate-900 uppercase flex items-center gap-2">
                    <Award className="w-5 h-5 text-red-600" />
                    Member badge
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Same official 2026 badge used on your receipt and welcome email. On a phone, use Save to Photos so the PNG lands in Camera Roll / Gallery.
                  </p>
                </div>

                <MemberBadgeCard
                  businessName={member.businessName}
                  memberId={member.memberId}
                  tier={member.tier}
                  ownerName={member.ownerName}
                  validThrough={getBadgeValidThrough(member.createdAt)}
                />

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveToPhotos}
                    disabled={Boolean(badgeBusy)}
                    className="btn-red px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                  >
                    {badgeBusy === "photos" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                    Save to Photos
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    disabled={Boolean(badgeBusy)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                  >
                    {badgeBusy === "download" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PNG
                  </button>
                  <button
                    type="button"
                    onClick={handleShareBadge}
                    disabled={Boolean(badgeBusy)}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                  >
                    {badgeBusy === "share" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <a
                    href="/api/member-portal/badge?download=1"
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <ImageDown className="w-4 h-4" />
                    SVG
                  </a>
                </div>

                {badgeMessage && <Notice tone="success">{badgeMessage}</Notice>}

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Save the badge into Photos</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>iPhone Safari:</strong> tap Save to Photos. When the full-size image opens, touch and hold it and choose Add to Photos / Save Image.</li>
                    <li><strong>Android Chrome:</strong> tap Download PNG or Share → Save to Photos / Gallery. The file is a high-resolution PNG, not a PDF.</li>
                    <li>Share uses the Web Share API with the PNG file when the phone supports it.</li>
                  </ul>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

const inputClass =
  "w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="block text-xs font-bold text-slate-600 uppercase">{label}</span>
      {children}
      {error ? <span className="block text-[11px] text-red-700 font-semibold">{error}</span> : null}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
  icon,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-red-700"
      />
      <span className="space-y-0.5">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
          {icon}
          {label}
        </span>
        {hint ? <span className="block text-[11px] text-slate-500">{hint}</span> : null}
      </span>
    </label>
  );
}

function Notice({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-xl px-3 py-2 text-xs font-medium ${
        tone === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
      }`}
    >
      {children}
    </div>
  );
}

function AuthCard({
  status,
  email,
  memberId,
  code,
  debugCode,
  message,
  error,
  busy,
  onEmail,
  onMemberId,
  onCode,
  onLogin,
  onVerify,
  onBack,
}: {
  status: "guest" | "awaiting_code" | "membership_required";
  email: string;
  memberId: string;
  code: string;
  debugCode: string;
  message: string;
  error: string;
  busy: boolean;
  onEmail: (value: string) => void;
  onMemberId: (value: string) => void;
  onCode: (value: string) => void;
  onLogin: (event: React.FormEvent) => void;
  onVerify: (event: React.FormEvent) => void;
  onBack: () => void;
}) {
  if (status === "membership_required") {
    return (
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-4 max-w-xl">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="font-outfit font-extrabold text-2xl text-slate-900 uppercase">Membership required</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          This portal is for active Community Commerce Melissa members only. We could not find an active membership for that email.
        </p>
        <p className="text-xs text-slate-500">
          If you just joined, wait for checkout to finish and try the email on your receipt. Guests and expired listings cannot edit directory profiles or download a member badge here.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/membership" className="btn-red px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
            View membership
          </Link>
          <button type="button" onClick={onBack} className="text-xs font-bold text-slate-700">
            Try another email
          </button>
        </div>
      </div>
    );
  }

  if (status === "awaiting_code") {
    return (
      <form onSubmit={onVerify} className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-4 max-w-xl">
        <h2 className="font-outfit font-extrabold text-2xl text-slate-900 uppercase">Enter sign-in code</h2>
        {message && <Notice tone="success">{message}</Notice>}
        {debugCode && (
          <Notice tone="success">Development code: {debugCode}</Notice>
        )}
        <Field label="Email">
          <input className={inputClass} value={email} readOnly />
        </Field>
        <Field label="6-digit code">
          <input
            className={inputClass}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => onCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
          />
        </Field>
        {error && <Notice tone="error">{error}</Notice>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy} className="btn-red px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50">
            {busy ? "Verifying…" : "Verify code"}
          </button>
          <button type="button" onClick={onBack} className="text-xs font-bold text-slate-700">
            Back
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onLogin} className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-4 max-w-xl">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-700">
        <ShieldCheck className="w-4 h-4" />
        Member sign-in
      </div>
      <h2 className="font-outfit font-extrabold text-2xl text-slate-900 uppercase">Sign in to continue</h2>
      <p className="text-sm text-slate-600">
        Use the email on your membership. If you have your Member ID from your receipt or welcome email, enter it to skip the email code.
      </p>
      <Field label="Membership email *">
        <input type="email" className={inputClass} value={email} onChange={(e) => onEmail(e.target.value)} required />
      </Field>
      <Field label="Member ID (optional)">
        <input className={inputClass} value={memberId} onChange={(e) => onMemberId(e.target.value)} placeholder="CCM-2026-XXXXXX" />
      </Field>
      {error && <Notice tone="error">{error}</Notice>}
      <button type="submit" disabled={busy} className="btn-red px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50">
        {busy ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
