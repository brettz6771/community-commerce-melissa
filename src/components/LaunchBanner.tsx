"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, X, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LaunchBanner({ onOpenJoinModal }: { onOpenJoinModal?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 text-white px-4 py-2.5 shadow-md border-b border-red-700/50 relative z-50">
      <div className="w-full max-w-[1550px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
        
        {/* Left message & badge */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
          <span className="bg-white text-red-950 font-black px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wide flex items-center gap-1 shadow-sm shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-red-700 fill-current" />
            INAUGURAL SPECIAL
          </span>
          <span className="font-medium text-slate-100 text-xs sm:text-sm">
            <strong className="text-white font-bold">Community Partner Membership:</strong> Only <span className="text-white font-extrabold text-sm sm:text-base">$390 1st Year</span>{" "}
            <span className="line-through text-red-200 text-xs">($490/yr)</span>{" "}
            <span className="bg-black/30 text-red-200 border border-red-400/30 px-2 py-0.5 rounded text-[11px] font-bold ml-1">
              SAVE $100
            </span>{" "}
            <span className="hidden lg:inline text-slate-200">• Includes Verified Badge & Live Directory Listing</span>
          </span>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenJoinModal ? (
            <button
              onClick={onOpenJoinModal}
              className="bg-white hover:bg-slate-100 text-red-950 font-black px-3.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow-md hover:scale-105"
            >
              <span>Claim $390 Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/membership"
              className="bg-white hover:bg-slate-100 text-red-950 font-black px-3.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow-md hover:scale-105"
            >
              <span>Claim $390 Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={() => setIsVisible(false)}
            className="text-red-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="Close Announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
