"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Quote, Sparkles } from "lucide-react";

export default function QuoteSection() {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasPlayed && videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.log("Autoplay deferred:", err);
          });
          setHasPlayed(true);
        }
      },
      { threshold: 0.3 }
    );

    if (videoCardRef.current) {
      observer.observe(videoCardRef.current);
    }

    return () => observer.disconnect();
  }, [hasPlayed]);

  const checkItems = [
    "Official 501(c)(3) non-profit organization",
    "Dedicated to community stewardship & giving back",
    "Fostering local business growth & relationships",
    "Accessible membership & collaborative events"
  ];

  return (
    <section className="py-16 bg-[#E5E9EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left White Box: Logo Video Animation */}
          <div
            ref={videoCardRef}
            className="lg:col-span-4 bg-white text-slate-900 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 flex flex-col items-center justify-between relative overflow-hidden group min-h-[320px]"
          >
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="font-outfit font-extrabold text-xs uppercase tracking-wider text-slate-900">
                  OUR BRAND VISION
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-red-600" />
            </div>

            {/* Video Container */}
            <div className="w-full flex-grow flex items-center justify-center relative p-2 my-auto">
              {!isVideoEnded ? (
                <video
                  ref={videoRef}
                  src="/logo-animation.mp4"
                  poster="/logo-animation-still.jpg"
                  muted
                  playsInline
                  onEnded={() => setIsVideoEnded(true)}
                  className="w-full h-auto max-h-[220px] object-contain rounded-xl transition-all duration-500"
                />
              ) : (
                <img
                  src="/logo-animation-still.jpg"
                  alt="Community Commerce Melissa Logo"
                  className="w-full h-auto max-h-[220px] object-contain rounded-xl animate-in fade-in duration-700"
                />
              )}
            </div>

            <div className="w-full pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                COMMUNITY COMMERCE MELISSA
              </span>
            </div>
          </div>

          {/* Middle Dark Card: OUR COMMITMENT */}
          <div className="lg:col-span-5 bg-[#0F1218] text-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
            {/* Background watermark quote */}
            <div className="absolute top-2 right-4 text-white/10 font-serif text-9xl font-black pointer-events-none select-none">
              “
            </div>

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest">
                <Quote className="w-4 h-4 text-slate-300" />
                OUR COMMITMENT
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase tracking-tight text-white leading-tight">
                ONE COMMUNITY. <br className="hidden sm:inline" />
                ENDLESS CONNECTIONS. <br className="hidden sm:inline" />
                <span className="text-slate-200">REAL GROWTH.</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal pt-2">
                &ldquo;We&apos;re here to champion local business, give back through non-profit stewardship, and create opportunities that fuel our community forward.&rdquo;
              </p>
            </div>

            {/* Script Accent Signature */}
            <div className="pt-6 relative z-10">
              <div className="font-script text-3xl sm:text-4xl text-slate-200 transform -rotate-2 select-none">
                Let&apos;s grow Melissa together.
              </div>
            </div>
          </div>

          {/* Right White Card: BUILT FOR CONNECTION */}
          <div className="lg:col-span-3 bg-white text-slate-900 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-extrabold font-outfit uppercase tracking-wide text-slate-900 leading-tight">
                  BUILT FOR CONNECTION. <br />
                  DESIGNED FOR GROWTH.
                </h3>
                <div className="h-1 w-10 bg-red-600 rounded mt-2"></div>
              </div>

              {/* Checkmark List */}
              <ul className="space-y-3">
                {checkItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-700 font-medium text-xs sm:text-sm">
                    <div className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-700" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Championing Melissa businesses since 2026.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
