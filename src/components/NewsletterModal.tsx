"use client";

import React, { useState } from "react";
import { X, Mail, CheckCircle2, Loader2, Sparkles, Bell, ArrowRight } from "lucide-react";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Community Newsletter Signup: ${formData.firstName} ${formData.lastName} (${formData.email})`,
          formType: "Newsletter Subscription",
          senderEmail: formData.email,
          senderName: `${formData.firstName} ${formData.lastName}`.trim() || formData.email,
          details: {
            "First Name": formData.firstName,
            "Last Name": formData.lastName,
            "Email Address": formData.email,
            "Business Name": formData.businessName || "N/A",
            "Subscription Date": new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }),
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit subscription.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Newsletter submission error:", err);
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData({ firstName: "", lastName: "", email: "", businessName: "" });
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F1218] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden text-white shadow-2xl relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <h3 className="text-2xl font-extrabold font-outfit uppercase tracking-tight text-white">
              You&apos;re Connected!
            </h3>

            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you for subscribing, <strong>{formData.firstName || "neighbor"}</strong>. You&apos;ll be the first to know about upcoming Melissa networking mixers, local business spotlights, and community announcements.
            </p>

            <button
              onClick={handleResetAndClose}
              className="btn-red px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 font-bold text-[10px] uppercase tracking-widest mb-2">
                <Bell className="w-3.5 h-3.5" />
                STAY CONNECTED WITH MELISSA
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase tracking-tight text-white">
                COMMUNITY NEWSLETTER
              </h2>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Get monthly event invites, business growth workshops, and community news delivered directly to your inbox. No spam, ever.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jane"
                    className="w-full bg-[#151922] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full bg-[#151922] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-[#151922] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Business / Organization Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Melissa Family Dental / Independent"
                  className="w-full bg-[#151922] border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {errorMessage && (
                <div className="bg-red-950/80 border border-red-500/50 rounded-lg p-3 text-xs text-red-200">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-red py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SUBSCRIBING...</span>
                  </>
                ) : (
                  <>
                    <span>SUBSCRIBE TO NEWSLETTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Monthly curated updates • Unsubscribe anytime</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
