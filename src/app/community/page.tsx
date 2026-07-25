"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { Heart, Building, GraduationCap, Users, ShieldCheck } from "lucide-react";

export default function CommunityPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const hubs = [
    { title: "City & Economic Updates", desc: "Keep pace with infrastructure, new commercial zoning, and growth plans along Sam Rayburn Tollway.", icon: Building },
    { title: "Volunteer Opportunities", desc: "Give back to local Melissa non-profits, city beautification projects, and community festivals.", icon: Heart },
    { title: "Youth Entrepreneurship", desc: "Supporting Melissa ISD high school students with mentorship, internships, and business launch grants.", icon: GraduationCap },
    { title: "Nonprofit Partnerships", desc: "Empowering local charitable organizations with free visibility and fundraising event space.", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Heart className="w-4 h-4" />
              COMMUNITY HUB
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              COMMUNITY & <span className="text-amber-400">ECONOMIC HUB</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Strengthening Melissa through volunteerism, youth scholarships, city partnerships, and non-profit support.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hubs.map((h, i) => {
              const IconComp = h.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold font-outfit text-slate-900 uppercase">{h.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{h.desc}</p>
                  <button
                    onClick={() => setIsJoinModalOpen(true)}
                    className="text-xs font-bold text-red-700 hover:text-red-800 uppercase tracking-wider block pt-2"
                  >
                    Learn More & Get Involved &rarr;
                  </button>
                </div>
              );
            })}
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
