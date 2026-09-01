"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LaunchBanner from "@/components/LaunchBanner";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import Link from "next/link";
import { 
  Star, 
  Handshake, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Mail, 
  PartyPopper,
  AlertCircle
} from "lucide-react";

function MembershipContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const paidTier = searchParams.get("tier") || "Membership";

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState("Community Partner ($390 1st Yr • Renews $490/yr)");

  const handleJoinClick = (tierName: string) => {
    setModalTier(tierName);
    setIsJoinModalOpen(true);
  };

  const partnerPerks = [
    {
      title: "Enhanced Business Directory Listing",
      desc: "Priority positioning in our official online business directory with direct website link, phone, category tags, and business description."
    },
    {
      title: "Official Digital Member Badge & Framed Certificate",
      desc: "High-resolution verified 2026 digital badge for your website footer, email signature, and storefront certificate display."
    },
    {
      title: "Priority Business Spotlights & Social Features",
      desc: "Featured spotlight opportunities across Community Commerce Melissa social media channels, newsletters, and digital announcements."
    },
    {
      title: "Exclusive Local Business Discounts & B2B Savings",
      desc: "Access member-exclusive promotions, special discounts, and collaborative deals offered across participating Melissa businesses."
    },
    {
      title: "Access to Networking Mixers & Programs",
      desc: "Monthly networking mixers, educational workshops, guest speaker panels, and business development roundtables."
    },
    {
      title: "Event Recognition & Community Collaboration",
      desc: "Recognition at select community events, opportunities to host educational sessions, and priority participation in local campaigns."
    }
  ];

  const corporatePerks = [
    "Presenting & annual program underwriting sponsorships",
    "Major event underwriting & executive speaking opportunities",
    "Prominent website, directory & digital logo placement",
    "On-site event signage, stage recognition & marketing materials",
    "Community-impact initiatives & employee volunteer engagement",
    "Customized partnership scope built around your organization's goals"
  ];

  const faqs = [
    { 
      q: "What does the Community Partner membership include?", 
      a: "Community Partner ($390 for your first year, renews at $490/yr) is our all-inclusive business membership level. It includes an enhanced directory listing, official digital badge & certificate, priority business spotlights, exclusive discounts from other local businesses, monthly networking mixers, event recognition, and collaborative community campaigns." 
    },
    { 
      q: "How does the limited-time Community Partner first-year deal work?", 
      a: "For a limited time, you can secure the Community Partner membership level for $390 for your first year (saving $100 off the standard $490/year rate). After your first year, your subscription will renew automatically at the regular annual rate of $490/year." 
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
      q: "What type of organization is Community Commerce Melissa?", 
      a: "Community Commerce Melissa is a community-focused non-profit organization dedicated to fostering local business connection, economic strength, and community support throughout Melissa, Texas." 
    },
    { 
      q: "How quickly is my business directory listing activated?", 
      a: "Upon completing your member application and Stripe payment, our team verifies and activates your directory profile within 24 to 48 business hours." 
    },
    { 
      q: "Do you offer refunds?", 
      a: "No. Membership dues, donations, sponsorship payments, and other charges are non-refundable. You may cancel a future membership renewal before the next billing date, but amounts already paid for the current term are not refunded. See our Terms of Service for details." 
    },
  ];

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => handleJoinClick("Community Partner ($390 1st Yr • Renews $490/yr)")} />
      <Navbar onOpenJoinModal={() => handleJoinClick("Community Partner ($390 1st Yr • Renews $490/yr)")} />

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
            MEMBERSHIP & <span className="text-red-500">PARTNERSHIPS</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join as a Community Partner or Corporate Sponsor to connect, participate, and gain premier exposure throughout the growing Melissa community.
          </p>
        </div>
      </section>

      {/* Main 2 Tiers Section: Community Partner (Membership) & Corporate Sponsorship */}
      <section className="py-14 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* TIER 1: COMMUNITY PARTNER (STANDOUT HERO RED TIER - 7 COLUMNS) */}
            <div className="lg:col-span-7 bg-gradient-to-b from-white to-red-50/30 rounded-2xl border-2 border-[#A81C24] shadow-2xl flex flex-col justify-between overflow-hidden relative ring-4 ring-red-500/20">
              
              <div>
                {/* Top Dark "Official Business Membership" Strip */}
                <div className="bg-slate-950 text-slate-200 py-2.5 px-4 text-center border-b border-white/10 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest shadow-inner">
                  <Star className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>OFFICIAL BUSINESS MEMBERSHIP • SAVE $100</span>
                </div>

                {/* Vibrant Brand Red Header Bar */}
                <div className="bg-[#A81C24] text-white py-4 px-6 text-center shadow-md">
                  <h3 className="font-outfit font-black text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center gap-2">
                    COMMUNITY PARTNER
                  </h3>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Pricing Box with Sale Highlight */}
                  <div className="text-center pb-4 border-b border-red-100">
                    <div className="inline-flex flex-col items-center bg-gradient-to-br from-red-950 via-[#A81C24] to-red-900 text-white px-8 py-3.5 rounded-2xl shadow-lg border-2 border-red-500/50 ring-2 ring-red-500/20">
                      <div className="flex items-baseline gap-2">
                        <span className="font-outfit font-black text-4xl sm:text-5xl text-white tracking-tight">$390</span>
                        <span className="text-xs font-semibold text-red-200">/1st year</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-red-200 text-xs font-semibold">Renews at $490/yr</span>
                        <span className="bg-white text-[#A81C24] text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                          SAVE $100 YEAR 1
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 mt-4 leading-relaxed font-semibold text-left">
                      Our premier all-inclusive business membership designed for local businesses and entrepreneurs looking to connect, participate, gain maximum exposure, access exclusive local discounts, and build lasting community partnerships.
                    </p>
                  </div>

                  {/* Included Perks */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-[#A81C24] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      MEMBERSHIP BENEFITS INCLUDE:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Official Community Commerce Melissa membership",
                        "Enhanced business directory listing with direct web links",
                        "Priority consideration for business spotlights",
                        "Social media & digital channel promotions",
                        "Special discounts & exclusive offers from local businesses",
                        "Monthly networking mixers & program access",
                        "Official digital badge & framed certificate",
                        "Host or participate in educational sessions & panels",
                        "Recognition at select Community Commerce events",
                        "Priority consideration for collaborative community campaigns"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-900 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-[#A81C24] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Best For Box & Button */}
              <div className="p-6 sm:p-8 pt-0 space-y-4">
                <div className="bg-red-100/80 border border-red-200 rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-[#A81C24] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#A81C24] uppercase tracking-wider">BEST FOR:</div>
                    <p className="text-xs text-slate-700 mt-0.5 leading-snug font-medium">
                      Local businesses, founders, and entrepreneurs that want networking, special business discounts, and increased visibility throughout the Melissa community.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinClick("Community Partner ($390 1st Yr • Renews $490/yr)")}
                  className="w-full btn-red py-4 px-4 rounded-xl transition shadow-2xl flex flex-col items-center justify-center gap-0.5 group hover:scale-[1.01] ring-2 ring-red-500/50"
                >
                  <div className="flex items-center gap-1.5 text-sm sm:text-base font-black tracking-wide text-white font-outfit uppercase">
                    <span>JOIN AS COMMUNITY PARTNER</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  <div className="text-[11px] font-bold text-red-100 uppercase tracking-wider">
                    $390 / 1ST YEAR • SAVE $100
                  </div>
                </button>
              </div>
            </div>

            {/* TIER 2: CORPORATE & COMMUNITY SPONSORSHIPS (5 COLUMNS) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between overflow-hidden relative transition hover:shadow-md">
              <div>
                {/* Standard Dark Slate Header Bar */}
                <div className="bg-[#151922] text-white py-4 px-6 text-center border-b border-slate-700">
                  <h3 className="font-outfit font-bold text-base tracking-wider uppercase text-slate-200">
                    CORPORATE & COMMUNITY SPONSORSHIPS
                  </h3>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Custom Header Box */}
                  <div className="text-center pb-4 border-b border-slate-100">
                    <div className="inline-block bg-slate-100 border border-slate-200 text-slate-900 font-outfit font-bold text-xs px-4 py-2 rounded-xl shadow-xs uppercase tracking-wider">
                      CUSTOM SPONSORSHIP OPPORTUNITIES
                    </div>
                    <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium text-left">
                      For larger corporations, regional employers, developers, financial institutions, healthcare providers, and major retailers interested in making a significant investment in Melissa.
                    </p>
                    <p className="text-xs text-slate-500 mt-2 italic leading-relaxed text-left">
                      Rather than a standard membership package, sponsorships are customized around your company&apos;s strategic goals and desired community leadership footprint.
                    </p>
                  </div>

                  {/* Included Perks */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      SPONSORSHIP OPPORTUNITIES MAY INCLUDE:
                    </h4>
                    <ul className="space-y-2">
                      {corporatePerks.map((item, idx) => (
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
              <div className="p-6 sm:p-8 pt-0 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Handshake className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      INTERESTED IN BECOMING A CORPORATE SPONSOR?
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Let&apos;s build a custom partnership that makes sense for your organization and for Melissa.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinClick("Corporate & Community Sponsorship")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 px-4 rounded-xl transition shadow-sm flex flex-col items-center justify-center gap-0.5 group text-center"
                >
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-wide text-slate-100 font-outfit uppercase">
                    <span>INQUIRE ABOUT SPONSORSHIP</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    CUSTOM CORPORATE PACKAGES
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Partner Benefits Feature Grid Section */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-800 font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              WHY JOIN AS A COMMUNITY PARTNER
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900 uppercase tracking-tight">
              DESIGNED TO GROW YOUR BUSINESS IN MELISSA
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything your business needs to connect, build credibility, and gain exposure in our thriving community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerPerks.map((perk, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-red-300 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black">
                  <CheckCircle2 className="w-5 h-5 text-red-700" />
                </div>
                <h4 className="text-base font-extrabold font-outfit text-slate-900 uppercase">
                  {perk.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Corporate Contact Banner */}
          <div className="bg-[#151922] text-white border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                CUSTOM CORPORATE PACKAGES
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold font-outfit text-white uppercase">
                LOOKING FOR CORPORATE SPONSORSHIP OPPORTUNITIES?
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                Contact our executive team to explore bespoke presenting sponsorships, event underwriting, and community-wide recognition packages.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleJoinClick("Corporate & Community Sponsorship")}
                className="btn-red px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Handshake className="w-4 h-4" />
                <span>INQUIRE NOW</span>
              </button>
              <a
                href="mailto:info@communitycommercemelissa.org"
                className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/20 hover:bg-white/10 text-slate-200 transition flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-red-400" />
                <span>EMAIL US</span>
              </a>
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
