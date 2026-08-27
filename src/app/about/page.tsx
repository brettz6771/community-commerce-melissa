"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import PageTitle from "@/components/PageTitle";
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  History
} from "lucide-react";

export default function AboutPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const coreValues = [
    { title: "Servant Leadership & Impact", desc: "Fostering genuine relationships, mentorship, and meaningful community service over transactional networking." },
    { title: "Economic Momentum", desc: "Equipping small businesses, corporate entities, and entrepreneurs with tools, visibility, and networking to scale." },
    { title: "Non-profit stewardship", desc: "Funneling membership dues and expo proceeds back into Collin County school districts and local charities." }
  ];

  const milestones = [
    { year: "Q1 2026", title: "Community Vision Founded", desc: "Local Melissa business leaders unite to form Community Commerce Melissa." },
    { year: "Q2 2026", title: "Official 501(c)(3) Non-Profit Status", desc: "Established Community Commerce Melissa as a registered 501(c)(3) non-profit organization." },
    { year: "Q3 2026", title: "First Annual Melissa Expo", desc: "Bringing 60+ local vendors and 1,000+ residents together at the Z-Plex." },
    { year: "Q4 2026+", title: "Digital Hub & Member Portal", desc: "Expanding interactive tools, job boards, and business referral automation." }
  ];

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="About Us" />
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Users className="w-4 h-4" />
              ABOUT COMMUNITY COMMERCE MELISSA
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              &ldquo;Not a Chamber. <span className="text-slate-200">A Community.&rdquo;</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              We are an official 501(c)(3) non-profit organization dedicated to serving Melissa, giving back to local causes, and championing local business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900 uppercase">
                  WHY WE STARTED & WHY WE&apos;RE DIFFERENT
                </h2>
                <div className="h-1 w-16 bg-red-600 rounded mt-2"></div>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Melissa, Texas is one of the fastest growing communities in North Texas. As new neighborhoods expand and commercial development accelerates, local business owners needed more than passive dues and slow red tape.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                <strong>Community Commerce Melissa</strong> was founded as an official 501(c)(3) non-profit organization to provide a nimble, relationship-driven platform focused on giving back, community stewardship, and active local promotion.
              </p>

              <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-lg">
                <p className="text-slate-800 text-sm font-semibold italic">
                  &ldquo;Our mission is to serve our community — giving back to local initiatives while putting your business directly in front of residents and leaders.&rdquo;
                </p>
                <div className="text-xs font-bold text-red-700 mt-2">— Melissa Commerce Founders</div>
              </div>
            </div>

            {/* Cardinal Animation Video Container */}
            <div className="flex items-center justify-center bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200 overflow-hidden">
              <video
                src="/logo-animation.mp4"
                poster="/logo-animation-still.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-auto max-h-[420px] object-contain rounded-xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-16 bg-[#E5E9EE] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold font-outfit text-slate-900 uppercase">OUR MISSION</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To serve Melissa, Texas as a dedicated 501(c)(3) non-profit organization — connecting local entrepreneurs, giving back to community causes, and building a supportive, thriving economic ecosystem.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold font-outfit text-slate-900 uppercase">OUR VISION</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To build a vibrant, connected Melissa community where local businesses, entrepreneurs, and families thrive together — creating lasting economic opportunity, fostering genuine relationships, and making a meaningful impact through non-profit service.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-16 bg-[#0B0E14] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest">
              <Heart className="w-4 h-4" />
              GUIDING PRINCIPLES
            </div>
            <h2 className="text-3xl font-extrabold font-outfit text-white uppercase">
              OUR CORE PILLARS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div key={idx} className="bg-[#151922] p-6 rounded-xl border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-full bg-red-700 text-slate-200 font-bold flex items-center justify-center text-xs">
                  0{idx + 1}
                </div>
                <h4 className="font-extrabold text-white text-base font-outfit">{val.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-widest">
              <History className="w-4 h-4" />
              TIMELINE OF MILESTONES
            </div>
            <h2 className="text-3xl font-extrabold font-outfit text-slate-900 uppercase">
              BUILDING THE FUTURE OF MELISSA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 relative">
                <div className="text-xs font-black text-red-700 bg-red-100 inline-block px-2.5 py-0.5 rounded-full uppercase">
                  {m.year}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{m.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
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
    </div>
  );
}
