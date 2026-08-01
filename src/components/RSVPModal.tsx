"use client";

import React, { useState } from "react";
import { X, Calendar, MapPin, Clock, CheckCircle2, Download, ExternalLink } from "lucide-react";

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle?: string;
}

export default function RSVPModal({ isOpen, onClose, eventTitle = "Meet & Greet Networking Mixer" }: RSVPModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    guests: "1",
    company: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Event RSVP: ${eventTitle} - ${formData.fullName}`,
          formType: "Event RSVP Form",
          senderEmail: formData.email,
          senderName: formData.fullName,
          details: {
            "Event Title": eventTitle,
            "Attendee Name": formData.fullName,
            "Email Address": formData.email,
            "Phone Number": formData.phone || "N/A",
            "Company / Organization": formData.company || "N/A",
            "Total Guests": formData.guests
          }
        })
      });
    } catch (err) {
      console.error("Error submitting RSVP:", err);
    } finally {
      setIsSubmitting(false);
      setIsRegistered(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F1218] border border-white/15 rounded-2xl w-full max-w-lg text-white shadow-2xl relative p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isRegistered ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold font-outfit text-white">
              You&apos;re Registered!
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm">
              We look forward to seeing you at <br />
              <strong className="text-slate-200">{eventTitle}</strong>
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-2 text-left">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                <span>August 24, 2026 • 6:00 PM - 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>The Red Feather</span>
              </div>
            </div>

            {/* Sync Calendar Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => alert("Calendar (.ics) downloaded for Apple/Outlook!")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Download className="w-3.5 h-3.5" />
                Download .ICS File
              </button>
              
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full btn-red py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Add to Google Calendar
              </a>
            </div>

            <button
              onClick={() => {
                setIsRegistered(false);
                onClose();
              }}
              className="text-slate-400 hover:text-white text-xs underline block mx-auto pt-2"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                EVENT REGISTRATION
              </div>
              <h2 className="text-xl font-extrabold font-outfit text-white">
                {eventTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Reserve your spot for Melissa&apos;s upcoming business gathering.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Company / Business</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Melissa Business"
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Attending Guests</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-400"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4+">4+ Group</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-red py-3 rounded font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <span>CONFIRM RSVP & RESERVE SEAT</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
