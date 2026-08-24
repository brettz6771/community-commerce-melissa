"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Loader2,
  Eye,
  Calendar
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
  const searchParams = useSearchParams();
  const isPreviewMode = searchParams.get("preview") === "true";

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

  // Combine DB members and default founding businesses
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
      <PageTitle title="Melissa Business Directory — Community Commerce Melissa" />
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Admin Preview Mode Notice */}
      {isPreviewMode && (
        <div className="bg-purple-950 text-purple-200 text-xs py-2 px-4 border-b border-purple-800 text-center flex items-center justify-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <span>
            <strong>ADMIN DIRECTORY PREVIEW ACTIVE:</strong> Showing {combinedBusinesses.length} collected member listings in database.
          </span>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10 relative overflow-hidden">
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
        </div>
      </section>

      {/* Public State: Directory Launching Soon (With Active Member Collection & Admin Preview) */}
      {!isPreviewMode ? (
        <main className="py-20 bg-[#E5E9EE] flex-grow flex items-center justify-center">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
            
            <div className="w-20 h-20 rounded-3xl bg-[#0B0E14] text-red-500 border border-slate-300 flex items-center justify-center mx-auto shadow-2xl">
              <Building2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                MEMBER REGISTRATIONS ACTIVELY BEING ENROLLED & STORED
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold font-outfit uppercase text-slate-900 tracking-tight">
                DIRECTORY LAUNCHING SOON
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
                Our official Melissa Business Directory is currently collecting and indexing our inaugural member businesses. As new members join, their profiles, website links, and location details are verified and stored for our upcoming public directory launch!
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="btn-red px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Join & Register Your Business</span>
              </button>

              <Link
                href="/membership"
                className="px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition shadow"
              >
                View Membership Levels
              </Link>
            </div>

            {/* What Members Receive Preview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm max-w-xl mx-auto text-left space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-red-600" />
                EVERY ACTIVE MEMBER REGISTRATION INCLUDES:
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Instant listing placement in the verified business database</li>
                <li>Direct SEO backlink to your website and business contact details</li>
                <li>2026 Official Digital Member Badge (PNG & Print Certificate)</li>
                <li>Invitations to upcoming networking events & business mixers</li>
              </ul>
            </div>

          </div>
        </main>
      ) : (
        /* Admin Preview Mode: Interactive Searchable Directory */
        <main className="py-12 bg-[#E5E9EE] flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Search & Category Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-300 shadow-sm space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by business name, keyword, city, or category..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 transition"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px] shrink-0 mr-1">
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
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((biz, idx) => {
                const isPartner = biz.badge?.toLowerCase().includes("partner") || biz.tier?.toLowerCase().includes("partner");
                const isFounding = biz.badge?.toLowerCase().includes("founding");

                return (
                  <div
                    key={biz.id || idx}
                    className="bg-white rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between overflow-hidden"
                  >
                    <div className={`h-1.5 w-full ${isPartner ? "bg-[#A81C24]" : isFounding ? "bg-amber-600" : "bg-slate-700"}`} />

                    <div className="p-6 space-y-4 flex-1">
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
                        <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-slate-900">
                          {biz.name}
                        </h3>
                        {biz.description && (
                          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                            {biz.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="font-bold text-slate-800">
                            {biz.city || "Melissa"}, {biz.state || "TX"}
                          </span>
                        </div>

                        {biz.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <a href={`tel:${biz.phone.replace(/[^0-9]/g, "")}`} className="text-slate-700 font-medium">
                              {biz.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                      {biz.website ? (
                        <a
                          href={biz.website.startsWith("http") ? biz.website : `https://${biz.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-slate-900 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
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
          </div>
        </main>
      )}

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
