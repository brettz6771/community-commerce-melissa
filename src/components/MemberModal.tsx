"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Sparkles, CreditCard, Lock, Star, Users, Handshake } from "lucide-react";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: string;
}

export default function MemberModal({ isOpen, onClose, defaultTier = "Community Partner ($399/yr)" }: MemberModalProps) {
  const [selectedTier, setSelectedTier] = useState(defaultTier);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "Real Estate",
    website: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Member Application: ${formData.businessName || formData.ownerName} (${selectedTier})`,
          formType: "Member Application Form",
          senderEmail: formData.email,
          senderName: formData.ownerName,
          details: {
            "Selected Tier": selectedTier,
            "Business Name": formData.businessName,
            "Owner / Contact Name": formData.ownerName,
            "Email Address": formData.email,
            "Phone Number": formData.phone || "N/A",
            "Business Category": formData.category,
            "Website": formData.website || "N/A",
            "Additional Notes": formData.notes || "None"
          }
        })
      });
    } catch (err) {
      console.error("Error submitting member application:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F1218] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white shadow-2xl relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold font-outfit text-white">
              Welcome to Community Commerce Melissa!
            </h3>

            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you for registering <strong className="text-slate-200">{formData.businessName || "your business"}</strong> for <span className="text-white font-bold">{selectedTier}</span>.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="font-bold text-slate-200">Next Steps:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Check your email inbox for your Welcome Packet & Member Toolkit.</li>
                <li>Our team will verify and activate your business directory profile.</li>
                <li>You will receive calendar invites for upcoming member networking events.</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="btn-red px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider inline-block mt-4"
            >
              DONE
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                JOIN COMMUNITY COMMERCE MELISSA
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
                Member Application & Registration
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Select your membership tier and connect your business to Melissa&apos;s commerce network.
              </p>
            </div>

            {/* Promo Alert inside modal */}
            <div className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 border border-red-700/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-slate-300 shrink-0" />
                <span>Community Partner Special: <strong>$399/yr</strong> <span className="line-through text-red-200 bg-black/40 px-1.5 py-0.5 rounded border border-red-500/30 font-bold">$490 Regular</span></span>
              </div>
              <span className="bg-white text-red-950 font-black px-2 py-0.5 rounded-full text-[10px] uppercase shadow">
                SAVE $91 LIMITED TIME
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
                onClick={() => setSelectedTier("Community Partner ($399/yr)")}
                className={`p-3 rounded-lg border text-center transition relative ${
                  selectedTier.includes("Community Partner")
                    ? "bg-gradient-to-br from-red-950 to-red-900 border-[#A81C24] text-white font-bold shadow-lg ring-2 ring-red-500/50"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white text-red-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                  SAVE $91 SALE
                </span>
                <div className="text-[11px] font-bold text-slate-200 mt-1">2. Community Partner</div>
                <div className="text-sm font-extrabold text-white">$399 <span className="line-through text-red-300 text-[10px] font-normal">$490</span></div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier("Corporate & Community Sponsorship")}
                className={`p-3 rounded-lg border text-center transition ${
                  selectedTier.includes("Corporate")
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
                    placeholder="e.g. Melissa Family Dentistry"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Contact Name *</label>
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

              {/* Payment simulation info */}
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-300" />
                  <span>Selected Level: <strong className="text-white">{selectedTier}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>256-Bit SSL Secure</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-red py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "PROCESSING..." : "SUBMIT APPLICATION"}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
