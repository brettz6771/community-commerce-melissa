"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Search, 
  Users, 
  Award, 
  Star, 
  CheckCircle2, 
  ChevronRight,
  UserPlus,
  Handshake,
  Building2
} from "lucide-react";
import Link from "next/link";
import { MOCK_EVENTS, MOCK_BUSINESSES } from "@/data/mockData";

interface HomeCardsGridProps {
  onOpenJoinModal?: () => void;
  onOpenRSVPModal?: (eventTitle: string) => void;
  onOpenSponsorModal?: () => void;
}

export default function HomeCardsGrid({
  onOpenJoinModal,
  onOpenRSVPModal,
  onOpenSponsorModal
}: HomeCardsGridProps) {
  const [directoryQuery, setDirectoryQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPreviewBusinesses = MOCK_BUSINESSES.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(directoryQuery.toLowerCase()) ||
                          biz.category.toLowerCase().includes(directoryQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || biz.category === selectedCategory;
    return matchesSearch && matchesCat;
  }).slice(0, 4);

  return (
    <section className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Grid Layout matching Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          
          {/* Card 1: EVENTS */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-shadow">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b border-red-800">
                <div className="w-8 h-8 rounded bg-red-700 flex items-center justify-center text-white shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  EVENTS
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    UPCOMING EVENTS
                  </h4>
                  <p className="text-xs text-slate-500">
                    Join us for our next event and start making connections!
                  </p>
                </div>

                {/* Events list */}
                <div className="space-y-3">
                  {MOCK_EVENTS.slice(0, 3).map((evt) => (
                    <div key={evt.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="bg-[#0B0E14] text-white rounded p-1.5 text-center shrink-0 w-12">
                          <div className="text-[10px] uppercase font-bold text-amber-400 leading-none">{evt.month}</div>
                          <div className="text-sm font-extrabold leading-none pt-0.5">{evt.day}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate leading-tight">{evt.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{evt.location}</div>
                          <div className="text-[10px] text-red-700 font-semibold">{evt.time}</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onOpenRSVPModal?.(evt.title)}
                        className="bg-red-700 hover:bg-red-800 text-white font-bold text-[10px] px-2 py-1.5 rounded uppercase tracking-wider shrink-0 transition"
                      >
                        REGISTER
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 pt-0">
              <Link
                href="/events"
                className="w-full btn-red py-2.5 rounded text-center text-xs font-extrabold uppercase tracking-wider block"
              >
                VIEW ALL EVENTS
              </Link>
            </div>
          </div>

          {/* Card 2: BUSINESS DIRECTORY */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-shadow">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b border-red-800">
                <div className="w-8 h-8 rounded bg-red-700 flex items-center justify-center text-white shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  BUSINESS DIRECTORY
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    FIND LOCAL. SUPPORT LOCAL. GROW LOCAL.
                  </h4>
                </div>

                {/* Filter Controls */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search businesses..."
                      value={directoryQuery}
                      onChange={(e) => setDirectoryQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Home Services">Home Services</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Hospitality & Dining">Hospitality & Dining</option>
                  </select>
                </div>

                {/* Preview List */}
                <div className="space-y-2 pt-1">
                  {filteredPreviewBusinesses.map((biz) => (
                    <div key={biz.id} className="bg-slate-50 border border-slate-200 p-2 rounded flex items-center gap-2.5">
                      <img src={biz.logo} alt={biz.name} className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{biz.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{biz.category} • Melissa, TX</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 pt-0">
              <Link
                href="/directory"
                className="w-full btn-red py-2.5 rounded text-center text-xs font-extrabold uppercase tracking-wider block"
              >
                VIEW DIRECTORY
              </Link>
            </div>
          </div>

          {/* Card 3: GET INVOLVED */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-shadow">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b border-red-800">
                <div className="w-8 h-8 rounded bg-red-700 flex items-center justify-center text-white shrink-0">
                  <Handshake className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  GET INVOLVED
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    BIG IMPACT. MANY WAYS TO GET INVOLVED.
                  </h4>
                  <p className="text-xs text-slate-500 pt-0.5">
                    There are many ways to be a part of something great.
                  </p>
                </div>

                {/* Subitems */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-50 transition cursor-pointer" onClick={onOpenJoinModal}>
                    <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">BECOME A MEMBER</div>
                      <div className="text-[11px] text-slate-500">Join our community of local business leaders.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-50 transition cursor-pointer" onClick={onOpenSponsorModal}>
                    <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">SPONSOR AN EVENT</div>
                      <div className="text-[11px] text-slate-500">Promote your business and support our mission.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-50 transition">
                    <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">ATTEND AN EVENT</div>
                      <div className="text-[11px] text-slate-500">Network, connect and build lasting relationships.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 pt-0">
              <button
                onClick={onOpenJoinModal}
                className="w-full btn-red py-2.5 rounded text-center text-xs font-extrabold uppercase tracking-wider block"
              >
                GET INVOLVED
              </button>
            </div>
          </div>

          {/* Card 4: MEMBERSHIP */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-shadow">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b border-red-800">
                <div className="w-8 h-8 rounded bg-red-700 flex items-center justify-center text-white shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  MEMBERSHIP
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    BELONG. CONNECT. GROW TOGETHER.
                  </h4>
                  <p className="text-xs text-slate-500 pt-0.5">
                    Membership opens doors, builds relationships, and strengthens our community.
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Increase Your Visibility</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Exclusive Networking</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Business Resources</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Community Impact</span>
                  </li>
                </ul>

                {/* Photo Preview */}
                <div className="pt-2">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400"
                    alt="Melissa Members"
                    className="w-full h-24 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 pt-0">
              <button
                onClick={onOpenJoinModal}
                className="w-full btn-red py-2.5 rounded text-center text-xs font-extrabold uppercase tracking-wider block"
              >
                BECOME A MEMBER
              </button>
            </div>
          </div>

          {/* Card 5: SPONSORSHIP */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-shadow">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b border-red-800">
                <div className="w-8 h-8 rounded bg-red-700 flex items-center justify-center text-white shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  SPONSORSHIP
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    PARTNER WITH PURPOSE.
                  </h4>
                  <p className="text-xs text-slate-500 pt-0.5">
                    Sponsorships help fuel events, programs, and initiatives that make a difference.
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Showcase Your Brand</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Support Local Growth</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Make Lasting Impact</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Reach a Targeted Audience</span>
                  </li>
                </ul>

                {/* Photo Preview */}
                <div className="pt-2">
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400"
                    alt="Sponsor Events"
                    className="w-full h-24 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 pt-0">
              <button
                onClick={onOpenSponsorModal}
                className="w-full btn-red py-2.5 rounded text-center text-xs font-extrabold uppercase tracking-wider block"
              >
                SPONSOR TODAY
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
