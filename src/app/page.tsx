"use client";

import React, { useState } from "react";
import LaunchBanner from "@/components/LaunchBanner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import HomeCardsGrid from "@/components/HomeCardsGrid";
import FoundingMembersWall from "@/components/FoundingMembersWall";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import RSVPModal from "@/components/RSVPModal";
import { Play, Sparkles, Trophy, Video, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleOpenRSVP = (title: string) => {
    setSelectedEventTitle(title);
    setIsRSVPModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      
      {/* Launch Promotion Banner */}
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Main Navigation Bar */}
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Hero Section with Overlapping Stats */}
      <HeroSection
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
      />

      {/* Quote & Value Proposition Section */}
      <QuoteSection />

      {/* 5 Feature Cards Grid (Events, Directory, Get Involved, Membership, Sponsorship) */}
      <HomeCardsGrid
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenRSVPModal={handleOpenRSVP}
        onOpenSponsorModal={() => setIsJoinModalOpen(true)}
      />

      {/* Founding Members Recognition Wall */}
      <FoundingMembersWall onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Video & Community Spotlight Banner */}
      <section className="py-16 bg-white text-slate-900 border-t border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-widest">
                <Video className="w-4 h-4 text-red-700" />
                FOUNDER WELCOME & SPOTLIGHT
              </div>

              <h2 className="text-3xl font-extrabold font-outfit uppercase tracking-tight text-slate-900 leading-tight">
                WELCOME TO MELISSA&apos;S <br />
                <span className="text-red-700">BUSINESS HUB</span>
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                Watch our welcome message from local Melissa business leaders explaining why Community Commerce Melissa was built: &ldquo;Not a Chamber. A Community.&rdquo;
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="btn-red px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <Play className="w-4 h-4 fill-current text-white" />
                  PLAY WELCOME VIDEO
                </button>

                <Link
                  href="/about"
                  className="text-xs text-red-700 font-bold hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  Read Our Mission & Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Video Thumbnail Placeholder */}
            <div
              onClick={() => setIsVideoModalOpen(true)}
              className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl group cursor-pointer aspect-video bg-slate-950 flex items-center justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800"
                alt="Founder Welcome Video"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="w-16 h-16 rounded-full bg-red-700/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border border-white/20">
                <Play className="w-8 h-8 fill-current text-slate-200 ml-1" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white font-medium">
                <span className="bg-slate-900/80 px-3 py-1 rounded-full border border-white/20 shadow">Welcome to Melissa Commerce (3:45)</span>
                <span className="text-slate-200 font-bold">Watch Now</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Footer */}
      <Footer />

      {/* Modals */}
      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        eventTitle={selectedEventTitle}
      />

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-red-600 transition"
            >
              ✕
            </button>
            <div className="aspect-video w-full flex items-center justify-center bg-slate-950">
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-700 text-slate-200 flex items-center justify-center mx-auto shadow-xl">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h3 className="text-xl font-bold text-white font-outfit uppercase">
                  Community Commerce Melissa — Founder Welcome Video
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  &ldquo;Building a stronger Melissa through collaboration, high-impact networking, and local business support.&rdquo;
                </p>
                <div className="text-xs text-slate-300 font-semibold">
                  Featuring Melissa Board Directors & Local Founders
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
