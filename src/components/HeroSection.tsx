"use client";

import React from "react";
import { Users, TrendingUp, Calendar, Heart, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  onOpenJoinModal?: () => void;
  onOpenVideoModal?: () => void;
}

export default function HeroSection({ onOpenJoinModal, onOpenVideoModal }: HeroSectionProps) {
  return (
    <section className="relative bg-[#0B0E14] text-white pt-12 pb-24 md:pb-32 overflow-hidden border-b border-white/10">
      
      {/* Background Image Layer matching input_file_1.png */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105 transform duration-700"
        style={{
          backgroundImage: `url('/hero-networking.jpg')`
        }}
      />
      
      {/* Radial Gradient Overlays for Cinematic Feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/85 to-[#0B0E14]/60" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="max-w-3xl space-y-6">
          
          {/* Light Gray Accent Subtitle */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-slate-200 animate-ping"></span>
            STRONGER TOGETHER
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-outfit tracking-tight leading-tight">
            <span className="text-slate-400 font-extrabold">One Community.</span> <br />
            <span className="text-white font-extrabold">Endless Connections.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
            Creating connections. Driving growth. <br />
            Building a stronger Melissa.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenJoinModal}
              className="btn-red px-7 py-3.5 rounded-md font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-950/50 flex items-center gap-2"
            >
              JOIN THE MOVEMENT
            </button>

            <Link
              href="/events"
              className="btn-gold-outline px-6 py-3.5 rounded-md font-bold text-sm uppercase tracking-wider flex items-center gap-2"
            >
              EXPLORE EVENTS
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>

            {/* Video Play Button */}
            {onOpenVideoModal && (
              <button
                onClick={onOpenVideoModal}
                className="hidden sm:flex items-center gap-2 text-xs text-slate-300 hover:text-white transition group ml-2"
              >
                <span className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-red-600 flex items-center justify-center border border-white/20 transition">
                  <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                </span>
                <span className="font-semibold underline underline-offset-4 decoration-slate-300">Watch Welcome Video</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Floating Stats Bar (Overlapping Hero Bottom directly matching mockup) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-32 z-20">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-slate-900">
          
          {/* Stat 1 */}
          <div className="flex items-center gap-4 border-r border-slate-200/80 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold font-outfit text-red-700">500+</div>
              <div className="text-xs md:text-sm font-semibold text-slate-600 leading-snug">Connections Made</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-4 border-r border-slate-200/80 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold font-outfit text-red-700">50+</div>
              <div className="text-xs md:text-sm font-semibold text-slate-600 leading-snug">Local Businesses Supported</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-4 border-r border-slate-200/80 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold font-outfit text-red-700">50+</div>
              <div className="text-xs md:text-sm font-semibold text-slate-600 leading-snug">Events Each Year</div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold font-outfit text-red-700">1 GOAL</div>
              <div className="text-xs md:text-sm font-semibold text-slate-600 leading-snug">A Stronger Melissa</div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
