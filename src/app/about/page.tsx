"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { 
  Users, 
  Target, 
  Compass, 
  Heart, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Play, 
  History,
  ShieldCheck
} from "lucide-react";

export default function AboutPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const coreValues = [
    { title: "Collaboration Over Competition", desc: "We believe when one Melissa business wins, our entire town grows stronger together." },
    { title: "Accessibility & Value", desc: "Keeping membership accessible and focused on delivering real tangible value rather than steep annual dues." },
    { title: "Local First Impact", desc: "Prioritizing local vendors, local jobs, and local capital reinvestment in Collin County." },
    { title: "Authentic Connection", desc: "Fostering genuine business relationships over transactional networking." }
  ];

  const milestones = [
    { year: "Q1 2026", title: "Community Vision Founded", desc: "Brett Zenker and local business leaders unite to form Community Commerce Melissa." },
    { year: "Q2 2026", title: "Launch of Founding Member Special", desc: "Released the $200 Launch Special for Founding Partners with permanent logo recognition." },
    { year: "Q3 2026", title: "First Annual Melissa Expo", desc: "Bringing 60+ local vendors and 1,000+ residents together at the Z-Plex." },
    { year: "Q4 2026+", title: "Digital Hub & Member Portal", desc: "Expanding interactive tools, job boards, and business referral automation." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Users className="w-4 h-4" />
              ABOUT COMMUNITY COMMERCE MELISSA
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              &ldquo;Not a Chamber. <span className="text-amber-400">A Community.&rdquo;</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              We are a modern, relationship-driven commerce network championing Melissa businesses through visibility, mentorship, and high-impact events.
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
                <strong>Community Commerce Melissa</strong> was founded to provide a nimble, technology-forward platform built on meaningful relationships, accessible membership, and active local promotion.
              </p>

              <div className="bg-slate-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <p className="text-slate-800 text-sm font-semibold italic">
                  &ldquo;Our focus is on delivering immediate value to local owners — putting your brand in front of residents and connecting you directly with decision makers.&rdquo;
                </p>
                <div className="text-xs font-bold text-red-700 mt-2">— Brett Zenker, Founder</div>
              </div>
            </div>

            {/* Video Feature Card */}
            <div className="bg-[#0F1218] text-white rounded-2xl p-8 shadow-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                  CC
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white font-outfit uppercase">WELCOME VIDEO FROM THE FOUNDERS</h3>
                  <p className="text-xs text-amber-400">Hear directly from Melissa leaders</p>
                </div>
              </div>

              <div 
                onClick={() => setIsVideoModalOpen(true)}
                className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 cursor-pointer border border-white/15 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                  alt="Founder Video"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-700 text-amber-300 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Click play to watch our 3-minute story on building a stronger Melissa economy.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-16 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold font-outfit text-slate-900 uppercase">OUR MISSION</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To connect, promote, educate, and strengthen Melissa businesses through authentic relationships, accessible resources, and high-visibility community events.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold font-outfit text-slate-900 uppercase">OUR VISION</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To become Melissa&apos;s primary online and offline business destination—a thriving ecosystem where local enterprises of all sizes flourish together.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-[#0B0E14] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold font-outfit uppercase">
              OUR CORE <span className="text-amber-400">VALUES</span>
            </h2>
            <p className="text-slate-400 text-sm">The principles that guide every decision and event we host.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div key={idx} className="bg-[#151922] p-6 rounded-xl border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-full bg-red-700 text-amber-300 font-bold flex items-center justify-center text-xs">
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

      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative w-full max-w-3xl bg-black rounded-xl p-8 text-center text-white space-y-4">
            <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold font-outfit">Community Commerce Founder Welcome Video</h3>
            <p className="text-xs text-slate-400">Video Player Simulation — Featuring Brett Zenker</p>
          </div>
        </div>
      )}
    </div>
  );
}
