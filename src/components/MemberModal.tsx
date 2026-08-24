"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, ShieldCheck, Sparkles, CreditCard, Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

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
    category: "Real Estate",
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

  useEffect(() => {
    if (defaultTier) {
      setSelectedTier(defaultTier);
    }
    if (!isOpen) {
      setClientSecret(null);
      setIsSubmitted(false);
      setErrorMessage("");
    }
  }, [defaultTier, isOpen]);

  if (!isOpen) return null;

  const isCorporate = selectedTier.toLowerCase().includes("corporate") || selectedTier.toLowerCase().includes("sponsorship");
  const isPartner = selectedTier.toLowerCase().includes("partner");
  const amountDisplay = isCorporate ? "Custom" : isPartner ? "$390" : "$350";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. If corporate sponsorship: send inquiry email & show confirmation
      if (isCorporate) {
        await fetch("/api/send-email", {
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

        setIsSubmitted(true);
        return;
      }

      // 2. For paid tiers (Member $350, Partner $390): initiate Stripe Checkout
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
                MEMBERSHIP APPLICATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase tracking-tight text-white">
                JOIN COMMUNITY COMMERCE
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Complete your details below to activate your member listing, digital badge, and local benefits.
              </p>
            </div>

            {/* Special Promo Banner */}
            <div className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 border border-red-700/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-slate-300 shrink-0" />
                <span>Community Partner Special: <strong>$390 for Year 1</strong> <span className="text-red-200 bg-black/40 px-1.5 py-0.5 rounded border border-red-500/30 font-bold ml-1">Renews at $490/yr</span></span>
              </div>
              <span className="bg-white text-red-950 font-black px-2 py-0.5 rounded-full text-[10px] uppercase shadow">
                SAVE $100 YR 1
              </span>
            </div>

            {/* Tier Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTier("Community Member ($350/yr)")}
                className={`p-3 rounded-lg border text-center transition ${
                  selectedTier.includes("Community Member")
                    ? "bg-[#A81C24]/30 border-[#A81C24] text-white font-bold ring-2 ring-red-500/40"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-[11px] font-bold">1. Community Member</div>
                <div className="text-sm font-extrabold text-white mt-0.5">$350/yr</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier("Community Partner ($390 1st Yr • Renews $490/yr)")}
                className={`p-3 rounded-lg border text-center transition relative ${
                  selectedTier.includes("Community Partner")
                    ? "bg-gradient-to-br from-red-950 to-red-900 border-[#A81C24] text-white font-bold shadow-lg ring-2 ring-red-500/50"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white text-red-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                  SAVE $100
                </span>
                <div className="text-[11px] font-bold text-slate-200 mt-1">2. Partner</div>
                <div className="text-sm font-extrabold text-white">$390 <span className="text-red-300 text-[10px] font-normal">1st yr</span></div>
                <div className="text-[9px] text-red-200 font-semibold">renews $490/yr</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier("Corporate & Community Sponsorship")}
                className={`p-3 rounded-lg border text-center transition ${
                  selectedTier.includes("Corporate") || selectedTier.includes("Sponsorship")
                    ? "bg-slate-800 border-slate-400 text-white font-bold ring-2 ring-slate-400/40"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-[11px] font-bold">3. Sponsorship</div>
                <div className="text-xs font-extrabold text-slate-200 mt-1">Custom / Inquire</div>
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
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Business Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Home Services">Home Services</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Hospitality & Dining">Hospitality & Dining</option>
                    <option value="Legal & Financial">Legal & Financial</option>
                    <option value="Daycare & Retail">Daycare & Retail</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="General Business">General Business</option>
                    <option value="Other">Other</option>
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

              {/* 1-2 Sentences Company Bio / Description for Directory */}
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

              {/* Payment simulation info */}
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

              {errorMessage && (
                <div className="bg-red-950/80 border border-red-500/50 rounded-lg p-3 text-xs text-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition btn-red"
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
