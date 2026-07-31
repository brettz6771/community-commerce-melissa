"use client";

import React, { useState } from "react";
import ImageLightboxModal from "@/components/ImageLightboxModal";
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
  MapPin,
  ZoomIn
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
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const filteredPreviewBusinesses = MOCK_BUSINESSES.filter(biz => {
    const matchesSearch = biz.name.toLowerCase().includes(directoryQuery.toLowerCase()) ||
                          biz.category.toLowerCase().includes(directoryQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || biz.category === selectedCategory;
    return matchesSearch && matchesCat;
  }).slice(0, 4);

  return (
    <section className="py-10 bg-[#E5E9EE]">
      {/* Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Row 1: EVENTS, GET INVOLVED (Centered 2-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          
          {/* Card 1: EVENTS */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white py-3 px-4 flex items-center gap-2.5 border-b-2 border-red-700">
                <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-outfit font-extrabold text-sm tracking-wider uppercase text-white">
                  EVENTS
                </h3>
              </div>

              {/* Body */}
              <div className="p-3.5 sm:p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    UPCOMING EVENTS
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Join us for our next event and start making connections!
                  </p>
                </div>

                {/* Events list with compact stacked layout */}
                <div className="space-y-2">
                  {MOCK_EVENTS.slice(0, 3).map((evt) => (
                    <div 
                      key={evt.id} 
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-2.5 rounded-xl space-y-2 transition-colors"
                    >
                      {/* Event Image Banner (Clickable Lightbox) */}
                      {evt.image && (
                        <div
                          onClick={() => setLightboxImage({ src: evt.image, title: evt.title })}
                          className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-900 cursor-pointer group/img"
                          title="Click to view full image"
                        >
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm border border-white/20">
                              <ZoomIn className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Top Bar: Date Badge & Register Button */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="bg-[#0B0E14] text-white rounded-md px-2 py-0.5 flex items-center gap-1 shrink-0 border border-slate-300/30">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">{evt.month}</span>
                          <span className="text-xs font-black text-white">{evt.day}</span>
                        </div>

                        {evt.registerUrl ? (
                          <a
                            href={evt.registerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-700 hover:bg-red-800 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 transition shadow-sm inline-block text-center"
                          >
                            REGISTER
                          </a>
                        ) : (
                          <button
                            onClick={() => onOpenRSVPModal?.(evt.title)}
                            className="bg-red-700 hover:bg-red-800 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 transition shadow-sm"
                          >
                            REGISTER
                          </button>
                        )}
                      </div>

                      {/* Event Title */}
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-900 leading-snug group-hover:text-red-700 transition-colors">
                          {evt.title}
                        </h5>
                        
                        <div className="mt-1 flex flex-col text-[10px] text-slate-500 space-y-0.5">
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-700 font-semibold">
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
            <div className="p-3.5 sm:p-4 pt-0">
              <Link
                href="/events"
                className="w-full btn-red py-2.5 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block shadow-md hover:shadow-lg transition-all"
              >
                VIEW ALL EVENTS
              </Link>
            </div>
          </div>

          {/* Card 2: GET INVOLVED */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Header */}
              <div className="bg-[#0B0E14] text-white py-3 px-4 flex items-center gap-2.5 border-b-2 border-red-700">
                <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Handshake className="w-4 h-4" />
                </div>
                <h3 className="font-outfit font-extrabold text-sm tracking-wider uppercase text-white">
                  GET INVOLVED
                </h3>
              </div>

              {/* Body */}
              <div className="p-3.5 sm:p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    BIG IMPACT. MANY WAYS TO GET INVOLVED.
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    There are many ways to be a part of something great.
                  </p>
                </div>

                {/* Subitems */}
                <div className="space-y-2">
                  <Link 
                    href="/about"
                    className="flex items-start gap-2.5 p-2 rounded-xl border border-transparent hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition cursor-pointer block" 
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-900 flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                      1
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 uppercase">OUR MISSION & LEADERSHIP</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Learn about our vision, leaders, and community goals.</div>
                    </div>
                  </Link>

                  <Link 
                    href="/events"
                    className="flex items-start gap-2.5 p-2 rounded-xl border border-transparent hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition cursor-pointer block" 
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-900 flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                      2
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 uppercase">ATTEND AN EVENT</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Network, connect, and build lasting relationships.</div>
                    </div>
                  </Link>

                  <Link 
                    href="/contact"
                    className="flex items-start gap-2.5 p-2 rounded-xl border border-transparent hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition cursor-pointer block"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-900 flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                      3
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 uppercase">GET IN TOUCH</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">Reach out to our leadership team and get involved.</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="p-3.5 sm:p-4 pt-0">
              <Link
                href="/contact"
                className="w-full btn-red py-2.5 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block shadow-md hover:shadow-lg transition-all"
              >
                GET IN TOUCH
              </Link>
            </div>
          </div>

        </div>

      </div>

      <ImageLightboxModal
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageSrc={lightboxImage?.src || ""}
        title={lightboxImage?.title || ""}
      />
    </section>
  );
}
