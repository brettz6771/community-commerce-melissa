"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Users,
  Building2,
  Ticket,
  Sparkles,
} from "lucide-react";
import {
  SITE_EVENTS,
  type EventRegistrationPath,
  type SiteEvent,
} from "@/lib/site-events";

interface HomeUpcomingEventsProps {
  onOpenRegistration: (event: SiteEvent, path?: EventRegistrationPath) => void;
}

export default function HomeUpcomingEvents({
  onOpenRegistration,
}: HomeUpcomingEventsProps) {
  // Explicitly ensure the three events are presented in requested order:
  // 1. Lunch & Learn
  // 2. Oktoberfest
  // 3. Tent or Treat
  const orderedIds = ["lunch-and-learn", "oktoberfest", "tent-or-treat"];
  const events = orderedIds
    .map((id) => SITE_EVENTS.find((e) => e.id === id))
    .filter((e): e is SiteEvent => Boolean(e));

  return (
    <section className="bg-[#0D1117] text-white py-14 sm:py-20 border-b border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-700/20 border border-red-500/30 text-red-300 font-bold text-xs uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              UPCOMING GATHERINGS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit uppercase tracking-tight text-white">
              Upcoming <span className="text-red-500">Events</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Connect with fellow business owners, gain valuable knowledge, and elevate your presence in Melissa, Texas.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white group shrink-0"
          >
            <span>View Full Events Calendar</span>
            <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {events.map((evt, index) => {
            const isLunch = evt.id === "lunch-and-learn";
            const isOktober = evt.id === "oktoberfest";
            const isTent = evt.id === "tent-or-treat";

            return (
              <div
                key={evt.id}
                className="bg-[#151922] rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Banner with Badges */}
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-[#151922]/30 to-black/40" />

                    {/* Order Index & Category Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-red-700 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        Event #{index + 1}
                      </span>
                      <span className="bg-black/60 backdrop-blur-sm text-slate-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-white/10">
                        {evt.category}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-3 right-3 bg-[#0B0E14]/95 text-white rounded-xl px-2.5 py-1.5 text-center border border-white/20 shadow-lg min-w-[54px]">
                      <div className="text-[10px] font-black text-red-400 uppercase tracking-wider">
                        {evt.month}
                      </div>
                      <div className="text-xl font-extrabold text-white leading-none pt-0.5">
                        {evt.day}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {evt.kicker}
                      </p>
                      <h3 className="text-xl font-extrabold font-outfit text-white leading-snug group-hover:text-red-400 transition-colors">
                        {evt.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Meta info */}
                    <div className="pt-2 space-y-2 text-xs text-slate-300 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{evt.dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          <strong className="text-white">{evt.location}</strong>
                          {evt.address ? ` · ${evt.address}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-6 pt-2 border-t border-white/10 bg-[#12161f] space-y-2.5">
                  {/* Lunch & Learn CTA */}
                  {isLunch && (
                    <div className="space-y-2">
                      <button
                        onClick={() => onOpenRegistration(evt, "attendee")}
                        className="w-full btn-red py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        <span>Register (Free Lunch)</span>
                      </button>
                      <div className="flex items-center justify-between text-xs pt-1 px-1">
                        <span className="text-emerald-400 font-bold text-[11px] uppercase">
                          Free for all attendees
                        </span>
                        <Link
                          href={evt.href}
                          className="text-slate-400 hover:text-white underline underline-offset-2 transition"
                        >
                          Event Details →
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Oktoberfest CTA */}
                  {isOktober && (
                    <div className="space-y-2">
                      <button
                        onClick={() => onOpenRegistration(evt)}
                        className="w-full btn-red py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Register / Get Tickets</span>
                      </button>
                      <div className="flex items-center justify-between text-xs pt-1 px-1">
                        <span className="text-slate-300 text-[11px]">
                          <strong className="text-emerald-400">Members Free</strong> · Guests $20
                        </span>
                        <Link
                          href={evt.href}
                          className="text-slate-400 hover:text-white underline underline-offset-2 transition"
                        >
                          Event Details →
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Tent or Treat CTAs in exact requested order */}
                  {isTent && (
                    <div className="space-y-2">
                      {/* 1st: Registration for attendees */}
                      <button
                        onClick={() => onOpenRegistration(evt, "attendee")}
                        className="w-full btn-red py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        <span>1. Register to Attend (Free)</span>
                      </button>

                      {/* 2nd: For people who want booths, tables, etc */}
                      <button
                        onClick={() => onOpenRegistration(evt, "sponsor")}
                        className="w-full bg-[#1b2230] hover:bg-[#222a3b] text-amber-300 border border-amber-500/30 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs hover:scale-[1.02] transition flex items-center justify-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span>2. Booths, Tables & Sponsors</span>
                      </button>

                      <div className="flex items-center justify-between text-xs pt-1 px-1">
                        <span className="text-slate-400 text-[11px]">
                          Family event + prize drawing
                        </span>
                        <Link
                          href={evt.href}
                          className="text-slate-400 hover:text-white underline underline-offset-2 transition"
                        >
                          Event Details →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
