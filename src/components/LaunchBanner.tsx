"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, X, Clock } from "lucide-react";
import Link from "next/link";

export default function LaunchBanner({ onOpenJoinModal }: { onOpenJoinModal?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hidden for live launch per request
  return null;
    <div className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 text-white px-4 py-2.5 shadow-md border-b border-red-700/40 relative z-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
        
        {/* Left message */}
        <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            100% FREE Tier Available
          </span>
          <span className="font-medium text-xs sm:text-sm">
            <strong className="text-slate-200">Founding Partner Rate:</strong> Only <span className="text-white font-extrabold text-sm sm:text-base">$200/yr</span> <span className="inline-flex items-center gap-1 bg-black/40 border border-red-400/40 text-red-200 line-through font-bold text-xs px-2 py-0.5 rounded shadow-inner ml-1">$350 Regular</span> <span className="bg-emerald-500 text-slate-950 font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full ml-1 uppercase shadow-md">SAVE $150</span>
          </span>
        </div>

        {/* Right Action & Countdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Countdown Timer next to Claim button */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md border border-white/20 text-xs font-mono text-slate-200 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-slate-300 animate-pulse" />
            <span className="hidden sm:inline">Offer Ends:</span>
            <span className="font-bold text-white">
              {String(timeLeft.days).padStart(2, "0")}d : {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
            </span>
          </div>

          <button
            onClick={onOpenJoinModal}
            className="bg-slate-200 hover:bg-white text-red-950 font-bold px-3.5 py-1.5 rounded-md text-xs transition flex items-center gap-1.5 shadow-md"
          >
            Claim $200 Rate
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

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
