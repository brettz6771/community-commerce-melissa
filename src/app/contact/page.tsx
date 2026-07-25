"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Building2
} from "lucide-react";

export default function ContactPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <PhoneCall className="w-4 h-4" />
              CONTACT & ENGAGEMENT
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              GET IN <span className="text-amber-400">TOUCH</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Have a question, volunteer interest, or partnership opportunity? We&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-slate-200 shadow-lg space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold font-outfit text-slate-900 uppercase">SEND US A MESSAGE</h3>
                <p className="text-xs text-slate-500">Complete the form below and a representative will respond within 24 hours.</p>
              </div>

              {isSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-lg">Message Delivered!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you <strong className="text-slate-900">{formData.name}</strong>. Your message regarding <em>{formData.subject}</em> has been routed to our leadership team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
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
                        placeholder="john@example.com"
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Inquiry Type *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Membership Question">Membership Question</option>
                        <option value="Sponsorship Opportunity">Sponsorship Opportunity</option>
                        <option value="Volunteer Signup">Volunteer Signup</option>
                        <option value="Press / Media">Press / Media</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help your Melissa business?"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-red py-3 rounded font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    SEND MESSAGE
                  </button>
                </form>
              )}

            </div>

            {/* Info Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0B0E14] text-white rounded-2xl p-8 border border-slate-800 shadow-xl space-y-6">
                <h3 className="text-xl font-extrabold font-outfit uppercase">COMMUNITY COMMERCE HQ</h3>
                
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Location:</strong>
                      Melissa, Texas 75454
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Email:</strong>
                      contact@communitycommercemelissa.com
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Operating Hours:</strong>
                      Monday - Friday: 8:00 AM - 5:00 PM CST
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
                  Domain: <strong className="text-amber-400">CommunityCommerceMelissa.com</strong>
                </div>
              </div>

              {/* Map embed box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-md">
                <iframe
                  title="Melissa Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53372.4849202875!2d-96.61110530752538!3d33.28594957385923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c153ff294025b%3A0xb3641b4b604e0e5a!2sMelissa%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  className="w-full h-48 rounded-xl border-0"
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>

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
