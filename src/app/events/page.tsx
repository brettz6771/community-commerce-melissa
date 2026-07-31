"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import RSVPModal from "@/components/RSVPModal";
import LaunchBanner from "@/components/LaunchBanner";
import { MOCK_EVENTS } from "@/data/mockData";
import ImageLightboxModal from "@/components/ImageLightboxModal";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Filter, 
  Search, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  Tag,
  ZoomIn
} from "lucide-react";

export default function EventsPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const categories = [
    "All",
    "Monthly Networking Mixers"
  ];

  const filteredEvents = MOCK_EVENTS.filter((evt) => {
    const matchesCat = selectedCategory === "All" || evt.category === selectedCategory;
    const matchesQuery = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleRSVP = (title: string) => {
    setSelectedEventTitle(title);
    setIsRSVPModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              INTERACTIVE EVENT CALENDAR
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              UPCOMING <span className="text-slate-200">EVENTS</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Connect with fellow business owners, gain valuable knowledge, and elevate your presence in Melissa, Texas.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
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

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200 space-y-2">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-base font-bold">No events found matching your criteria</div>
              <div className="text-xs">Try selecting &ldquo;All&rdquo; categories or clearing your search term.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col sm:flex-row group"
                >
                  {/* Event Thumbnail & Date Badge */}
                  <div
                    onClick={() => setLightboxImage({ src: evt.image, title: evt.title })}
                    className="relative sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-900 cursor-pointer overflow-hidden group/img"
                    title="Click to expand photo"
                  >
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover/img:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60 text-white p-2 rounded-full backdrop-blur-sm border border-white/20">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Date Badge */}
                    <div className="absolute top-3 left-3 bg-[#0B0E14] text-white rounded-lg p-2 text-center border border-slate-300/40 shadow-lg min-w-[56px] pointer-events-none">
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{evt.month}</div>
                      <div className="text-xl font-extrabold text-white leading-none pt-0.5">{evt.day}</div>
                    </div>

                    {evt.isFeatured && (
                      <span className="absolute bottom-3 left-3 bg-red-700 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow pointer-events-none">
                        FEATURED EVENT
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-red-700 font-bold uppercase tracking-wider">
                        <Tag className="w-3 h-3" />
                        {evt.category}
                      </div>

                      <h3 className="text-lg font-extrabold font-outfit text-slate-900 group-hover:text-red-700 transition-colors">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="pt-1 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(evt.location)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        Directions
                      </a>

                      {evt.registerUrl ? (
                        <a
                          href={evt.registerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-red px-4 py-2 rounded text-xs font-bold uppercase tracking-wider shadow inline-block text-center"
                        >
                          REGISTER / RSVP NOW
                        </a>
                      ) : (
                        <button
                          onClick={() => handleRSVP(evt.title)}
                          className="btn-red px-4 py-2 rounded text-xs font-bold uppercase tracking-wider shadow"
                        >
                          REGISTER / RSVP NOW
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        eventTitle={selectedEventTitle}
      />

      <ImageLightboxModal
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageSrc={lightboxImage?.src || ""}
        title={lightboxImage?.title || ""}
      />
    </div>
  );
}
