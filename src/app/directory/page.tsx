"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { MOCK_BUSINESSES, BUSINESS_CATEGORIES } from "@/data/mockData";
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
  Loader2,
  ArrowRight
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

function DirectoryContent() {
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
            category: m.category || "General Business / Other",
            description: m.description || "Active community business partner in Melissa, Texas.",
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
    description: b.description || "Founding business member dedicated to economic advancement and community leadership in Melissa, TX.",
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

  const categories = ["All", ...BUSINESS_CATEGORIES];

  const filteredBusinesses = combinedBusinesses.filter((biz) => {
    const matchesCat = 
      selectedCategory === "All" || 
      biz.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (biz.category && selectedCategory.toLowerCase().includes(biz.category.toLowerCase())) ||
      (biz.category && biz.category.toLowerCase().includes(selectedCategory.toLowerCase()));

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
      <PageTitle title="Melissa Business Directory — Community Commerce Melissa" />
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0B0E14] text-white py-14 sm:py-16 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 font-bold text-xs uppercase tracking-widest">
            <Building2 className="w-4 h-4" />
            MELISSA BUSINESS DIRECTORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight text-white">
            COMMUNITY COMMERCE <span className="text-red-500">DIRECTORY</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Find local, support local, and grow local. Discover trusted products, commercial partners, and professional services right here in Melissa, Texas.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="btn-red px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Join & Add Your Business Listing</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Business Directory Main Section */}
      <main className="py-10 sm:py-12 bg-[#E5E9EE] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Search Bar & Category Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-300 shadow-sm space-y-4">
            
            {/* Search Input + Category Select Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="relative md:col-span-8">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by business name, keyword, city, or specialty..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 transition"
                />
              </div>

              <div className="relative md:col-span-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-red-500 transition"
                >
                  <option value="All">All Categories & Industries ({combinedBusinesses.length})</option>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px] shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Active Count Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <div>
                Showing <strong>{filteredBusinesses.length}</strong> verified member{filteredBusinesses.length === 1 ? "" : "s"}
                {selectedCategory !== "All" && <span> in <strong>{selectedCategory}</strong></span>}
              </div>
              {isLoading && (
                <div className="flex items-center gap-1.5 text-red-600 font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading live database...</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {filteredBusinesses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-300 text-center space-y-4">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No businesses found matching &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your search filters or browse all categories to explore our full directory of Melissa businesses.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="bg-slate-900 text-white text-xs font-bold uppercase px-4 py-2 rounded-lg"
              >
                Reset Filters
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
                    className="bg-white rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition"
                  >
                    {/* Top Tier Accent Strip */}
                    <div className={`h-1.5 w-full ${isPartner ? "bg-[#A81C24]" : isFounding ? "bg-amber-600" : "bg-slate-700"}`} />

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                            {biz.category}
                          </span>

                          <div className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            isPartner 
                              ? "bg-red-50 text-red-700 border border-red-200" 
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}>
                            <Award className="w-3 h-3 text-red-600" />
                            <span>{biz.badge || "Member"}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                            {biz.name}
                          </h3>
                          {biz.description && (
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                              {biz.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Location & Contact Info */}
                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 mt-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="font-bold text-slate-800">
                            {biz.city || "Melissa"}, {biz.state || "TX"}
                          </span>
                        </div>

                        {biz.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <a href={`tel:${biz.phone.replace(/[^0-9]/g, "")}`} className="text-slate-700 font-medium hover:text-red-600 transition">
                              {biz.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
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
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
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

          {/* Join Callout Footer */}
          <div className="bg-gradient-to-r from-[#0B0E14] to-red-950 text-white rounded-3xl p-8 sm:p-10 border border-red-600/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase text-red-400 tracking-wider flex items-center gap-1.5 justify-center md:justify-start">
                <Sparkles className="w-4 h-4" />
                GET YOUR BUSINESS LISTED
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-outfit uppercase">
                Want your business featured in the directory?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Join Community Commerce Melissa today. Gain verified member status, digital badge credentials, community visibility, and direct local referrals.
              </p>
            </div>

            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="btn-red px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition shrink-0 flex items-center gap-2"
            >
              <span>Join As A Member</span>
              <ArrowRight className="w-4 h-4" />
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

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>}>
      <DirectoryContent />
    </Suspense>
  );
}
