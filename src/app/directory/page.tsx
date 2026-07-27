"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { MOCK_BUSINESSES } from "@/data/mockData";
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  ShieldCheck, 
  Filter, 
  ExternalLink,
  Map as MapIcon,
  Grid
} from "lucide-react";

export default function DirectoryPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const categories = [
    "All",
    "Health & Wellness",
    "Hospitality & Dining",
    "Home Services",
    "Real Estate",
    "Daycare & Retail",
    "Legal & Financial"
  ];

  const filteredBusinesses = MOCK_BUSINESSES.filter((biz) => {
    const matchesCat = selectedCategory === "All" || biz.category === selectedCategory;
    const matchesSearch = biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          biz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          biz.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Building2 className="w-4 h-4" />
              MELISSA BUSINESS DIRECTORY
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              SEARCHABLE <span className="text-amber-400">DIRECTORY</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Find local, support local, and grow local. Discover trusted products and professional services right here in Melissa, Texas.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-red-700 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & View Toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search business name, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 transition ${
                  viewMode === "grid" ? "bg-white text-red-700 shadow" : "text-slate-600"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 transition ${
                  viewMode === "map" ? "bg-white text-red-700 shadow" : "text-slate-600"
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {viewMode === "map" ? (
            /* Interactive Map Simulation */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold font-outfit text-lg text-slate-900">INTERACTIVE MELISSA MAP VIEW</h3>
                  <p className="text-xs text-slate-500">Showing locations for {filteredBusinesses.length} Melissa businesses</p>
                </div>
                <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded text-xs">
                  GPS Active
                </span>
              </div>

              {/* Map Embed Frame */}
              <div className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center">
                <iframe
                  title="Melissa Texas Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53372.4849202875!2d-96.61110530752538!3d33.28594957385923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c153ff294025b%3A0xb3641b4b604e0e5a!2sMelissa%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  className="w-full h-full border-0 filter grayscale opacity-90"
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>

                <div className="absolute top-4 left-4 bg-[#0B0E14] text-white p-3 rounded-lg border border-amber-400/40 shadow-xl max-w-xs text-xs space-y-1">
                  <div className="font-bold text-amber-400">Melissa Commerce Pinpoint</div>
                  <div className="text-slate-300">Click any marker on the map to open member profile.</div>
                </div>
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Image & Badge */}
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src={biz.image}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-amber-400 text-red-950 font-black text-[9px] uppercase px-2.5 py-1 rounded shadow-md tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-red-950 fill-current" />
                          {biz.badge}
                        </span>
                      </div>

                      {/* Logo Overlap */}
                      <div className="absolute -bottom-5 right-4 w-14 h-14 rounded-xl bg-white border-2 border-white shadow-xl overflow-hidden p-1">
                        <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover rounded" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3 pt-6">
                      <div className="space-y-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-red-700">
                          {biz.category}
                        </div>
                        <h3 className="font-extrabold text-lg font-outfit text-slate-900 group-hover:text-red-700 transition">
                          {biz.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {biz.description}
                      </p>

                      <div className="space-y-1.5 pt-2 text-xs text-slate-500 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{biz.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{biz.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                    <a
                      href={biz.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-700 hover:text-red-700 flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5 text-red-600" />
                      Visit Website
                    </a>

                    <button
                      onClick={() => setIsJoinModalOpen(true)}
                      className="btn-red px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider"
                    >
                      CLAIM PROFILE
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* CTA Box */}
      <section className="py-12 bg-[#0B0E14] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-2xl font-extrabold font-outfit uppercase">
            IS YOUR MELISSA BUSINESS LISTED?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Get listed in Melissa&apos;s primary business directory today for FREE or unlock premium Founding Partner visibility.
          </p>
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="btn-red px-6 py-3 rounded font-bold text-xs uppercase tracking-wider inline-block"
          >
            ADD YOUR BUSINESS TO DIRECTORY
          </button>
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
