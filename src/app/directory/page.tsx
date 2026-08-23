"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { MOCK_BUSINESSES } from "@/data/mockData";
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  PlusCircle,
  Filter,
  CheckCircle2,
  Award,
  Loader2
} from "lucide-react";

interface DirectoryItem {
  id?: string | number;
  name: string;
  category: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  badge?: string;
  tier?: string;
  isTest?: boolean;
}

export default function DirectoryPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dbMembers, setDbMembers] = useState<DirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live active members from database
  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch("/api/directory-members");
        const data = await res.json();
        if (res.ok && data?.members && Array.isArray(data.members)) {
          const mappedDb: DirectoryItem[] = data.members.map((m: any) => ({
            id: m.id || m.businessName,
            name: m.businessName,
            category: m.category || "General Business",
            city: m.city || "Melissa",
            state: m.state || "TX",
            phone: m.phone || "",
            website: m.website || "",
            badge: m.badge || "Community Partner",
            tier: m.tier || "Community Partner",
            isTest: m.isTest,
            address: `${m.city || "Melissa"}, ${m.state || "TX"}`,
          }));
          setDbMembers(mappedDb);
        }
      } catch (err) {
        console.warn("Could not fetch directory members:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadMembers();
  }, []);

  // Map MOCK_BUSINESSES into DirectoryItem format
  const mockFormatted: DirectoryItem[] = MOCK_BUSINESSES.map((b) => ({
    id: b.id,
    name: b.name,
    category: b.category,
    description: b.description,
    address: b.address,
    city: "Melissa",
    state: "TX",
    phone: b.phone,
    website: b.website,
    badge: b.badge || "Founding Member",
    tier: b.badge || "Founding Member",
  }));

  // Combine DB members and default founding businesses (avoid duplicate names)
  const dbNames = new Set(dbMembers.map((m) => m.name.trim().toLowerCase()));
  const combinedBusinesses: DirectoryItem[] = [
    ...dbMembers,
    ...mockFormatted.filter((m) => !dbNames.has(m.name.trim().toLowerCase())),
  ];

  const categories = [
    "All",
    "Health & Wellness",
    "Hospitality & Dining",
    "Home Services",
    "Real Estate",
    "Daycare & Retail",
    "Legal & Financial",
    "Professional Services",
    "General Business",
  ];

  const filteredBusinesses = combinedBusinesses.filter((biz) => {
    const matchesCat = selectedCategory === "All" || biz.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesSearch = 
      biz.name.toLowerCase().includes(query) ||
      (biz.description && biz.description.toLowerCase().includes(query)) ||
      (biz.category && biz.category.toLowerCase().includes(query)) ||
      (biz.city && biz.city.toLowerCase().includes(query)) ||
      (biz.state && biz.state.toLowerCase().includes(query)) ||
      (biz.website && biz.website.toLowerCase().includes(query));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="Searchable Business Directory — Community Commerce Melissa" />
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0B0E14] text-white py-14 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 font-bold text-xs uppercase tracking-widest">
                <Building2 className="w-4 h-4" />
                VERIFIED LOCAL BUSINESSES
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight text-white">
                MELISSA BUSINESS <span className="text-red-500">DIRECTORY</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Discover trusted local services, commercial partners, and member businesses right here in Melissa, Texas. Shop local and grow local.
              </p>
            </div>

            {/* Quick Action to Add Business */}
            <div className="shrink-0">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="btn-red px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Your Business (Join CCM)</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mt-8 bg-white/5 border border-white/15 rounded-2xl p-4 backdrop-blur-md space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by business name, keyword, city (e.g. Melissa), or category..."
                className="w-full bg-[#151922] border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Category:</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Listing Section */}
      <main className="py-12 bg-[#E5E9EE] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <div>
              Showing <strong className="text-slate-900">{filteredBusinesses.length}</strong> {filteredBusinesses.length === 1 ? "Business" : "Businesses"}
              {selectedCategory !== "All" && (
                <span> in <strong className="text-red-700">{selectedCategory}</strong></span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified 501(c)(3) Members</span>
            </div>
          </div>

          {/* Directory Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-600">Loading verified Melissa businesses...</p>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-300 shadow-sm max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-outfit font-extrabold text-xl text-slate-900 uppercase">
                No Businesses Found
              </h3>
              <p className="text-xs text-slate-500">
                We couldn't find any businesses matching &ldquo;{searchQuery}&rdquo;. Try another search term or clear your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="btn-red px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-block"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((biz, idx) => {
                const isPartner = biz.badge?.toLowerCase().includes("partner") || biz.tier?.toLowerCase().includes("partner");
                const isFounding = biz.badge?.toLowerCase().includes("founding");

                return (
                  <div
                    key={biz.id || idx}
                    className="bg-white rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-red-600/40"
                  >
                    {/* Top Accent Strip */}
                    <div className={`h-1.5 w-full ${isPartner ? "bg-[#A81C24]" : isFounding ? "bg-amber-600" : "bg-slate-700"}`} />

                    <div className="p-6 space-y-4 flex-1">
                      {/* Badge & Category Row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                          {biz.category}
                        </span>

                        <div className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isPartner 
                            ? "bg-red-50 text-red-700 border border-red-200" 
                            : isFounding 
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}>
                          <Award className="w-3 h-3 text-red-600" />
                          <span>{biz.badge || "Member"}</span>
                        </div>
                      </div>

                      {/* Business Name */}
                      <div>
                        <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-red-700 transition">
                          {biz.name}
                        </h3>
                        {biz.description && (
                          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                            {biz.description}
                          </p>
                        )}
                      </div>

                      {/* Location & Contact Meta */}
                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                        {/* City & State */}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="font-bold text-slate-800">
                            {biz.city || "Melissa"}, {biz.state || "TX"}
                          </span>
                        </div>

                        {/* Phone */}
                        {biz.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <a
                              href={`tel:${biz.phone.replace(/[^0-9]/g, "")}`}
                              className="text-slate-700 hover:text-red-700 font-medium transition"
                            >
                              {biz.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Website CTA */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                      {biz.website ? (
                        <a
                          href={biz.website.startsWith("http") ? biz.website : `https://${biz.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-slate-900 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Visit Website</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                        </a>
                      ) : (
                        <div className="w-full text-center py-2 text-[11px] font-bold text-slate-400 uppercase">
                          Verified Local Member
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Callout Banner */}
          <div className="bg-[#0B0E14] text-white rounded-3xl p-8 sm:p-10 border border-white/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                EXPAND YOUR LOCAL REACH
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase tracking-tight text-white">
                WANT YOUR BUSINESS LISTED HERE?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Join Community Commerce Melissa today. Your business profile, verified badge, and direct website backlink will be published automatically upon registration.
              </p>
            </div>

            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="btn-red px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition shrink-0"
            >
              JOIN COMMUNITY COMMERCE
            </button>
          </div>

        </div>
      </main>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
