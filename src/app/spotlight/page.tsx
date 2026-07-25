"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { Award, Play, Star, Sparkles, Building2, ExternalLink } from "lucide-react";
import { MOCK_BUSINESSES } from "@/data/mockData";

export default function SpotlightPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const spotlightBiz = MOCK_BUSINESSES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Award className="w-4 h-4" />
              BUSINESS SPOTLIGHT
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              BUSINESS OF THE <span className="text-amber-400">MONTH</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Celebrating outstanding Melissa entrepreneurs making a lasting impact in our community.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F1218] text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-red-950 font-black text-xs uppercase px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 fill-current" />
                Featured Business Spotlight
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit uppercase text-white">
                {spotlightBiz.name}
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                {spotlightBiz.description} With a commitment to patient care and community wellness, Melissa Family Dental has served over 2,500 Collin County families.
              </p>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-amber-400">Owner Q&A Highlights:</div>
                <p className="text-slate-300 italic">
                  &ldquo;We chose Melissa because of the tight-knit community feel. Being a Founding Member of Community Commerce Melissa helps us connect directly with our neighbors.&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={spotlightBiz.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-red px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  Visit Website
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="btn-gold-outline px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider"
                >
                  Nominate a Business for Spotlight
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-white/20 shadow-xl group">
              <img
                src={spotlightBiz.image}
                alt={spotlightBiz.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-700 text-amber-300 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
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
