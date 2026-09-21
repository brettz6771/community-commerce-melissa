"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { isPastEvent, SITE_EVENTS } from "@/lib/site-events";

export default function HomeEventsBanner() {
  const upcomingEvents = SITE_EVENTS.filter((event) => !isPastEvent(event)).slice(0, 3);

  return (
    <div className="bg-[#151922] text-white border-y border-white/10">
      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-3.5 flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 bg-red-700/20 text-red-200 border border-red-500/30 font-black px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            Open registration
          </span>
          <div className="space-y-1">
            <p className="text-sm sm:text-[15px] font-semibold text-white">
              Check out upcoming events and reserve your spot.
            </p>
            {upcomingEvents.length > 0 && (
              <p className="text-xs text-slate-300">
                {upcomingEvents.map((event, index) => (
                  <span key={event.id}>
                    {index > 0 && <span className="text-slate-500"> · </span>}
                    <Link href={event.href} className="hover:text-white underline-offset-2 hover:underline">
                      {event.title}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        <Link
          href="/events"
          className="btn-red px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wide flex items-center gap-1.5 shrink-0 shadow-md hover:scale-105 transition"
        >
          View events & register
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
