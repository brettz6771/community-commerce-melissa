"use client";

import React from "react";
import { 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Handshake
} from "lucide-react";
import Link from "next/link";

interface MembershipCTASectionProps {
  onOpenJoinModal?: (tier?: string) => void;
}

export default function MembershipCTASection({ onOpenJoinModal }: MembershipCTASectionProps) {
  const handlePartnerClick = () => {
    if (onOpenJoinModal) {
      onOpenJoinModal("Community Partner ($390 1st Yr • Renews $490/yr)");
    }
  };

  const handleSponsorClick = () => {
    if (onOpenJoinModal) {
      onOpenJoinModal("Corporate & Community Sponsorship");
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-[#0B0E14] via-[#141822] to-[#450a0a] text-white py-10 sm:py-12 border-t border-b border-white/10 relative overflow-hidden shadow-2xl">
      
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            MEMBERSHIP & PARTNERSHIPS
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-outfit uppercase tracking-tight text-white leading-tight">
            JOIN COMMUNITY COMMERCE <span className="text-red-500">MELISSA</span>
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Gain verified member credentials, live directory ranking, business networking, and local community exposure.
          </p>
        </div>

        {/* 2 Action Cards Grid: Community Partner (Membership) on Left & Corporate Sponsorship on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 items-stretch">
          
          {/* 1. Primary Membership Level: Community Partner */}
          <div className="bg-gradient-to-b from-[#1C222E] to-[#121620] rounded-2xl p-5 sm:p-6 border-2 border-red-600 shadow-2xl flex flex-col justify-between relative ring-2 ring-red-500/30 hover:scale-[1.01] transition duration-300">
            {/* Top Tag */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-red-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 whitespace-nowrap">
              <Star className="w-3 h-3 text-red-600 fill-red-600" />
              <span>OFFICIAL MEMBERSHIP • SAVE $100</span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                    BUSINESS MEMBERSHIP
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold font-outfit text-white uppercase mt-0.5">
                    COMMUNITY PARTNER
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black font-outfit text-white">
                    $390
                  </div>
                  <div className="text-[10px] text-red-300 font-bold">1st Yr (Renews $490/yr)</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                All-inclusive membership with enhanced directory ranking, priority spotlights, digital member badge, and exclusive local business discounts.
              </p>

              <ul className="space-y-2 text-xs text-slate-200">
                {[
                  "Enhanced ranking in Live Business Directory + website links",
                  "Official Certified Partner digital badge & framed certificate",
                  "Priority business spotlights & collaborative campaigns",
                  "Special discounts from participating local businesses",
                  "Access to monthly networking mixers & events"
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-white/10">
              {onOpenJoinModal ? (
                <button
                  onClick={handlePartnerClick}
                  className="w-full btn-red py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition"
                >
                  <span>Join As Community Partner ($390)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href="/membership"
                  className="w-full btn-red py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition text-center"
                >
                  <span>Join As Community Partner ($390)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* 2. Corporate & Community Sponsorship */}
          <div className="bg-[#151922] rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl flex flex-col justify-between hover:border-white/30 transition duration-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    CUSTOM SPONSORSHIP
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold font-outfit text-white uppercase mt-0.5">
                    CORPORATE PARTNERSHIP
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black font-outfit text-slate-200">
                    Custom
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Tailored Scope</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Designed for regional employers, corporations, healthcare providers, and developers wanting substantial community leadership and visibility.
              </p>

              <ul className="space-y-2 text-xs text-slate-200">
                {[
                  "Presenting sponsorships & major program underwriting",
                  "Executive speaking & panel presentation opportunities",
                  "Prominent website, directory & event signage logo placement",
                  "Community-impact initiatives & employee engagement"
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-white/10">
              {onOpenJoinModal ? (
                <button
                  onClick={handleSponsorClick}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/20 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  <span>Inquire About Sponsorship</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/20 py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition text-center"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  <span>Inquire About Sponsorship</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Compact Bottom Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>Official 501(c)(3) Non-Profit • Tax-Deductible Dues</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              href="/membership"
              className="text-red-400 hover:text-red-300 font-bold transition"
            >
              Explore Full Membership Details →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
