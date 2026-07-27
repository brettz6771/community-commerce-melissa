"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { Camera, Video, Play } from "lucide-react";

export default function PhotosVideosPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  const mediaItems = [
    { title: "Melissa Business Expo Highlights", type: "video", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800" },
    { title: "Monthly Mixer at Red Feather Social", type: "photo", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800" },
    { title: "Ribbon Cutting: Landmark Title Melissa", type: "video", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" },
    { title: "Drone Aerial View of Melissa Town Center", type: "video", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" },
    { title: "Coffee & Connections Morning Meetup", type: "photo", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" },
    { title: "Women in Business Summit", type: "photo", url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Camera className="w-4 h-4" />
              MEDIA GALLERY
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              PHOTO & VIDEO <span className="text-amber-400">LIBRARY</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore high-resolution photography, event recap videos, ribbon cutting celebrations, and drone footage of Melissa, Texas.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMedia(item.title)}
                className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative aspect-video group cursor-pointer"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-700 text-amber-300 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="font-bold truncate">{item.title}</span>
                  <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] uppercase text-amber-400">
                    {item.type}
                  </span>
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

      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="bg-slate-900 border border-white/20 p-6 rounded-xl text-center text-white space-y-4 max-w-lg w-full relative">
            <button onClick={() => setActiveMedia(null)} className="absolute top-3 right-3 text-slate-400">✕</button>
            <h3 className="text-lg font-bold font-outfit">{activeMedia}</h3>
            <p className="text-xs text-slate-400">Media viewer simulation — High resolution asset preview.</p>
          </div>
        </div>
      )}
    </div>
  );
}
