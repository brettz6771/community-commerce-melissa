"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import Link from "next/link";
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Building2 className="w-4 h-4" />
              MELISSA BUSINESS DIRECTORY
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              SEARCHABLE <span className="text-slate-200">DIRECTORY</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Find local, support local, and grow local. Discover trusted products and professional services right here in Melissa, Texas.
            </p>
          </div>
        </div>
      </section>

      {/* Directory Coming Soon State */}
      <section className="py-20 bg-[#E5E9EE] flex-grow flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0B0E14] text-red-500 border border-slate-300 flex items-center justify-center mx-auto shadow-xl">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit uppercase text-slate-900 tracking-tight">
              DIRECTORY LAUNCHING SOON
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
              Our official Melissa Business Directory is currently being updated and curated. Check back shortly for our full searchable directory of local Melissa businesses!
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="btn-red px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              RETURN HOME
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow"
            >
              GET IN TOUCH
            </Link>
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
