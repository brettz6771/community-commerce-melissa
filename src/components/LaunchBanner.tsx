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

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 text-white px-4 py-2.5 shadow-md border-b border-red-700/40 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
        
        {/* Left message */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <span className="bg-slate-200 text-red-950 font-bold px-2 py-0.5 rounded-full text-xs uppercase tracking-wide flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 fill-current" />
            Launch Special
          </span>
          <span className="font-medium">
            <strong className="text-slate-200">Founding Partner Membership:</strong> Only <span className="text-white font-bold text-base">$200/yr</span> <span className="line-through text-red-200 text-xs">($350/yr)</span> — Save $150!
          </span>
        </div>

        {/* Center Countdown */}
        <div className="hidden lg:flex items-center gap-2 bg-black/30 px-3 py-1 rounded-md border border-white/10 text-xs font-mono text-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-300 animate-pulse" />
          <span>Launch Offer Ends In:</span>
          <span className="font-bold text-white">
            {String(timeLeft.days).padStart(2, "0")}d : {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
          </span>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenJoinModal}
            className="bg-slate-200 hover:bg-white text-red-950 font-bold px-3 py-1 rounded-md text-xs transition flex items-center gap-1 shadow-sm"
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
