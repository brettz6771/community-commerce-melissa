"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  Download,
  CreditCard
} from "lucide-react";

export default function MembershipPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState("Founding Partner");

  const handleJoinClick = (tierName: string) => {
    setModalTier(tierName);
    setIsJoinModalOpen(true);
  };

  const tiers = [
    {
      name: "Community Member",
      price: "$0",
      billing: "FREE forever",
      badge: "Free Tier",
      badgeColor: "bg-slate-100 text-slate-800",
      description: "Perfect for local businesses wanting to stay connected with Melissa community updates.",
      benefits: [
        "Member listing in online Business Directory",
        "Invitations to monthly networking events",
        "Access to community updates and newsletters",
        "Event announcements & registration access",
        "Educational resources & small business guides"
      ]
    },
    {
      name: "Business Member",
      price: "$150",
      billing: "per year",
      badge: "Popular Growth",
      badgeColor: "bg-red-100 text-red-800",
      description: "Designed for established businesses looking for increased visibility and engagement.",
      benefits: [
        "Everything in FREE Membership, plus:",
        "Featured Business Directory listing with logo & website",
        "Social media business spotlight opportunity",
        "Priority event notifications & reserved seats",
        "Member badge for website and marketing materials",
        "Member-only networking opportunities",
        "Discounts on select paid events and workshops"
      ]
    },
    {
      name: "Founding Partner",
      price: "$200",
      strikePrice: "$350",
      billing: "Launch Special / first year",
      badge: "🎉 LAUNCH SPECIAL (SAVE $150)",
      badgeColor: "bg-amber-400 text-red-950 font-extrabold",
      popular: true,
      description: "Limited-time launch pricing for businesses joining during our founding year.",
      benefits: [
        "Everything in Business Membership, plus:",
        "Permanent placement on Founding Members Wall",
        "Premium placement in Business Directory",
        "Featured homepage business rotation",
        "Dedicated Business Spotlight article & video interview",
        "Priority social media & newsletter promotion",
        "Exclusive Founding Member digital badge",
        "VIP recognition at all annual events"
      ]
    }
  ];

  const faqs = [
    { q: "What is the Launch Special for Founding Partners?", a: "Businesses that join during our founding year lock in the Founding Partner rate for only $200 for their first year (saving $150 off the standard $350/yr rate) and receive permanent logo placement on our Founding Members Wall." },
    { q: "Is there any automatic annual renewal?", a: "Yes, you can choose optional annual auto-renewal with 30-day advance notification prior to renewal." },
    { q: "How quickly will my directory listing go live?", a: "Immediately upon completing the registration form, your profile is created and indexed in the Melissa directory." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => handleJoinClick("Founding Partner")} />
      <Navbar onOpenJoinModal={() => handleJoinClick("Founding Partner")} />

      {/* Hero Banner */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Users className="w-4 h-4" />
              MEMBERSHIP PORTAL & OVERVIEW
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              JOIN THE <span className="text-amber-400">MELISSA COMMUNITY</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We keep membership accessible and focused on real tangible value rather than dues. Belong, connect, and grow together.
            </p>
          </div>
        </div>
      </section>

      {/* Launch Promo Alert Box */}
      <section className="py-8 bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/30 border border-white/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-red-950 font-black px-2.5 py-0.5 rounded text-xs uppercase">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                🚀 FOUNDING MEMBER LAUNCH SPECIAL
              </div>
              <h2 className="text-2xl font-extrabold font-outfit text-white">
                Become a Founding Partner Today for Only $200/Year
              </h2>
              <p className="text-xs text-amber-200">
                Regular Price: <span className="line-through text-red-300">$350/year</span> — Save $150! Limited-time offer available during our founding launch.
              </p>
            </div>

            <button
              onClick={() => handleJoinClick("Founding Partner")}
              className="bg-amber-400 hover:bg-amber-300 text-red-950 font-extrabold px-6 py-3 rounded-lg text-xs uppercase tracking-wider shrink-0 shadow-lg flex items-center gap-2"
            >
              CLAIM $200 LAUNCH RATE
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Comparison Cards */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold font-outfit text-slate-900 uppercase">
              SELECT YOUR MEMBERSHIP LEVEL
            </h2>
            <p className="text-slate-500 text-sm">
              Choose the level of visibility and networking that best fits your business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tiers.map((t, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl border ${
                  t.popular ? "border-amber-400 ring-2 ring-amber-400/50 shadow-2xl scale-105" : "border-slate-200 shadow-lg"
                } p-6 md:p-8 flex flex-col justify-between relative`}
              >
                {t.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow tracking-wider">
                    FOUNDING PARTNER SPECIAL
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${t.badgeColor}`}>
                      {t.badge}
                    </span>

                    <h3 className="text-2xl font-extrabold font-outfit text-slate-900 mt-3">
                      {t.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 min-h-[36px]">
                      {t.description}
                    </p>
                  </div>

                  <div className="border-t border-b border-slate-100 py-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black font-outfit text-slate-900">{t.price}</span>
                      {t.strikePrice && (
                        <span className="text-base line-through text-slate-400 font-semibold">{t.strikePrice}</span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">/{t.billing}</span>
                    </div>
                  </div>

                  {/* Benefits Checklist */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Included Perks:</div>
                    <ul className="space-y-2.5">
                      {t.benefits.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleJoinClick(t.name)}
                    className={`w-full py-3 rounded-lg font-extrabold text-xs uppercase tracking-wider transition ${
                      t.popular
                        ? "btn-red shadow-xl"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    JOIN NOW — {t.price}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-slate-200">
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
                  <HelpCircle className="w-4 h-4 text-red-700" />
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
