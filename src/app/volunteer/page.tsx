"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import Link from "next/link";
import { 
  HeartHandshake, 
  Calendar, 
  Users, 
  Award, 
  CheckCircle2, 
  Send,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function VolunteerPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleInterest: "Event Planning & Hospitality",
    availability: "Weekends / Evenings",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Volunteer Application: ${formData.fullName}`,
          formType: "Volunteer Application Form",
          senderEmail: formData.email,
          senderName: formData.fullName,
          details: {
            "Full Name": formData.fullName,
            "Email Address": formData.email,
            "Phone Number": formData.phone || "N/A",
            "Area of Interest": formData.roleInterest,
            "Availability": formData.availability,
            "Additional Notes": formData.notes || "None"
          }
        })
      });
      if (!res.ok) {
        throw new Error("Submit failed");
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting volunteer form:", err);
      alert("Sorry, we could not send your application. Please try again or email info@communitycommercemelissa.org.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const volunteerRoles = [
    {
      title: "Event Planning & Hospitality",
      desc: "Assist with monthly mixers, annual summits, and community ribbon cuttings. Welcome guests, manage check-in, and build warm connections.",
      icon: Calendar
    },
    {
      title: "Youth & Scholarship Mentor",
      desc: "Guide Melissa high school students and young entrepreneurs through workshop mentoring, career panels, and annual scholarship drives.",
      icon: Award
    },
    {
      title: "Business Directory Ambassador",
      desc: "Connect with local Melissa merchants, help set up directory listings, and spread the word about Community Commerce initiatives.",
      icon: Users
    },
    {
      title: "Community Outreach & Service",
      desc: "Lead civic improvement projects, local food drive partnerships, and community clean-up initiatives across Collin County.",
      icon: HeartHandshake
    }
  ];

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <HeartHandshake className="w-4 h-4" />
              COMMUNITY VOLUNTEER PROGRAM
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              GET INVOLVED & <span className="text-slate-200">VOLUNTEER</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Lend your time, talents, and energy to champion local Melissa entrepreneurs, youth programs, and civic initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Subpage Sub-navigation Bar */}
      <div className="bg-[#151922] border-b border-white/10 py-3 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <Link href="/contact" className="text-slate-400 hover:text-white transition">Contact Us</Link>
          <Link href="/volunteer" className="text-white border-b-2 border-red-600 pb-1">Volunteer</Link>
          <Link href="/give-donate" className="text-slate-400 hover:text-white transition">Give / Donate</Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Volunteer Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {volunteerRoles.map((role, idx) => {
              const IconComp = role.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-extrabold font-outfit text-slate-900 uppercase">{role.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{role.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-red-700">
                    <span>Flexible Hours</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Volunteer Registration Form */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded text-xs uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                JOIN THE VOLUNTEER TEAM
              </div>
              <h2 className="text-2xl font-extrabold font-outfit uppercase text-slate-900">
                VOLUNTEER APPLICATION
              </h2>
              <p className="text-xs text-slate-500">
                Complete your information below and our volunteer coordinator will get in touch with you.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-950/20 border border-emerald-500/40 p-6 rounded-xl text-center space-y-3 text-emerald-950">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-bold text-slate-900">Application Received!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you <strong className="text-slate-900">{formData.fullName}</strong>! We appreciate your commitment to building a stronger Melissa. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(972) 837-0000"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Volunteer Area</label>
                    <select
                      value={formData.roleInterest}
                      onChange={(e) => setFormData({ ...formData, roleInterest: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                    >
                      <option value="Event Planning & Hospitality">Event Planning & Hospitality</option>
                      <option value="Youth & Scholarship Mentor">Youth & Scholarship Mentor</option>
                      <option value="Business Directory Ambassador">Business Directory Ambassador</option>
                      <option value="Community Outreach & Service">Community Outreach & Service</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Additional Notes / Skills</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about any specific background, interests, or availability..."
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-red py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  SUBMIT VOLUNTEER APPLICATION
                </button>
              </form>
            )}
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
