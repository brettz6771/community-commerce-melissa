"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { MOCK_BOARD_MEMBERS, MOCK_FOUNDING_MEMBERS } from "@/data/mockData";
import { Award, Mail, Phone, Play, ShieldCheck, Sparkles, Smile } from "lucide-react";

export default function LeadershipPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeVideoMember, setActiveVideoMember] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Award className="w-4 h-4" />
              COMMUNITY LEADERSHIP
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              MEET OUR <span className="text-slate-200">LEADERSHIP</span>
            </h1>
            <p className="text-xl sm:text-2xl font-extrabold font-outfit text-red-500 tracking-wide">
              The Leadership Behind The Mission
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-1">
              Dedicated business leaders, founders, and advocates championing economic momentum, local commerce, and business growth in Melissa, Texas.
            </p>
          </div>
        </div>
      </section>

      {/* Board of Directors Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold font-outfit uppercase text-slate-900">
              COMMUNITY COMMERCE LEADERSHIP TEAM
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Every leader brings proven industry experience, business ownership, and dedicated service to our community mission.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {MOCK_BOARD_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-lg flex flex-col justify-between group hover:shadow-xl transition"
              >
                <div>
                  {/* Headshot */}
                  <div className="relative h-72 overflow-hidden bg-slate-900">
                    <img
                      src={member.headshot}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="bg-red-700 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded tracking-wider shadow">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 font-outfit">{member.name}</h3>
                      <div className="text-xs text-red-700 font-semibold">{member.business}</div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                      {member.bio}
                    </p>

                    {/* Fun Fact Box */}
                    <div className="bg-slate-100 border border-slate-200 p-3 rounded-lg flex items-start gap-2 text-[11px] text-slate-800">
                      <Smile className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Fun Fact:</strong> {member.funFact}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer / Contact */}
                <div className="p-5 pt-0 space-y-2 border-t border-slate-200/60 mt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-3">
                    <Mail className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  <button
                    onClick={() => setActiveVideoMember(member.name)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    <Play className="w-3 h-3 text-slate-200 fill-current" />
                    Watch Intro Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Members Leadership Recognition */}
      <section className="py-16 bg-[#0B0E14] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold font-outfit uppercase">
              MEET THE <span className="text-slate-200">FOUNDING MEMBERS</span>
            </h2>
            <p className="text-slate-400 text-sm">
              In addition to our board, these pioneer business leaders are helping lay the groundwork for Community Commerce Melissa.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {MOCK_FOUNDING_MEMBERS.map((fm, i) => (
              <div key={i} className="bg-[#1F2736] hover:bg-[#2A3447] border border-slate-600/60 p-4 rounded-xl text-center space-y-2 transition">
                <div className="w-10 h-10 rounded-full bg-red-800 text-slate-200 font-bold mx-auto flex items-center justify-center text-xs">
                  {fm.logoText}
                </div>
                <div className="font-bold text-xs text-white truncate">{fm.name}</div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase">{fm.highlight}</div>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="btn-red px-6 py-3 rounded-md font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              JOIN LEADERSHIP WALL AS A FOUNDING MEMBER ($200 LAUNCH RATE)
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      {activeVideoMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-slate-900 border border-white/20 p-6 rounded-xl text-center text-white space-y-4 max-w-md w-full">
            <h3 className="text-lg font-bold font-outfit">{activeVideoMember} — Video Intro</h3>
            <p className="text-xs text-slate-400">Personal video intro simulation for board member.</p>
            <button onClick={() => setActiveVideoMember(null)} className="btn-red px-4 py-1.5 rounded text-xs font-bold uppercase">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
