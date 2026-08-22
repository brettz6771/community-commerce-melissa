"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import Link from "next/link";
import { 
  Users, 
  Star, 
  Handshake, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Mail, 
  Globe, 
  Check, 
  Minus,
  Lock,
  PartyPopper,
  AlertCircle
} from "lucide-react";

function MembershipContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const paidTier = searchParams.get("tier") || "Membership";

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState("Community Partner ($390/yr)");

  const handleJoinClick = (tierName: string) => {
    setModalTier(tierName);
    setIsJoinModalOpen(true);
  };

  const comparisonRows = [
    { benefit: "Business Directory Listing", member: "Standard", partner: "Enhanced" },
    { benefit: "Networking Events", member: "Standard", partner: "Enhanced" },
    { benefit: "Educational Opportunities", member: "Standard", partner: "Enhanced" },
    { benefit: "Member Badge", member: "check", partner: "check" },
    { benefit: "Community Participation", member: "check", partner: "check" },
    { benefit: "Special Discounts from Local Businesses", member: "dash", partner: "check" },
    { benefit: "Business Spotlight Opportunities", member: "Standard", partner: "Priority" },
    { benefit: "Social/Digital Promotion", member: "Limited", partner: "Enhanced" },
    { benefit: "Event Recognition", member: "dash", partner: "check" },
    { benefit: "Host/Participate in Educational Programs", member: "dash", partner: "check" },
    { benefit: "Collaborative Campaign Opportunities", member: "dash", partner: "Priority" },
    { benefit: "Overall Visibility", member: "Standard", partner: "Enhanced" },
  ];

  const faqs = [
    { 
      q: "What is the difference between Community Member and Community Partner?", 
      a: "Community Member ($350/yr) is perfect for small businesses looking to connect, attend events, and have an active directory listing. Community Partner ($390/yr limited sale, regularly $490/yr) includes everything in Community Member plus enhanced directory ranking, priority business spotlights, special discounts offered by other local businesses, social media features, collaborative campaigns, and event recognition for maximum visibility." 
    },
    { 
      q: "How does the limited-time Community Partner sale work?", 
      a: "For a limited time, you can secure the Community Partner membership level for $390/year (saving $100 off the standard $490/year regular price). This includes all premium visibility perks, spotlight priority, local business discount access, and event recognition." 
    },
    { 
      q: "What are the Special Discounts from local businesses?", 
      a: "Community Partners gain exclusive access to special discounts, member-to-member B2B savings, and partner promotions offered across participating Melissa businesses." 
    },
    { 
      q: "How are Corporate & Community Sponsorships structured?", 
      a: "Corporate sponsorships are tailored for larger organizations, regional employers, healthcare providers, and developers wanting substantial community impact. Sponsorship packages can include presenting sponsorships, annual program underwriting, premium logo placement, and speaking opportunities." 
    },
    { 
      q: "Is Community Commerce Melissa a non-profit?", 
      a: "Yes, Community Commerce Melissa is an official 501(c)(3) non-profit organization dedicated to fostering community connection, economic strength, and local non-profit support throughout Melissa, Texas." 
    },
    { 
      q: "How quickly is my business directory listing activated?", 
      a: "Upon completing your member application and Stripe payment, our team verifies and activates your directory profile within 24 to 48 business hours." 
    }
  ];

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <Navbar onOpenJoinModal={() => handleJoinClick("Community Partner ($390/yr)")} />

      {/* Internal Preview Notification Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 text-center flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5 text-red-400" />
        <span>
          <strong>Team Preview Mode:</strong> This page is accessible at <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-mono">/membership</code> for review and approval before public launch.
        </span>
      </div>

      {/* Stripe Payment Success Notification Banner */}
      {isSuccess && (
        <div className="bg-emerald-900 border-b border-emerald-700 text-white py-4 px-4 text-center">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
            <PartyPopper className="w-6 h-6 text-emerald-300 shrink-0" />
            <div className="text-left">
              <h3 className="font-outfit font-black text-base text-emerald-100 uppercase tracking-wide">
                Payment Successful! Welcome to Community Commerce Melissa
              </h3>
              <p className="text-xs text-emerald-200">
                Your payment for <strong>{paidTier}</strong> has been confirmed by Stripe. Check your email for your receipt, Welcome Packet, and directory setup instructions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Payment Canceled Notification Banner */}
      {isCanceled && (
        <div className="bg-amber-950 border-b border-amber-800 text-amber-200 py-3 px-4 text-center text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Checkout was canceled. Whenever you&apos;re ready, you can choose a membership plan below to complete your registration.</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-[#0B0E14] text-white py-14 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            COMMUNITY COMMERCE MELISSA, TX
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight text-white">
            MEMBERSHIP <span className="text-red-500">LEVELS</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Choose the membership tier designed to help your business connect, participate, and gain exposure in the growing Melissa community.
          </p>
        </div>
      </section>

      {/* Featured Promotion Callout Banner */}
      <section className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 text-white py-5 shadow-lg border-b border-red-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 hidden sm:flex border border-white/20">
              <Star className="w-5 h-5 text-slate-100 fill-slate-100" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="bg-white text-red-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow">
                  LIMITED TIME OFFER
                </span>
                <span className="text-xs font-bold text-slate-200">Save $100 Instantly</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold font-outfit text-white mt-0.5">
                Join as a Community Partner for $390/year <span className="line-through text-red-200 text-sm font-semibold ml-1">$490 Regular</span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => handleJoinClick("Community Partner ($390/yr)")}
            className="bg-white hover:bg-slate-100 text-red-950 font-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider shrink-0 shadow-xl flex items-center gap-2 transition hover:scale-105"
          >
            CLAIM $390 SPECIAL
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Main 3 Tiers Cards Section */}
      <section className="py-14 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* TIER 1: COMMUNITY MEMBER (STANDARD / NEUTRAL SLATE) */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between overflow-hidden relative transition hover:shadow-md">
              <div>
                {/* Standard Dark Slate Header Bar */}
                <div className="bg-[#151922] text-white py-4 px-6 text-center border-b border-slate-700">
                  <h3 className="font-outfit font-bold text-base sm:text-lg tracking-wider uppercase text-slate-200">
                    1. COMMUNITY MEMBER
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Pricing */}
                  <div className="text-center pb-4 border-b border-slate-100">
                    <div className="inline-block bg-slate-100 border border-slate-200 text-slate-900 font-outfit font-extrabold text-2xl px-6 py-2 rounded-xl shadow-xs">
                      $350<span className="text-xs font-medium text-slate-500">/year</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium text-left">
                      Designed for small businesses, entrepreneurs, independent professionals, and organizations that want to connect, participate, and become more involved in the Melissa business community.
                    </p>
                  </div>

                  {/* Included Perks */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      MEMBERSHIP INCLUDES:
                    </h4>
                    <ul className="space-y-2.5">
                      {[
                        "Official Community Commerce Melissa membership",
                        "Business listing in the online member directory",
                        "Access to member networking events",
                        "Member pricing or priority registration for select events and programs",
                        "Educational workshops and business-development opportunities",
                        "Opportunities to participate in Community Commerce Melissa initiatives",
                        "Ability to submit business news, announcements, and community updates for consideration",
                        "Community Commerce Melissa member badge for website and marketing use",
                        "Opportunities to connect and collaborate with other local businesses"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Best For Box & Button */}
              <div className="p-6 pt-0 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">BEST FOR:</div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Businesses that primarily want networking, education, community involvement, and greater connections throughout Melissa.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinClick("Community Member ($350/yr)")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-4 rounded-xl transition shadow-sm flex flex-col items-center justify-center gap-0.5 group"
                >
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-wide text-slate-100 font-outfit uppercase">
                    <span>JOIN AS COMMUNITY MEMBER</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    $350 / YEAR
                  </div>
                </button>
              </div>
            </div>

            {/* TIER 2: COMMUNITY PARTNER (STANDOUT HERO RED TIER) */}
            <div className="bg-gradient-to-b from-white to-red-50/40 rounded-2xl border-2 border-[#A81C24] shadow-2xl flex flex-col justify-between overflow-hidden relative transform lg:-translate-y-3 ring-4 ring-red-500/20">
              
              <div>
                {/* Top Dark "Most Popular" Strip with ample room and zero overlap */}
                <div className="bg-slate-950 text-slate-200 py-2.5 px-4 text-center border-b border-white/10 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest shadow-inner">
                  <Star className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>MOST POPULAR • BEST VALUE</span>
                </div>

                {/* Vibrant Brand Red Header Bar */}
                <div className="bg-[#A81C24] text-white py-4 px-6 text-center shadow-md">
                  <h3 className="font-outfit font-black text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center gap-2">
                    2. COMMUNITY PARTNER
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Pricing Box with Sale Highlight */}
                  <div className="text-center pb-4 border-b border-red-100">
                    <div className="inline-flex flex-col items-center bg-gradient-to-br from-red-950 via-[#A81C24] to-red-900 text-white px-7 py-3 rounded-2xl shadow-lg border-2 border-red-500/50 ring-2 ring-red-500/20">
                      <div className="flex items-baseline gap-2">
                        <span className="font-outfit font-black text-3.5xl sm:text-4xl text-white tracking-tight">$390</span>
                        <span className="text-xs font-semibold text-red-200">/year</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="line-through text-red-300 text-xs font-semibold">$490 Regular</span>
                        <span className="bg-white text-[#A81C24] text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                          SAVE $100 LIMITED TIME
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 mt-4 leading-relaxed font-semibold text-left">
                      Designed for businesses that want everything included in membership plus greater visibility, promotion, exclusive partner discounts, and opportunities to engage with the community.
                    </p>
                  </div>

                  {/* Included Perks */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-[#A81C24] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      INCLUDES EVERYTHING IN COMMUNITY MEMBER, PLUS:
                    </h4>
                    <ul className="space-y-2.5">
                      {[
                        "Enhanced business directory listing",
                        "Priority consideration for business spotlights",
                        "Opportunities to be featured through Community Commerce Melissa social media and digital channels",
                        "Special discounts and exclusive offers provided by other local businesses",
                        "Priority access to select networking and community opportunities",
                        "Opportunities to host or participate in educational sessions, panels, or business discussions",
                        "Additional recognition at select Community Commerce Melissa events",
                        "Priority consideration for collaborative community campaigns",
                        "Opportunities to provide member-exclusive promotions or offers to the community",
                        "Greater visibility across Community Commerce Melissa programs and communications"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-900 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-[#A81C24] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Best For Box & Button */}
              <div className="p-6 pt-0 space-y-4">
                <div className="bg-red-100/80 border border-red-200 rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#A81C24] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#A81C24] uppercase tracking-wider">BEST FOR:</div>
                    <p className="text-xs text-slate-700 mt-0.5 leading-snug font-medium">
                      Established local businesses that want networking, special business discounts, and increased exposure throughout the Melissa community.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinClick("Community Partner ($390/yr)")}
                  className="w-full btn-red py-3.5 px-4 rounded-xl transition shadow-2xl flex flex-col items-center justify-center gap-0.5 group hover:scale-[1.02] ring-2 ring-red-500/50"
                >
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-wide text-white font-outfit uppercase">
                    <span>JOIN AS COMMUNITY PARTNER</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  <div className="text-[11px] font-bold text-red-100 uppercase tracking-wider">
                    $390 / YEAR • SAVE $100 SALE
                  </div>
                </button>
              </div>
            </div>

            {/* TIER 3: CORPORATE & COMMUNITY SPONSORSHIPS (STANDARD / NEUTRAL SLATE) */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between overflow-hidden relative transition hover:shadow-md">
              <div>
                {/* Standard Dark Slate Header Bar */}
                <div className="bg-[#151922] text-white py-4 px-6 text-center border-b border-slate-700">
                  <h3 className="font-outfit font-bold text-sm sm:text-base tracking-wider uppercase text-slate-200">
                    3. CORPORATE & COMMUNITY SPONSORSHIPS
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Custom Header Box */}
                  <div className="text-center pb-4 border-b border-slate-100">
                    <div className="inline-block bg-slate-100 border border-slate-200 text-slate-900 font-outfit font-bold text-xs px-4 py-2 rounded-xl shadow-xs uppercase tracking-wider">
                      CUSTOM SPONSORSHIP OPPORTUNITIES
                    </div>
                    <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium text-left">
                      For larger corporations, regional employers, developers, financial institutions, healthcare organizations, utilities, major retailers, and other organizations interested in making a larger investment in Melissa.
                    </p>
                    <p className="text-xs text-slate-500 mt-2 italic leading-relaxed text-left">
                      Rather than placing these organizations into a standard membership package, sponsorships can be built around the company&apos;s goals and desired level of community involvement.
                    </p>
                  </div>

                  {/* Included Perks */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      SPONSORSHIP OPPORTUNITIES MAY INCLUDE:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "Presenting sponsorships",
                        "Annual organizational sponsorships",
                        "Major event sponsorships",
                        "Educational program sponsorships",
                        "Community initiative sponsorships",
                        "Website and digital recognition",
                        "Premium logo placement",
                        "Event signage and recognition",
                        "Social media and marketing recognition",
                        "Speaking or presentation opportunities where appropriate",
                        "Employee engagement opportunities",
                        "Community-impact initiatives",
                        "Customized partnership opportunities"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Best For Box & Button */}
              <div className="p-6 pt-0 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Handshake className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      INTERESTED IN BECOMING A CORPORATE SPONSOR?
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Let&apos;s build a partnership that makes sense for your organization and for Melissa.
                    </p>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-4 rounded-xl transition shadow-sm flex flex-col items-center justify-center gap-0.5 group text-center"
                >
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-wide text-slate-100 font-outfit uppercase">
                    <span>INQUIRE ABOUT SPONSORSHIP</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    CUSTOM CORPORATE PARTNERSHIPS
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison Table & Positioning Section */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: WHAT'S THE DIFFERENCE Comparison Table */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <h3 className="text-2xl font-extrabold font-outfit text-slate-900 uppercase tracking-tight">
                  WHAT&apos;S THE DIFFERENCE?
                </h3>
                <p className="text-xs text-slate-500">
                  Compare benefits between our standard and enhanced business membership packages.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="font-outfit uppercase tracking-wider">
                        <th className="py-3 px-4 text-xs font-bold bg-slate-900 text-white">BENEFIT</th>
                        <th className="py-3 px-4 text-xs text-center border-l border-slate-700 bg-slate-800 text-white font-bold">
                          COMMUNITY MEMBER<br/>
                          <span className="text-[10px] font-normal text-slate-300">$350/YEAR</span>
                        </th>
                        <th className="py-3 px-4 text-xs text-center border-l border-red-800/50 bg-[#A81C24] text-white font-extrabold">
                          COMMUNITY PARTNER<br/>
                          <span className="text-[10px] font-bold text-white bg-red-950/80 px-2 py-0.5 rounded">$390 SALE <span className="line-through text-red-300 font-normal">$490</span></span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comparisonRows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {row.benefit}
                          </td>
                          <td className="py-3 px-4 text-center border-l border-slate-100 font-medium text-slate-700">
                            {row.member === "check" ? (
                              <Check className="w-4 h-4 text-slate-600 mx-auto stroke-[2.5]" />
                            ) : row.member === "dash" ? (
                              <Minus className="w-4 h-4 text-slate-400 mx-auto" />
                            ) : (
                              <span>{row.member}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center border-l border-red-100 font-bold text-slate-900 bg-red-50/40">
                            {row.partner === "check" ? (
                              <Check className="w-4 h-4 text-[#A81C24] mx-auto stroke-[3]" />
                            ) : row.partner === "dash" ? (
                              <Minus className="w-4 h-4 text-slate-400 mx-auto" />
                            ) : (
                              <span className="text-[#A81C24] font-extrabold">{row.partner}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Simple Positioning & Corporate Contact */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Simple Positioning Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">
                  SIMPLE POSITIONING
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#A81C24] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase">COMMUNITY MEMBER</div>
                      <div className="text-xs text-[#A81C24] font-bold mt-0.5">Connect. Learn. Participate.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase">COMMUNITY PARTNER</div>
                      <div className="text-xs text-[#A81C24] font-bold mt-0.5">Connect. Participate. Get Seen.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corporate Sponsorship Contact Box */}
              <div className="bg-[#151922] text-white border border-white/10 rounded-xl p-5 space-y-4 shadow-md">
                <div>
                  <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                    CUSTOM PARTNERSHIPS
                  </div>
                  <h4 className="text-sm font-extrabold font-outfit text-white uppercase mt-0.5">
                    CORPORATE SPONSORSHIPS — CONTACT US FOR OPPORTUNITIES & PRICING
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-3">
                  <a 
                    href="mailto:info@communitycommercemelissa.org" 
                    className="flex items-center gap-2 hover:text-white transition group"
                  >
                    <Mail className="w-4 h-4 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">info@communitycommercemelissa.org</span>
                  </a>
                  <a 
                    href="https://www.communitycommercemelissa.org" 
                    className="flex items-center gap-2 hover:text-white transition group"
                  >
                    <Globe className="w-4 h-4 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">www.communitycommercemelissa.org</span>
                  </a>
                </div>

                <Link
                  href="/contact"
                  className="w-full btn-red py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-center shadow-lg"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  <span>CONTACT SPONSORSHIP TEAM</span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Tagline Banner */}
      <section className="py-8 bg-[#0B0E14] text-white border-t border-b border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-outfit font-extrabold text-lg sm:text-2xl tracking-widest text-slate-100 uppercase">
            TOGETHER, WE BUILD A STRONGER MELISSA.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold font-outfit uppercase text-slate-900">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-xs text-slate-500">Everything you need to know about joining Community Commerce Melissa.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, fi) => (
              <div key={fi} className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-1">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#A81C24] shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        defaultTier={modalTier}
      />
    </div>
  );
}

export default function MembershipPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center">Loading...</div>}>
      <MembershipContent />
    </Suspense>
  );
}
