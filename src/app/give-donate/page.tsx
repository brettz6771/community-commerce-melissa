"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
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
  Sparkles
} from "lucide-react";

function GiveDonateContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const paidAmount = searchParams.get("amount") || "Contribution";
  const isTestMode = searchParams.get("test") === "true";

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("$100");
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const donationTiers = [
    ...(isTestMode ? [{ amount: "$1", title: "🧪 Live Test Contribution", desc: "Admin test mode: test full live Stripe one-time donation flow with $1.00." }] : []),
    { amount: "$50", title: "Community Supporter", desc: "Sponsors local business networking refreshments & educational workshop materials." },
    { amount: "$100", title: "Youth Scholarship Patron", desc: "Funds student entrepreneur grants & Melissa High School Cardinal student scholarships." },
    { amount: "$250", title: "Economic Catalyst", desc: "Powers local merchant directory spotlights, business features & community mixers." },
    { amount: "Custom", title: "Custom Contribution", desc: "Specify any contribution amount to directly power Melissa community initiatives." }
  ];

  const getNumericAmount = (): number => {
    if (selectedAmount === "Custom") {
      return Math.max(1, parseFloat(customAmount) || 25);
    }
    return Math.max(1, parseFloat(selectedAmount.replace("$", "")) || 100);
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const numericAmount = getNumericAmount();

    try {
      // 1. Send notification email & log to database
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Contribution Intent: $${numericAmount} from ${donorInfo.name || "Generous Supporter"}`,
          formType: "Donation Form Submission",
          senderEmail: donorInfo.email,
          senderName: donorInfo.name || "Anonymous Supporter",
          details: {
            "Contribution Amount": `$${numericAmount}`,
            "Donor Name": donorInfo.name,
            "Email Address": donorInfo.email,
            "Company": donorInfo.company || "N/A",
            "Dedication / Message": donorInfo.message || "None",
            "Is Test Mode": isTestMode ? "Yes" : "No"
          }
        })
      }).catch((err) => console.warn("Email warning:", err));

      // 2. Create Stripe Checkout Session (mode: "payment")
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
          isTest: isTestMode,
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

  const displayButtonAmount = selectedAmount === "Custom" 
    ? (customAmount ? `$${customAmount}` : "Custom Amount")
    : selectedAmount;

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="Give & Donate — Support Melissa, TX" />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Admin Test Mode Banner */}
      {isTestMode && (
        <div className="bg-purple-950 text-purple-200 text-xs py-2.5 px-4 border-b border-purple-800 text-center flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded shadow">
              ADMIN TEST MODE
            </span>
            <span className="font-medium">
              Live Stripe Testing Active: Test one-time contribution flow with a <strong>$1.00 one-time donation</strong>.
            </span>
          </div>
        </div>
      )}

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
              501(c)(3) COMMUNITY CONTRIBUTION
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              SUPPORT OUR MISSION — <span className="text-red-500">DONATE</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Invest directly in Melissa&apos;s economic growth, youth leadership scholarships, and local small business support programs.
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

      {/* Non-profit 501(c)(3) Status Notice Banner */}
      <section className="py-5 bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/30 border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-slate-200 shrink-0" />
              <div>
                <div className="text-sm font-extrabold text-white uppercase tracking-wide">501(c)(3) NON-PROFIT ORGANIZATION</div>
                <div className="text-xs text-slate-200 font-medium mt-0.5">
                  Community Commerce Melissa is an official 501(c)(3) non-profit organization. Contributions directly fund local community programs.
                </div>
              </div>
            </div>
            <span className="bg-white text-red-950 font-black px-4 py-1.5 rounded-full text-xs uppercase shrink-0 shadow-md">
              TAX-DEDUCTIBLE
            </span>
          </div>
        </div>
      </section>

      {/* Main Donation Section */}
      <section className="py-16 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Donation Tiers Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 ${donationTiers.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-6`}>
            {donationTiers.map((tier, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedAmount(tier.amount)}
                className={`bg-white rounded-2xl p-6 border transition cursor-pointer flex flex-col justify-between ${
                  selectedAmount === tier.amount
                    ? "border-red-600 ring-2 ring-red-600/50 shadow-xl"
                    : "border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="text-3xl font-black font-outfit text-slate-900">{tier.amount}</div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase font-outfit">{tier.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{tier.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className={selectedAmount === tier.amount ? "text-red-700 font-black" : "text-slate-400"}>
                    {selectedAmount === tier.amount ? "Selected Tier ✓" : "Select Level"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Donation Form Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded text-xs uppercase mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                ONLINE CONTRIBUTION FORM
              </div>
              <h2 className="text-2xl font-extrabold font-outfit uppercase text-slate-900">
                MAKE A CONTRIBUTION
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Selected Contribution Level: <strong className="text-red-700">{displayButtonAmount}</strong>
              </p>
            </div>

            <form onSubmit={handleDonateSubmit} className="space-y-4">
              {selectedAmount === "Custom" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Custom Amount ($ USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white font-bold"
                    />
                  </div>
                </div>
              )}

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
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Email Address (For Receipt) *
                  </label>
                  <input
                    type="email"
                    required
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={donorInfo.company}
                  onChange={(e) => setDonorInfo({ ...donorInfo, company: e.target.value })}
                  placeholder="Melissa Business Name or Family Fund"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Dedicated Message / Program Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={donorInfo.message}
                  onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                  placeholder="In honor of... / Direct towards youth leadership scholarships..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>One-Time Contribution: <strong className="text-slate-900">{displayButtonAmount}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Stripe 256-Bit SSL Encrypted</span>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-red py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CONNECTING TO STRIPE SECURE CHECKOUT...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>PROCEED TO DONATION CHECKOUT ({displayButtonAmount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
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
