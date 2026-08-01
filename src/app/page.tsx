"use client";

import React, { useState } from "react";
import LaunchBanner from "@/components/LaunchBanner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import MobileLogoBanner from "@/components/MobileLogoBanner";
import FoundingMembersWall from "@/components/FoundingMembersWall";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import RSVPModal from "@/components/RSVPModal";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import { Play, Sparkles, Video, Calendar, Clock, MapPin, Ticket, ExternalLink, ZoomIn, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

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

      {/* Mobile-Only Animated Logo Banner at the top above Hero */}
      <MobileLogoBanner />

      {/* Hero Section with Overlapping Stats */}
      <HeroSection
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
      />

      {/* Inaugural Event Showcase Section */}
      <section className="py-16 bg-[#0B0E14] text-white border-t border-b border-white/10 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          {/* Featured First Event Card (Flyer on Left 100% Full View, Info on Right) */}
          <div className="bg-[#12161F] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Event Flyer Image Fully Visible (No Cropping) */}
              <div 
                className="lg:col-span-5 relative group cursor-pointer" 
                onClick={() => setLightboxImage({ src: "/events/meet-and-greet-aug-24-26-v2.jpg", title: "Meet & Greet Networking Mixer — Aug 24" })}
              >
                <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-[#090C10] flex items-center justify-center p-2">
                  <img
                    src="/events/meet-and-greet-aug-24-26-v2.jpg"
                    alt="Meet & Greet Networking Mixer Event Flyer"
                    className="w-full h-auto max-h-[520px] object-contain rounded-lg group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-current" />
                    FIRST INAUGURAL EVENT
                  </div>

                  {/* Zoom Overlay Hint */}
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition shadow-lg">
                    <ZoomIn className="w-4 h-4 text-red-400" />
                    <span>Expand Flyer</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Event Details & Registration */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-extrabold text-xs uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5 text-red-400" />
                    UPCOMING INAUGURAL EVENT
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase tracking-tight text-white">
                    OUR FIRST EVENT
                  </h3>
                  <div className="text-sm font-extrabold text-red-400 uppercase tracking-wider">
                    Meet & Greet Networking Mixer
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                    Join local Melissa business owners, founders, and community leaders for our first Meet & Greet Networking Mixer! Connect with fellow entrepreneurs, build strategic partnerships, and enjoy complimentary refreshments in a relaxed setting.
                  </p>
                </div>

                {/* Info List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">DATE</div>
                      <div className="font-extrabold text-white">Monday, August 24, 2026</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">TIME</div>
                      <div className="font-extrabold text-white">6:00 PM – 8:00 PM</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">LOCATION</div>
                      <div className="font-extrabold text-white">The Red Feather</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Ticket className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">ADMISSION</div>
                      <div className="font-extrabold text-emerald-300">FREE Event — Open to All</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="https://www.eventbrite.com/e/community-commerce-melissa-meet-greet-networking-night-tickets-1995479705516?utm_experiment=test_share_listing&aff=ebdsshios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-red px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2"
                  >
                    <span>REGISTER ON EVENTBRITE</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    href="/events"
                    className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-white/20 hover:bg-white/10 text-slate-200 transition"
                  >
                    VIEW EVENT CALENDAR
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Quote & Value Proposition Section */}
      <QuoteSection />

      {/* Feature Cards Grid (Events, Directory, Get Involved) */}
      <HomeCardsGrid
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenRSVPModal={handleOpenRSVP}
        onOpenSponsorModal={() => setIsJoinModalOpen(true)}
      />



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

      <ImageLightboxModal
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageSrc={lightboxImage?.src || ""}
        title={lightboxImage?.title || ""}
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
