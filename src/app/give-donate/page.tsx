"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LaunchBanner from "@/components/LaunchBanner";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { 
  Heart, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  PartyPopper,
  Sparkles,
  GraduationCap,
  Users,
  Briefcase,
  Gift
} from "lucide-react";

function GiveDonateContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const paidAmount = searchParams.get("amount") || "Contribution";

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("50");
  const [donorInfo, setDonorInfo] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const quickPills = ["25", "50", "100", "250", "500"];

  const getNumericAmount = (): number => {
    return Math.max(1, parseFloat(customAmount) || 50);
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const numericAmount = getNumericAmount();

    try {
      // Create Stripe Checkout Session (mode: "payment")
      const checkoutRes = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isDonation: true,
          amount: numericAmount,
          donorName: donorInfo.name,
          donorEmail: donorInfo.email,
          company: donorInfo.company,
          message: donorInfo.message,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (checkoutRes.ok && checkoutData?.url) {
        // Redirect directly to Stripe Checkout
        window.location.href = checkoutData.url;
        return;
      }

      if (checkoutData?.error) {
        setErrorMessage(checkoutData.error);
      }
    } catch (err: any) {
      console.error("Error initiating donation:", err);
      setErrorMessage(err?.message || "Failed to connect to checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentFormattedAmount = customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0
    ? `$${Number(customAmount).toLocaleString()}`
    : "$50";

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="Make a Contribution — Support Melissa, TX" />
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Success Notification Banner */}
      {isSuccess && (
        <div className="bg-emerald-900 border-b border-emerald-700 text-white py-5 px-4 text-center">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
            <PartyPopper className="w-7 h-7 text-emerald-300 shrink-0" />
            <div className="text-left">
              <h3 className="font-outfit font-black text-lg text-emerald-100 uppercase tracking-wide">
                Contribution Received! Thank You For Supporting Melissa
              </h3>
              <p className="text-xs text-emerald-200">
                Your contribution of <strong>{paidAmount}</strong> has been confirmed by Stripe. An official payment receipt has been sent to your email.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Canceled Notification Banner */}
      {isCanceled && (
        <div className="bg-amber-950 border-b border-amber-800 text-amber-200 py-3 px-4 text-center text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Checkout was canceled. Whenever you&apos;re ready, you can complete your contribution below.</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 font-bold text-xs uppercase tracking-widest">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              COMMUNITY CONTRIBUTION
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              SUPPORT OUR MISSION — <span className="text-red-500">DONATE</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every contribution makes a real difference. We are grateful for gifts of any amount to directly power Melissa community programs, student scholarships, and local business development.
            </p>
          </div>
        </div>
      </section>

      {/* Subpage Sub-navigation Bar */}
      <div className="bg-[#151922] border-b border-white/10 py-3 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <Link href="/give-donate" className="text-white border-b-2 border-red-600 pb-1">Make A Contribution</Link>
          <Link href="/volunteer" className="text-slate-400 hover:text-white transition">Volunteer</Link>
          <Link href="/contact/feedback" className="text-slate-400 hover:text-white transition">Feedback & Suggestions</Link>
          <Link href="/contact" className="text-slate-400 hover:text-white transition">Contact Us</Link>
        </div>
      </div>

      {/* Tax-Deductible Status Notice Banner */}
      <section className="py-5 bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/30 border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-slate-200 shrink-0" />
              <div>
                <div className="text-sm font-extrabold text-white uppercase tracking-wide">501(c)(3) NON-PROFIT ORGANIZATION</div>
                <div className="text-xs text-slate-200 font-medium mt-0.5">
                  Community Commerce Melissa is a 501(c)(3) non-profit organization. Your contributions are tax-deductible to the full extent of the law.
                </div>
              </div>
            </div>
            <span className="bg-white text-red-950 font-black px-4 py-1.5 rounded-full text-xs uppercase shrink-0 shadow-md">
              TAX-DEDUCTIBLE
            </span>
          </div>
        </div>
      </section>

      {/* Main Custom Donation Section */}
      <section className="py-14 bg-[#E5E9EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Donation Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-xl space-y-8">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5 text-red-700" />
                CUSTOM CONTRIBUTION
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase text-slate-900">
                CHOOSE ANY CONTRIBUTION AMOUNT
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether it&apos;s $10 or $1,000, 100% of your tax-deductible gift directly supports Melissa schools, youth scholarships, and community initiatives.
              </p>
            </div>

            <form onSubmit={handleDonateSubmit} className="space-y-6">
              
              {/* Contribution Amount Box */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-4">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider text-center">
                  ENTER YOUR CONTRIBUTION AMOUNT ($ USD) *
                </label>
                
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-2xl sm:text-3xl pointer-events-none">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="50"
                    className="w-full bg-white border-2 border-slate-300 rounded-2xl pl-10 pr-4 py-3.5 text-2xl sm:text-3xl text-slate-900 text-center font-outfit font-black focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-500/10 transition shadow-inner"
                  />
                </div>

                {/* Quick select amount shortcuts */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Quick Select:</span>
                  {quickPills.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomAmount(amt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        customAmount === amt
                          ? "bg-red-700 text-white shadow-sm"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Donor Details Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-600" />
                  DONOR INFORMATION
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Email Address (For Tax Receipt) *
                    </label>
                    <input
                      type="email"
                      required
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Company / Organization / Family Fund (Optional)
                  </label>
                  <input
                    type="text"
                    value={donorInfo.company}
                    onChange={(e) => setDonorInfo({ ...donorInfo, company: e.target.value })}
                    placeholder="Melissa Business Name or Family Fund"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Dedication or Special Program Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                    placeholder="In honor of... / Direct towards youth scholarships / General community support..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Security & Summary Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>Contribution Amount: <strong className="text-slate-900 text-sm">{currentFormattedAmount}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] uppercase">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Stripe 256-Bit SSL Encrypted</span>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-red py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CONNECTING TO STRIPE SECURE CHECKOUT...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-current" />
                    <span>DONATE {currentFormattedAmount} NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                Official 501(c)(3) tax receipt automatically generated and emailed immediately following confirmation.
              </p>
            </form>
          </div>

          {/* Where Your Gift Goes Feature Strip */}
          <div className="space-y-4">
            <h3 className="text-center text-xs font-black text-slate-600 uppercase tracking-widest">
              HOW YOUR CONTRIBUTION POWERS MELISSA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs font-outfit uppercase">Youth Scholarships</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Funding student entrepreneur grants and leadership scholarships for local Melissa youth.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs font-outfit uppercase">Business Education</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Providing practical workshops, speaker panels, and resources for local founders.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs font-outfit uppercase">Community Mixers</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connecting Melissa entrepreneurs and residents through collaborative networking evenings.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs font-outfit uppercase">Civic Stewardship</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reinvesting directly into Melissa schools, local non-profits, and community causes.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}

export default function GiveDonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>}>
      <GiveDonateContent />
    </Suspense>
  );
}
