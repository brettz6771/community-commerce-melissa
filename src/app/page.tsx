"use client";

import React, { useState } from "react";
import LaunchBanner from "@/components/LaunchBanner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import MembershipCTASection from "@/components/MembershipCTASection";
import HomeCardsGrid from "@/components/HomeCardsGrid";
import MobileLogoBanner from "@/components/MobileLogoBanner";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import RSVPModal from "@/components/RSVPModal";
import NewsletterModal from "@/components/NewsletterModal";
import { Play } from "lucide-react";

export default function HomePage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("Community Partner ($390 1st Yr • Renews $490/yr)");
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const handleOpenJoinWithTier = (tier?: string) => {
    setSelectedTier(tier || "Community Partner ($390 1st Yr • Renews $490/yr)");
    setIsJoinModalOpen(true);
  };

  const handleOpenRSVP = (title: string) => {
    setSelectedEventTitle(title);
    setIsRSVPModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      
      {/* Launch Promotion Banner */}
      <LaunchBanner onOpenJoinModal={() => handleOpenJoinWithTier()} />

      {/* Main Navigation Bar */}
      <Navbar onOpenJoinModal={() => handleOpenJoinWithTier()} />

      {/* Mobile-Only Animated Logo Banner at the top above Hero */}
      <MobileLogoBanner />

      {/* Hero Section with Overlapping Stats */}
      <HeroSection
        onOpenJoinModal={() => handleOpenJoinWithTier()}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
        onOpenNewsletterModal={() => setIsNewsletterModalOpen(true)}
      />

      {/* Quote & Value Proposition Section */}
      <QuoteSection onOpenJoinModal={() => handleOpenJoinWithTier("Community Partner ($390 1st Yr • Renews $490/yr)")} />

      {/* High-Converting Membership Call to Action Section */}
      <MembershipCTASection onOpenJoinModal={handleOpenJoinWithTier} />

      {/* Feature Cards Grid (Events, Directory, Get Involved) */}
      <HomeCardsGrid
        onOpenJoinModal={() => handleOpenJoinWithTier()}
        onOpenRSVPModal={handleOpenRSVP}
        onOpenSponsorModal={() => handleOpenJoinWithTier("Corporate & Community Sponsorship")}
      />

      {/* Main Footer */}
      <Footer />

      {/* Modals */}
      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        defaultTier={selectedTier}
      />

      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        eventTitle={selectedEventTitle}
      />

      <NewsletterModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
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
