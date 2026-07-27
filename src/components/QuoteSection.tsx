"use client";

import React from "react";
import { CheckCircle2, Quote } from "lucide-react";

export default function QuoteSection() {
  const checkItems = [
    "Modern, mobile-first experience",
    "Fast, secure, and easy to manage",
    "Built to engage members and attract new ones",
    "Scalable for today, ready for tomorrow"
  ];

  return (
    <section className="py-16 bg-[#E5E9EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Dark Quote Card */}
          <div className="lg:col-span-7 bg-[#0F1218] text-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
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
                &ldquo;We&apos;re here to champion local business, foster meaningful connections, and create opportunity that fuels our community forward.&rdquo;
              </p>
            </div>

            {/* Script Accent Signature */}
            <div className="pt-6 relative z-10">
              <div className="font-script text-3xl sm:text-4xl text-slate-200 transform -rotate-2 select-none">
                Let&apos;s grow Melissa together.
              </div>
            </div>
          </div>

          {/* Right Light Value Prop Card */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-8 md:p-10 shadow-lg border border-slate-200 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-extrabold font-outfit uppercase tracking-wide text-slate-900 leading-tight">
                  BUILT FOR CONNECTION. <br />
                  DESIGNED FOR GROWTH.
                </h3>
                <div className="h-1 w-12 bg-red-600 rounded mt-2"></div>
              </div>

              {/* Checkmark List */}
              <ul className="space-y-4">
                {checkItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium text-sm sm:text-base">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-red-700" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 font-medium">
              Championing Melissa businesses since 2026.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
