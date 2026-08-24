"use client";

import React from "react";
import { 
  Award, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Users, 
  ShieldCheck,
  Globe,
  Tag
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

  const handleMemberClick = () => {
    if (onOpenJoinModal) {
      onOpenJoinModal("Community Member ($350/yr)");
    }
  };

  const handleSponsorClick = () => {
    if (onOpenJoinModal) {
      onOpenJoinModal("Corporate & Community Sponsorship");
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#E5E9EE]">
      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main Banner Container */}
        <div className="bg-gradient-to-br from-[#0B0E14] via-[#151922] to-red-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-red-700/40 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              JOIN COMMUNITY COMMERCE MELISSA
            </div>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-outfit uppercase tracking-tight text-white leading-tight">
              GROW YOUR REACH. <span className="text-red-500">CONNECT LOCALLY.</span> GET NOTICED.
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Choose your membership level to receive verified member credentials, instant publishing to the live Melissa Business Directory, networking mixers, and community recognition.
            </p>
          </div>

          {/* 2 Featured Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-10 max-w-5xl mx-auto relative z-10 items-stretch">
            
            {/* 1. Community Partner (Hero Deal) */}
            <div className="bg-gradient-to-b from-[#1C222E] to-[#121620] rounded-2xl p-6 sm:p-8 border-2 border-red-600 shadow-2xl flex flex-col justify-between relative ring-2 ring-red-500/30 transform hover:-translate-y-1 transition duration-300">
              {/* Top Banner Tag */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-red-950 text-[10px] sm:text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <Star className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span>MOST POPULAR • SAVE $100 1ST YEAR</span>
              </div>

              <div className="space-y-5 pt-2">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                      ENHANCED VISIBILITY TIER
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-white uppercase mt-0.5">
                      COMMUNITY PARTNER
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black font-outfit text-white">
                      $390
                    </div>
                    <div className="text-[11px] text-red-300 font-bold">1st Year Special</div>
                    <div className="text-[10px] text-slate-400">renews $490/yr</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Maximum visibility package for established businesses looking for directory spotlights, networking leadership, and special member discounts.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200">
                  {[
                    "Enhanced listing in Live Melissa Business Directory",
                    "Official Certified Community Partner digital badge & toolkit",
                    "Printable 8.5\" × 11\" framed membership certificate",
                    "Priority business spotlight opportunities & news releases",
                    "Exclusive member-to-member discounts & B2B promotions",
                    "Access to all monthly networking events & workshops"
                  ].map((perk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                {onOpenJoinModal ? (
                  <button
                    onClick={handlePartnerClick}
                    className="w-full btn-red py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                  >
                    <span>Claim $390 Partner Deal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/membership"
                    className="w-full btn-red py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition text-center"
                  >
                    <span>Claim $390 Partner Deal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* 2. Community Member (Standard Small Business Tier) */}
            <div className="bg-[#151922] rounded-2xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col justify-between relative hover:border-white/30 transition duration-300">
              <div className="space-y-5 pt-2">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      STANDARD BUSINESS TIER
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-white uppercase mt-0.5">
                      COMMUNITY MEMBER
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black font-outfit text-white">
                      $350
                    </div>
                    <div className="text-[11px] text-slate-400 font-bold">Annual Rate</div>
                    <div className="text-[10px] text-slate-400">auto-renews annually</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Ideal for small businesses, independent professionals, and local entrepreneurs wanting connection and community participation.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200">
                  {[
                    "Standard listing in Live Melissa Business Directory",
                    "Official Community Member digital badge & toolkit",
                    "Printable 8.5\" × 11\" membership certificate",
                    "Access to member networking mixers & events",
                    "Member pricing on select workshops & programs",
                    "Community collaboration & local advocacy"
                  ].map((perk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                {onOpenJoinModal ? (
                  <button
                    onClick={handleMemberClick}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/20 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                  >
                    <span>Join As Member ($350/yr)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/membership"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/20 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition text-center"
                  >
                    <span>Join As Member ($350/yr)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Bar: Corporate Sponsorship & Comparison Navigation */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-10 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
              <span>Official 501(c)(3) Non-Profit • Tax-Deductible Business Dues</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleSponsorClick}
                className="text-slate-200 hover:text-white font-bold underline underline-offset-4 transition"
              >
                Inquire About Corporate Sponsorships →
              </button>
              
              <Link
                href="/membership"
                className="text-red-400 hover:text-red-300 font-bold transition"
              >
                Full Membership Comparison & FAQs →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
