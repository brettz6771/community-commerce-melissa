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
  Building2,
  Clock,
  MapPin
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
    <section className="py-14 bg-[#F8FAFC]">
      {/* Expanded Container Width to eliminate squished cards */}
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        
        {/* 5-Column Responsive Grid with optimized column widths & spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-5 items-stretch">
          
          {/* Card 1: EVENTS */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b-2 border-red-700">
                <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  EVENTS
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    UPCOMING EVENTS
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Join us for our next event and start making connections!
                  </p>
                </div>

                {/* Events list with spacious stacked layout */}
                <div className="space-y-3">
                  {MOCK_EVENTS.slice(0, 3).map((evt) => (
                    <div 
                      key={evt.id} 
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-3 rounded-xl space-y-2 transition-colors"
                    >
                      {/* Top Bar: Date Badge & Register Button */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="bg-[#0B0E14] text-white rounded-md px-2.5 py-1 flex items-center gap-1.5 shrink-0 border border-slate-300/30">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{evt.month}</span>
                          <span className="text-xs font-black text-white">{evt.day}</span>
                        </div>

                        <button
                          onClick={() => onOpenRSVPModal?.(evt.title)}
                          className="bg-red-700 hover:bg-red-800 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 transition shadow-sm"
                        >
                          REGISTER
                        </button>
                      </div>

                      {/* Event Title (No Truncation) */}
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-900 leading-snug group-hover:text-red-700 transition-colors">
                          {evt.title}
                        </h5>
                        
                        <div className="mt-1 flex flex-col text-[11px] text-slate-500 space-y-0.5">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{evt.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 sm:p-5 pt-0">
              <Link
                href="/events"
                className="w-full btn-red py-3 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block shadow-md hover:shadow-lg transition-all"
              >
                VIEW ALL EVENTS
              </Link>
            </div>
          </div>

          {/* Card 2: BUSINESS DIRECTORY */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b-2 border-red-700">
                <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  BUSINESS DIRECTORY
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    FIND LOCAL. SUPPORT LOCAL. GROW LOCAL.
                  </h4>
                </div>

                {/* Filter Controls */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search businesses..."
                      value={directoryQuery}
                      onChange={(e) => setDirectoryQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600 transition"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    <option value="All">All Categories</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Home Services">Home Services</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Hospitality & Dining">Hospitality & Dining</option>
                  </select>
                </div>

                {/* Business Preview List */}
                <div className="space-y-2.5 pt-1">
                  {filteredPreviewBusinesses.map((biz) => (
                    <div key={biz.id} className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-100/80 transition-colors">
                      <img src={biz.logo} alt={biz.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-xs text-slate-900 truncate leading-tight">{biz.name}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{biz.category} • Melissa, TX</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 sm:p-5 pt-0">
              <Link
                href="/directory"
                className="w-full btn-red py-3 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block shadow-md hover:shadow-lg transition-all"
              >
                VIEW DIRECTORY
              </Link>
            </div>
          </div>

          {/* Card 3: GET INVOLVED */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b-2 border-red-700">
                <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Handshake className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  GET INVOLVED
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    BIG IMPACT. MANY WAYS TO GET INVOLVED.
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    There are many ways to be a part of something great.
                  </p>
                </div>

                {/* Subitems */}
                <div className="space-y-3">
                  <div 
                    className="flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition cursor-pointer" 
                    onClick={onOpenJoinModal}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-900 flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                      1
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">BECOME A MEMBER</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">Join our community of local business leaders.</div>
                    </div>
                  </div>

                  <div 
                    className="flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition cursor-pointer" 
                    onClick={onOpenSponsorModal}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-900 flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                      2
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">SPONSOR AN EVENT</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">Promote your business and support our mission.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-900 flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                      3
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">ATTEND AN EVENT</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">Network, connect and build lasting relationships.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 sm:p-5 pt-0">
              <button
                onClick={onOpenJoinModal}
                className="w-full btn-red py-3 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block shadow-md hover:shadow-lg transition-all"
              >
                GET INVOLVED
              </button>
            </div>
          </div>

          {/* Card 4: MEMBERSHIP */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b-2 border-red-700">
                <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  MEMBERSHIP
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    BELONG. CONNECT. GROW TOGETHER.
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Membership opens doors, builds relationships, and strengthens our community.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Increase Your Visibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Exclusive Networking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Business Resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Community Impact</span>
                  </li>
                </ul>

                {/* Photo Preview */}
                <div className="pt-2">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400"
                    alt="Melissa Members"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 sm:p-5 pt-0">
              <button
                onClick={onOpenJoinModal}
                className="w-full btn-red py-3 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block shadow-md hover:shadow-lg transition-all"
              >
                BECOME A MEMBER
              </button>
            </div>
          </div>

          {/* Card 5: SPONSORSHIP */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white p-4 flex items-center gap-3 border-b-2 border-red-700">
                <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base tracking-wider uppercase text-white">
                  SPONSORSHIP
                </h3>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    PARTNER WITH PURPOSE.
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Sponsorships help fuel events, programs, and initiatives that make a difference.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Showcase Your Brand</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Support Local Growth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Make Lasting Impact</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Reach a Targeted Audience</span>
                  </li>
                </ul>

                {/* Photo Preview */}
                <div className="pt-2">
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400"
                    alt="Sponsor Events"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-4 sm:p-5 pt-0">
              <button
                onClick={onOpenSponsorModal}
                className="w-full btn-red py-3 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block shadow-md hover:shadow-lg transition-all"
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
