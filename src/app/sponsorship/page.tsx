"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { MOCK_SPONSORSHIPS } from "@/data/mockData";
import { 
  Star, 
  Award, 
  CheckCircle2, 
  Download, 
  Send, 
  ShieldCheck,
  Building2,
  Sparkles
} from "lucide-react";

export default function SponsorshipPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", tier: "Community Champion (Platinum)" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Star className="w-4 h-4" />
              SPONSORSHIP CENTER
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              PARTNER WITH <span className="text-amber-400">PURPOSE</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Elevate your corporate brand, champion local business growth, and reach thousands of Melissa residents through targeted sponsorship packages.
            </p>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold font-outfit text-slate-900 uppercase">
              2026 SPONSORSHIP PACKAGES
            </h2>
            <p className="text-xs text-slate-500">Comprehensive brand exposure across web, print, events, and community initiatives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {MOCK_SPONSORSHIPS.map((sp) => (
              <div
                key={sp.id}
                className={`bg-white rounded-2xl border ${
                  sp.popular ? "border-red-600 ring-2 ring-red-600/40 shadow-2xl scale-105" : "border-slate-200 shadow-lg"
                } p-6 md:p-8 flex flex-col justify-between relative`}
              >
                {sp.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-700 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow tracking-wider">
                    MOST POPULAR TITLE SPONSOR
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold font-outfit text-slate-900">
                      {sp.name}
                    </h3>
                    <div className="text-3xl font-black font-outfit text-red-700 mt-2">
                      {sp.price} <span className="text-xs text-slate-500 font-normal">/{sp.billing}</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Package Benefits:</div>
                    <ul className="space-y-2.5">
                      {sp.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <a
                    href="#sponsor-form"
                    className="w-full btn-red py-3 rounded-lg font-bold text-xs uppercase tracking-wider block text-center shadow"
                  >
                    BECOME A {sp.name.split(" ")[0]} SPONSOR
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Sponsor Form & Download Section */}
      <section id="sponsor-form" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B0E14] text-white rounded-2xl p-8 md:p-10 shadow-2xl border border-slate-800 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h3 className="text-2xl font-extrabold font-outfit text-white uppercase">BECOME A SPONSOR INQUIRY</h3>
                <p className="text-xs text-amber-400">Lock in your corporate sponsorship tier for 2026</p>
              </div>

              <button
                onClick={() => alert("Sponsorship Deck Guide (.PDF) Downloaded!")}
                className="btn-gold-outline px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Sponsor Guide (.PDF)
              </button>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-6 rounded-xl text-center space-y-3">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Sponsorship Inquiry Received!</h4>
                <p className="text-xs text-slate-300">
                  Thank you <strong className="text-amber-400">{formData.name}</strong> ({formData.company}). Our executive board will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Red Feather Golf Club"
                      className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
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
                      placeholder="jane@company.com"
                      className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sponsorship Level *</label>
                    <select
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Community Champion (Platinum)">Community Champion (Platinum) - $5,000</option>
                      <option value="Commerce Partner (Gold)">Commerce Partner (Gold) - $2,500</option>
                      <option value="Community Supporter (Silver)">Community Supporter (Silver) - $1,000</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-red py-3 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  SUBMIT SPONSORSHIP INQUIRY
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
