"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, ShieldCheck, Sparkles, CreditCard, Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { BUSINESS_CATEGORIES } from "@/data/mockData";
import TermsAgreement from "@/components/TermsAgreement";

const buildTimePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: string;
}

export default function MemberModal({ isOpen, onClose, defaultTier = "Community Partner ($390 1st Yr • Renews $490/yr)" }: MemberModalProps) {
  const [selectedTier, setSelectedTier] = useState(defaultTier);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "Real Estate & Property Management",
    description: "",
    website: "",
    city: "Melissa",
    state: "TX",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(
    () => (buildTimePublishableKey ? loadStripe(buildTimePublishableKey) : null)
  );
  const [stripeConfigLoaded, setStripeConfigLoaded] = useState(Boolean(buildTimePublishableKey));
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (defaultTier) {
      setSelectedTier(defaultTier);
    }
    if (!isOpen) {
      setClientSecret(null);
      setIsSubmitted(false);
      setErrorMessage("");
      setAgreedToTerms(false);
    }
  }, [defaultTier, isOpen]);

  useEffect(() => {
    if (stripeConfigLoaded) return;

    let cancelled = false;
    fetch("/api/stripe-config")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        }
      })
      .catch(() => {
        // Hosted Stripe Checkout still works without a client publishable key.
      })
      .finally(() => {
        if (!cancelled) setStripeConfigLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [stripeConfigLoaded]);

  if (!isOpen) return null;

  const isCorporate = selectedTier.toLowerCase().includes("corporate") || selectedTier.toLowerCase().includes("sponsorship");
  const amountDisplay = isCorporate ? "Custom" : "$390";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setErrorMessage("Please agree to the Terms of Service to continue.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. If corporate sponsorship: send inquiry email & show confirmation
      if (isCorporate) {
        const inquiryRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `Corporate Sponsorship Inquiry: ${formData.businessName || formData.ownerName}`,
            formType: "Corporate Sponsorship Inquiry",
            senderEmail: formData.email,
            senderName: formData.ownerName,
            details: {
              "Selected Tier": selectedTier,
              "Business Name": formData.businessName,
              "Owner / Contact Name": formData.ownerName,
              "Email Address": formData.email,
              "Phone Number": formData.phone || "N/A",
              "Business Category": formData.category,
              "Company Bio / Description": formData.description || "N/A",
              "City": formData.city || "Melissa",
              "State": formData.state || "TX",
              "Website": formData.website || "N/A",
              "Additional Notes": formData.notes || "None"
            }
          })
        });

        if (!inquiryRes.ok) {
          const inquiryData = await inquiryRes.json().catch(() => ({}));
          setErrorMessage(inquiryData.error || "Failed to submit. Please try again.");
          return;
        }

        setIsSubmitted(true);
        return;
      }

      // 2. For paid Community Partner tier ($390): initiate Stripe Checkout
      const checkoutRes = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTier,
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          description: formData.description,
          website: formData.website,
          city: formData.city || "Melissa",
          state: formData.state || "TX",
          notes: formData.notes,
          uiMode: stripePromise ? "embedded" : "hosted",
        }),
      });

      const checkoutData = await checkoutRes.json();

      // Case A: In-page embedded checkout available
      if (checkoutRes.ok && checkoutData?.clientSecret && stripePromise) {
        setClientSecret(checkoutData.clientSecret);
        return;
      }

      // Case B: Fallback to hosted redirect
      if (checkoutRes.ok && checkoutData?.url) {
        window.location.href = checkoutData.url;
        return;
      }

      if (checkoutData?.error) {
        setErrorMessage(checkoutData.error);
      }
    } catch (err: any) {
      console.error("Error submitting member application:", err);
      setErrorMessage(err?.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F1218] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white shadow-2xl relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <CheckCircle2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-extrabold font-outfit uppercase tracking-tight">Application Received</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you for supporting <strong>Community Commerce Melissa</strong>. Our team has received your application for <strong>{selectedTier}</strong> and will follow up with your onboarding packet and invoice shortly.
            </p>
            <button
              onClick={onClose}
              className="btn-red px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider mt-4"
            >
              Done
            </button>
          </div>
        ) : clientSecret ? (
          /* Embedded Stripe Checkout Flow */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <button
                onClick={() => setClientSecret(null)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Information</span>
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            <div className="bg-[#151922] p-3 rounded-lg border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Membership: </span>
                <strong className="text-white">{selectedTier}</strong>
              </div>
              <div className="text-sm font-black text-red-400">
                {amountDisplay}/yr
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Membership dues are non-refundable under our{" "}
              <a href="/terms#refunds" target="_blank" rel="noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-2">
                Terms of Service
              </a>
              .
            </p>

            <div className="bg-white rounded-xl overflow-hidden min-h-[420px] p-2">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout className="w-full" />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        ) : (
          /* Application Form Flow */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 font-bold text-[10px] uppercase tracking-widest mb-2">
                <Sparkles className="w-3 h-3" />
                {isCorporate ? "CORPORATE SPONSORSHIP" : "MEMBERSHIP APPLICATION"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase tracking-tight text-white">
                {isCorporate ? "PARTNER WITH COMMUNITY COMMERCE" : "JOIN COMMUNITY COMMERCE"}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {isCorporate
                  ? "Submit your sponsorship inquiry below. Our executive team will tailor a custom partnership proposal aligning with your community vision."
                  : "Complete your details below to activate your member listing, digital badge, and local benefits."}
              </p>
            </div>

            {/* Special Promo Banner (Shown only for Community Partner, hidden for Corporate Sponsorship) */}
            {!isCorporate && (
              <div className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 border border-red-700/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Community Partner Special: <strong>$390 for Year 1</strong> <span className="text-red-200 bg-black/40 px-1.5 py-0.5 rounded border border-red-500/30 font-bold ml-1">Renews at $490/yr</span></span>
                </div>
                <span className="bg-white text-red-950 font-black px-2 py-0.5 rounded-full text-[10px] uppercase shadow">
                  SAVE $100 YR 1
                </span>
              </div>
            )}

            {/* Tier Selector Tabs (2 Options: Community Partner or Corporate Sponsorship) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedTier("Community Partner ($390 1st Yr • Renews $490/yr)")}
                className={`p-3.5 rounded-xl border text-center transition relative ${
                  !isCorporate
                    ? "bg-gradient-to-br from-red-950 to-red-900 border-[#A81C24] text-white font-bold shadow-lg ring-2 ring-red-500/50"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white text-red-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                  SAVE $100
                </span>
                <div className="text-xs font-bold text-slate-200 mt-1">1. Community Partner</div>
                <div className="text-base font-extrabold text-white">$390 <span className="text-red-300 text-xs font-normal">1st yr</span></div>
                <div className="text-[10px] text-red-200 font-semibold">renews $490/yr</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier("Corporate & Community Sponsorship")}
                className={`p-3.5 rounded-xl border text-center transition ${
                  isCorporate
                    ? "bg-slate-800 border-slate-400 text-white font-bold ring-2 ring-slate-400/40"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold text-slate-300 mt-1">2. Corporate Sponsorship</div>
                <div className="text-sm font-extrabold text-white mt-1">Custom Partnership</div>
                <div className="text-[10px] text-slate-400">Tailored packages & pricing</div>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Melissa Family Dental"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Primary Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="First & Last Name"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@business.com"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(972) 837-0000"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Business Category / Industry *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* City and State for Directory Listing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">City (Directory Listing) *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Melissa"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="TX"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* 1-2 Sentences Company Bio / Description for Directory (Shown for Members & Partners, Hidden for Corporate Sponsorship) */}
              {!isCorporate && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase">
                      Company Bio for Business Directory (1–2 Sentences) *
                    </label>
                    <span className={`text-[10px] font-mono font-bold ${
                      formData.description.length > 220 ? "text-amber-400" : "text-slate-400"
                    }`}>
                      {formData.description.length}/250 chars
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    required
                    maxLength={250}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 250) })}
                    placeholder="Tell customers what your business provides (e.g. 'Premier residential roofing, repairs, and storm restoration serving Melissa families since 2019.')"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Brief 1–2 sentence summary displayed on your official directory card (max 250 characters).
                  </p>
                </div>
              )}

              {/* Sponsorship Goals & Notes (Shown for Corporate Sponsorship) */}
              {isCorporate && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Sponsorship Goals / Community Vision (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about your organization's community engagement goals, preferred event initiatives, or desired partnership scope..."
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              {/* Payment & Sponsorship Tier Info */}
              {!isCorporate ? (
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-300" />
                    <span>Selected Level: <strong className="text-white">{selectedTier}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Annual Auto-Renewing Subscription</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Selected Tier: <strong className="text-white">Corporate & Community Sponsorship</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-bold">
                    Custom Partnership Inquiry
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-950/80 border border-red-500/50 rounded-lg p-3 text-xs text-red-200">
                  {errorMessage}
                </div>
              )}

              <TermsAgreement
                id="member-agree-terms"
                checked={agreedToTerms}
                onChange={setAgreedToTerms}
                includeRefund
              />

              {/* Submit CTA */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !agreedToTerms}
                  className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition btn-red disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>PROCESSING...</span>
                    </>
                  ) : isCorporate ? (
                    <>
                      <span>SUBMIT CORPORATE SPONSORSHIP APPLICATION</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>PROCEED TO SECURE CHECKOUT ({amountDisplay})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
