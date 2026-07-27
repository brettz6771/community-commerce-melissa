"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { MOCK_NEWS } from "@/data/mockData";
import { Newspaper, Calendar, User, ArrowRight, Tag } from "lucide-react";

export default function NewsPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Newspaper className="w-4 h-4" />
              NEWS & BLOG HUB
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              MELISSA BUSINESS <span className="text-slate-200">NEWS</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Stay informed with local commercial updates, economic development insights, and marketing tips for Melissa entrepreneurs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_NEWS.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-red-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                      {art.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-red-600" />{art.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" />{art.author}</span>
                    </div>

                    <h3 className="font-extrabold text-lg font-outfit text-slate-900 group-hover:text-red-700 transition">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 uppercase tracking-wider pt-3"
                  >
                    Read Full Article
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto text-slate-900 relative">
            <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-lg">✕</button>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">{selectedArticle.category}</span>
            <h2 className="text-2xl font-extrabold font-outfit">{selectedArticle.title}</h2>
            <div className="text-xs text-slate-400">{selectedArticle.date} • By {selectedArticle.author}</div>
            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-56 object-cover rounded-xl" />
            <p className="text-sm text-slate-700 leading-relaxed">{selectedArticle.content}</p>
            <p className="text-xs text-slate-500">For more community updates or to submit a member announcement, contact Community Commerce Melissa.</p>
          </div>
        </div>
      )}
    </div>
  );
}
