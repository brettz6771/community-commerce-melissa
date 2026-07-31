"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { MOCK_NEWS } from "@/data/mockData";
import { Newspaper, Calendar, User, ArrowRight, Tag, Sparkles } from "lucide-react";

export default function NewsPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Newspaper className="w-4 h-4" />
              NEWS & BLOG HUB
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              COMMUNITY <span className="text-slate-200">ANNOUNCEMENTS</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Stay informed with official announcements, community milestone updates, and event news from Community Commerce Melissa.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-[#E5E9EE] flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {MOCK_NEWS.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 grid grid-cols-1 md:grid-cols-12 group"
            >
              {/* Left Column: Image Banner */}
              <Link href={`/news/${art.id}`} className="md:col-span-5 relative h-64 md:h-auto bg-slate-900 overflow-hidden block">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-700 text-white text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  {art.category}
                </div>
              </Link>

              {/* Right Column: Article Summary & Details */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-600" />
                      {art.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      By {art.author}
                    </span>
                  </div>

                  <Link href={`/news/${art.id}`}>
                    <h2 className="text-xl sm:text-2xl font-extrabold font-outfit text-slate-900 group-hover:text-red-700 transition-colors leading-snug">
                      {art.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/news/${art.id}`}
                    className="btn-red px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow flex items-center gap-2"
                  >
                    <span>READ FULL ARTICLE</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <span className="text-xs font-bold text-slate-400">
                    Official Story
                  </span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}

