"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Quote, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const LEADERS = [
  { name: "Chauntel Busche", headshot: "/ccm-leaders/chauntel-busche.jpg" },
  { name: "Joey Mitnick", headshot: "/ccm-leaders/joey-mitnick-v2.jpg" },
  { name: "Jana Scarpati Martinez", headshot: "/ccm-leaders/jana-martinez-v2.jpg" },
  { name: "Brett Zenker", headshot: "/ccm-leaders/brett-zenker.jpg" },
  { name: "Alta Simmons", headshot: "/ccm-leaders/alta-simmons.jpg" },
  { name: "Cindy Karman", headshot: "/ccm-leaders/cindy-karman.jpg" },
  { name: "Jax Edwards", headshot: "/ccm-leaders/jax.jpg" }
];

export default function QuoteSection({ onOpenJoinModal }: { onOpenJoinModal?: () => void }) {
  const [hasPlayed, setHasPlayed] = useState(false);
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
      { threshold: 0.2 }
    );

    if (videoCardRef.current) {
      observer.observe(videoCardRef.current);
    }

    return () => observer.disconnect();
  }, [hasPlayed]);

  const checkItems = [
    "Community-driven organization built for Melissa",
    "Dedicated to community stewardship & giving back",
    "Fostering local business growth & relationships",
    "Accessible membership & collaborative events"
  ];

  return (
    <section className="pt-12 pb-10 sm:pt-16 sm:pb-12 bg-[#E5E9EE]">
      {/* Wide Container matching Header */}
      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Mobile Only: Meet Our Leaders Card */}
          <div className="flex lg:hidden flex-col justify-between bg-gradient-to-br from-white to-slate-50 text-slate-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 min-h-[380px]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-widest">
                <Users className="w-4 h-4" />
                COMMUNITY LEADERS
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-outfit uppercase tracking-tight text-slate-900 leading-tight">
                  THE VISIONARIES <br />
                  BEHIND THE MISSION
                </h3>
                <div className="h-1 w-10 bg-red-600 rounded mt-2"></div>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal pt-1">
                Our board of dedicated local business owners, founders, and advocates is committed to championing economic momentum and community service in Melissa, Texas.
              </p>

              {/* Avatars Stack */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex -space-x-2.5 overflow-visible">
                  {LEADERS.map((leader, i) => (
                    <img
                      key={i}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover transition-transform duration-300 hover:scale-110 hover:z-10 cursor-pointer"
                      src={leader.headshot}
                      alt={leader.name}
                      title={leader.name}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-semibold tracking-wide">
                  7 Board Members
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <Link
                href="/leadership"
                className="inline-flex items-center justify-between w-full px-5 py-3.5 bg-[#0F1218] hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-md group"
              >
                <span>Meet the Leadership Team</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Left White Box: Pure Animated Logo Video (Continuously Looping) - Desktop Only */}
          <div
            ref={videoCardRef}
            className="hidden lg:flex lg:col-span-4 bg-white text-slate-900 rounded-2xl p-3 sm:p-4 shadow-lg border border-slate-200 items-center justify-center relative overflow-hidden min-h-[380px]"
          >
            <video
              ref={videoRef}
              src="/logo-animation.mp4"
              poster="/logo-animation-still.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full max-h-[360px] sm:max-h-[380px] object-contain rounded-xl transform scale-105 transition-all duration-500"
            />
          </div>

          {/* Middle Dark Card: OUR COMMITMENT */}
          <div className="lg:col-span-4 bg-[#0F1218] text-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
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

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal pt-1">
                &ldquo;We&apos;re here to champion local business, give back through local stewardship, and create opportunities that fuel our community forward.&rdquo;
              </p>
            </div>

            {/* Script Accent Signature */}
            <div className="pt-4 relative z-10">
              <div className="font-script text-3xl sm:text-4xl text-slate-200 transform -rotate-2 select-none">
                Let&apos;s grow Melissa together.
              </div>
            </div>
          </div>

          {/* Right White Card: BUILT FOR CONNECTION */}
          <div className="lg:col-span-4 bg-white text-slate-900 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 flex flex-col justify-between min-h-[380px]">
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

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {onOpenJoinModal ? (
                <button
                  onClick={onOpenJoinModal}
                  className="w-full btn-red py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition"
                >
                  <span>Join Community Commerce</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/membership"
                  className="w-full btn-red py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition text-center"
                >
                  <span>Join Community Commerce</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
