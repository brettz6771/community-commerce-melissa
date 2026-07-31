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

  const row1Members = MOCK_BOARD_MEMBERS.slice(0, 3);
  const row2Members = MOCK_BOARD_MEMBERS.slice(3, 6);

  const renderLeaderCard = (member: typeof MOCK_BOARD_MEMBERS[0]) => (
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
            style={{ objectPosition: member.objectPosition || "top" }}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
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

          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {member.bio}
          </p>
        </div>
      </div>
    </div>
  );

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-4">
            <h2 className="text-3xl font-extrabold font-outfit uppercase text-slate-900">
              COMMUNITY COMMERCE LEADERSHIP TEAM
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Every leader brings proven industry experience, business ownership, and dedicated service to our community mission.
            </p>
          </div>

          {/* Row 1: 3 Leaders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto items-stretch">
            {row1Members.map(renderLeaderCard)}
          </div>

          {/* Row 2: 3 Leaders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto items-stretch">
            {row2Members.map(renderLeaderCard)}
          </div>
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
