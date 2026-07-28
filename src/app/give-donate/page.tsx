"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import Link from "next/link";
import { 
  Heart, 
  DollarSign, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Sparkles,
  Lock
} from "lucide-react";

export default function GiveDonatePage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("$100");
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({ name: "", email: "", company: "", message: "" });
  const [isDonated, setIsDonated] = useState(false);

  const donationTiers = [
    { amount: "$50", title: "Community Supporter", desc: "Sponsors local business networking refreshments & workshop guides." },
    { amount: "$100", title: "Youth Scholarship Patron", desc: "Funds student entrepreneur grants & Melissa High School Cardinal scholarships." },
    { amount: "$250", title: "Economic Catalyst", desc: "Powers local merchant directory subsidies & digital marketing spotlights." },
    { amount: "Custom", title: "Custom Contribution", desc: "Specify any donation amount to directly fund local Melissa initiatives." }
  ];

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDonated(true);
  };

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              GIVE & DONATE PROGRAM
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              SUPPORT OUR MISSION — <span className="text-slate-200">GIVE / DONATE</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Invest directly in Melissa&apos;s economic growth, youth scholarships, and small business support programs.
            </p>
          </div>
        </div>
      </section>

      {/* Subpage Sub-navigation Bar */}
      <div className="bg-[#151922] border-b border-white/10 py-3 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <Link href="/contact" className="text-slate-400 hover:text-white transition">Contact Us</Link>
          <Link href="/volunteer" className="text-slate-400 hover:text-white transition">Volunteer</Link>
          <Link href="/give-donate" className="text-white border-b-2 border-red-600 pb-1">Give / Donate</Link>
        </div>
      </div>

      {/* Non-profit 501(c) Status Notice Banner */}
      <section className="py-6 bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/30 border border-white/20 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-slate-200 shrink-0" />
              <div>
                <div className="text-sm font-extrabold text-white uppercase tracking-wide">ORGANIZATION STATUS NOTICE</div>
                <div className="text-xs text-slate-200 font-medium mt-0.5">
                  We are currently in the process of becoming a 501(c)(3) non-profit organization.
                </div>
              </div>
            </div>
            <span className="bg-slate-200 text-red-950 font-bold px-3 py-1 rounded-full text-xs uppercase shrink-0 shadow-md">
              501(c)(3) Pending
            </span>
          </div>
        </div>
      </section>

      {/* Main Donation Section */}
      <section className="py-16 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Donation Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTiers.map((tier, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedAmount(tier.amount)}
                className={`bg-white rounded-2xl p-6 border transition cursor-pointer flex flex-col justify-between ${
                  selectedAmount === tier.amount
                    ? "border-red-600 ring-2 ring-red-600/50 shadow-xl"
                    : "border-slate-200 shadow-md hover:shadow-lg"
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
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded text-xs uppercase mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                ONLINE CONTRIBUTION FORM
              </div>
              <h2 className="text-2xl font-extrabold font-outfit uppercase text-slate-900">
                MAKE A CONTRIBUTION
              </h2>
              <p className="text-xs text-slate-500">
                Selected Contribution Level: <strong className="text-red-700">{selectedAmount}</strong>
              </p>
            </div>

            {isDonated ? (
              <div className="bg-emerald-950/20 border border-emerald-500/40 p-6 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-bold text-slate-900">Thank You For Your Support!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you <strong className="text-slate-900">{donorInfo.name || "Generous Supporter"}</strong>! Your contribution helps us empower Melissa entrepreneurs and students. A confirmation email has been dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-4">
                {selectedAmount === "Custom" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Custom Amount ($) *</label>
                    <input
                      type="number"
                      required
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600 font-bold"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Organization (Optional)</label>
                  <input
                    type="text"
                    value={donorInfo.company}
                    onChange={(e) => setDonorInfo({ ...donorInfo, company: e.target.value })}
                    placeholder="Melissa Business Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dedicated Message / Program Note</label>
                  <textarea
                    rows={2}
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                    placeholder="In honor of... / Direct towards youth scholarships..."
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Secure 256-Bit SSL Encrypted Contribution</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-red py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  COMPLETE CONTRIBUTION ({selectedAmount === "Custom" ? `$${customAmount || "0"}` : selectedAmount})
                </button>
              </form>
            )}
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
