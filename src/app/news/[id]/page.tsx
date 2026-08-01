"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import { MOCK_NEWS } from "@/data/mockData";
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Tag, 
  ExternalLink, 
  Sparkles,
  ZoomIn
} from "lucide-react";

interface NewsArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  const resolvedParams = use(params);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const article = MOCK_NEWS.find((n) => n.id === resolvedParams.id) || MOCK_NEWS[0];

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#0B0E14] text-white py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            BACK TO NEWS & BLOG
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-extrabold text-xs uppercase tracking-widest">
              <Tag className="w-3.5 h-3.5 text-red-400" />
              {article.category}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-outfit uppercase tracking-tight text-white leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-500" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                By {article.author}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Article Content */}
      <section className="py-12 bg-[#E5E9EE] flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Featured Image Card */}
          <div className="bg-[#12161F] border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden relative group">
            <div 
              className="relative rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-[#090C10] flex items-center justify-center cursor-pointer"
              onClick={() => setLightboxImage({ src: article.image, title: article.title })}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto max-h-[550px] object-contain rounded-lg group-hover:scale-[1.01] transition duration-500"
              />
              
              {/* Zoom Overlay Hint */}
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition shadow-lg">
                <ZoomIn className="w-4 h-4 text-red-400" />
                <span>Expand Image</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-6 text-slate-800 leading-relaxed text-sm sm:text-base">
            
            <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl font-medium text-slate-900 text-sm sm:text-base">
              {article.summary}
            </div>

            <div className="space-y-5 text-slate-700 font-sans leading-relaxed whitespace-pre-line">
              {article.content}
            </div>

            {/* Event CTA Highlight Box */}
            <div className="bg-[#0B0E14] text-white rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5 mt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-extrabold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                INDEPENDENT NON-PROFIT EVENT
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-outfit text-white uppercase tracking-tight">
                  JOIN US AT OUR FIRST EVENT
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Meet & Greet Networking Mixer — Free Admission & Open to All Local Business Leaders
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-y border-white/10 py-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">DATE</div>
                  <div className="font-extrabold text-white">Monday, Aug 24, 2026</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">TIME</div>
                  <div className="font-extrabold text-white">6:00 PM – 8:00 PM</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">LOCATION</div>
                  <div className="font-extrabold text-white">The Red Feather</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="https://www.eventbrite.com/e/community-commerce-melissa-meet-greet-networking-night-tickets-1995479705516?utm_experiment=test_share_listing&aff=ebdsshios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-red px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2"
                >
                  <span>REGISTER ON EVENTBRITE</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <Link
                  href="/events"
                  className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-white/20 hover:bg-white/10 text-slate-200 transition"
                >
                  VIEW EVENT DETAILS
                </Link>
              </div>
            </div>

            {/* Share & Author Footer */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-bold text-slate-900 uppercase">PUBLISHED BY:</span>
                <span>Community Commerce Team</span>
              </div>

              <Link
                href="/news"
                className="text-xs font-extrabold text-red-700 hover:text-red-800 flex items-center gap-1 uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK TO NEWS HUB
              </Link>
            </div>

          </div>

        </div>
      </section>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      <ImageLightboxModal
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageSrc={lightboxImage?.src || ""}
        title={lightboxImage?.title || ""}
      />
    </div>
  );
}
