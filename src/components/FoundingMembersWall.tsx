"use client";

import React from "react";
import { Award, ShieldCheck, Sparkles, PlusCircle } from "lucide-react";
import { MOCK_FOUNDING_MEMBERS } from "@/data/mockData";

interface FoundingMembersWallProps {
  onOpenJoinModal?: () => void;
}

export default function FoundingMembersWall({ onOpenJoinModal }: FoundingMembersWallProps) {
  return (
    <section className="py-16 bg-[#0B0E14] text-white border-t border-b border-white/10 relative overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-red-900/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
            <Award className="w-4 h-4 text-slate-300" />
            PERMANENT RECOGNITION WALL
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit uppercase tracking-tight text-white">
            OUR FOUNDING <span className="text-slate-200">MEMBERS</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Honoring the visionary Melissa business owners who joined during our launch year. 
            All Founding Partners receive permanent logo placement on our Founding Wall.
          </p>
        </div>

        {/* Founding Members Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {MOCK_FOUNDING_MEMBERS.map((member, index) => (
            <div
              key={index}
              className="bg-[#151922] hover:bg-[#1C2230] border border-white/10 hover:border-slate-300/50 rounded-xl p-5 text-center flex flex-col items-center justify-between transition-all transform hover:-translate-y-1 shadow-lg group"
            >
              {/* Badge Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-900 to-[#0B0E14] border border-slate-300/30 flex items-center justify-center text-slate-200 font-outfit font-extrabold text-sm shadow-inner group-hover:scale-110 transition-transform">
                {member.logoText}
              </div>

              {/* Title & Category */}
              <div className="mt-3">
                <h4 className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors line-clamp-1">
                  {member.name}
                </h4>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                  {member.category}
                </p>
              </div>

              {/* Founding Partner Badge */}
              <div className="mt-3 inline-flex items-center gap-1 text-[9px] bg-slate-200/10 text-slate-200 border border-slate-300/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-slate-300" />
                FOUNDING PARTNER
              </div>
            </div>
          ))}

          {/* Become a Founding Partner Card Slot */}
          <div
            onClick={onOpenJoinModal}
            className="bg-gradient-to-br from-red-950/60 to-red-900/40 border-2 border-dashed border-red-500/50 hover:border-slate-300 rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-xl group min-h-[170px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-200 text-red-950 flex items-center justify-center shadow-lg group-hover:rotate-90 transition-transform">
              <PlusCircle className="w-7 h-7" />
            </div>

            <div className="mt-3">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                YOUR LOGO HERE
              </span>
              <span className="text-[11px] text-slate-200 font-semibold block mt-0.5">
                Join for $200 Launch Rate
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Urgency Banner */}
        <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-slate-300 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">Only 8 Founding Partner Slots Remaining!</div>
              <div className="text-xs text-slate-400">Lock in your $200 launch pricing ($150 savings off standard $350/yr).</div>
            </div>
          </div>

          <button
            onClick={onOpenJoinModal}
            className="btn-red px-5 py-2 rounded text-xs font-bold uppercase tracking-wider shrink-0"
          >
            BECOME A FOUNDING MEMBER TODAY
          </button>
        </div>

      </div>
    </section>
  );
}
