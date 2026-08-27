"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import PageTitle from "@/components/PageTitle";
import { 
  MessageSquareHeart, 
  Send, 
  CheckCircle2, 
  Lightbulb, 
  Users, 
  HeartHandshake,
  Loader2,
  Mail,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function FeedbackPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: "Event Ideas & Networking Suggestions",
    subject: "",
    message: "",
    canFollowUp: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Community Feedback (${formData.category}): ${formData.subject || "New Suggestion"}`,
          formType: "Feedback & Suggestions Form",
          senderEmail: formData.email,
          senderName: `${formData.firstName} ${formData.lastName}`.trim() || "Anonymous Community Member",
          details: {
            "First Name": formData.firstName || "N/A",
            "Last Name": formData.lastName || "N/A",
            "Email Address": formData.email,
            "Phone Number": formData.phone || "N/A",
            "Feedback Category": formData.category,
            "Subject": formData.subject || "General Feedback",
            "Feedback / Suggestion": formData.message,
            "Permission to Follow Up": formData.canFollowUp ? "Yes" : "No"
          }
        })
      });
    } catch (err) {
      console.error("Error submitting feedback form:", err);
    } finally {
      setIsSubmitting(false);
      setIsSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="Leave Feedback & Suggestions" />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 font-bold text-xs uppercase tracking-widest">
              <MessageSquareHeart className="w-4 h-4 text-red-400" />
              COMMUNITY VOICE & IDEAS
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              LEAVE FEEDBACK & <span className="text-red-500">SUGGESTIONS</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Your voice shapes Community Commerce Melissa. Share your ideas for new events, networking topics, directory improvements, or community initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Form & Sidebar */}
      <section className="py-16 bg-[#E5E9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Section (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-md space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-widest">
                  <Lightbulb className="w-4 h-4" />
                  SHARE YOUR THOUGHTS
                </div>
                <h2 className="text-2xl font-extrabold font-outfit text-slate-900 uppercase mt-1">
                  FEEDBACK & SUGGESTION FORM
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every submission is reviewed by our Board of Directors and leadership committees.
                </p>
              </div>

              {isSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-extrabold text-2xl font-outfit text-emerald-950">
                    Thank You For Your Feedback!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    We truly appreciate you taking the time to help build a stronger Melissa. Your suggestion regarding <strong className="text-slate-900">{formData.category}</strong> has been shared with our team.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsSent(false);
                        setFormData({
                          firstName: "",
                          lastName: "",
                          email: "",
                          phone: "",
                          category: "Event Ideas & Networking Suggestions",
                          subject: "",
                          message: "",
                          canFollowUp: true,
                        });
                      }}
                      className="btn-red px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow"
                    >
                      Submit Another Suggestion
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Feedback / Suggestion Topic *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition"
                    >
                      <option value="Event Ideas & Networking Suggestions">Event Ideas & Networking Suggestions</option>
                      <option value="Speaker or Workshop Topics">Speaker or Workshop Topics</option>
                      <option value="Member Directory & Website Enhancements">Member Directory & Website Enhancements</option>
                      <option value="Local Business Support & Programs">Local Business Support & Programs</option>
                      <option value="Community Initiative or Partnership Idea">Community Initiative or Partnership Idea</option>
                      <option value="Compliment or Community Shoutout">Compliment or Community Shoutout</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(972) 837-0000"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Subject Headline */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Subject / Quick Summary *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Idea for a morning breakfast mixer in Melissa"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition"
                    />
                  </div>

                  {/* Detailed Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Your Suggestion / Feedback Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share any specific thoughts, ideas, or recommendations..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition"
                    />
                  </div>

                  {/* Follow-up Permission Checkbox */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="canFollowUp"
                      checked={formData.canFollowUp}
                      onChange={(e) => setFormData({ ...formData, canFollowUp: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                    />
                    <label htmlFor="canFollowUp" className="text-xs text-slate-700 font-medium cursor-pointer">
                      It&apos;s okay for the Community Commerce team to follow up with me regarding this idea.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-red py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SUBMITTING YOUR SUGGESTION...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND FEEDBACK / SUGGESTION</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Sidebar Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* How We Use Your Ideas Box */}
              <div className="bg-[#12161F] text-white rounded-2xl p-6 border border-white/10 shadow-lg space-y-5">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                    HOW IT WORKS
                  </div>
                  <h3 className="text-lg font-extrabold font-outfit uppercase text-white">
                    Why Your Voice Matters
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Community Commerce Melissa is a grassroots organization built to serve local businesses and families.
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/60 text-red-400 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white uppercase text-[11px]">Board Review</div>
                      <p className="text-slate-300 mt-0.5 leading-snug">
                        Community ideas and mixer suggestions are reviewed during our monthly leadership committee sessions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/60 text-red-400 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white uppercase text-[11px]">Real Initiatives</div>
                      <p className="text-slate-300 mt-0.5 leading-snug">
                        Past suggestions have helped shape our inaugural networking events, educational workshops, and speaker formats.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/60 text-red-400 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white uppercase text-[11px]">Collaborative Growth</div>
                      <p className="text-slate-300 mt-0.5 leading-snug">
                        When local businesses collaborate and share ideas, the entire Melissa economy flourishes together.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Contact Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  PREFER TO REACH OUT DIRECTLY?
                </h4>
                
                <div className="space-y-3 text-xs text-slate-600">
                  <a 
                    href="mailto:info@communitycommercemelissa.org" 
                    className="flex items-center gap-2.5 hover:text-red-700 transition"
                  >
                    <Mail className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-semibold text-slate-800">info@communitycommercemelissa.org</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link 
                    href="/contact" 
                    className="text-xs font-bold text-red-700 hover:text-red-900 flex items-center gap-1 uppercase"
                  >
                    <span>General Contact Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link 
                    href="/volunteer" 
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 uppercase"
                  >
                    <span>Volunteer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
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
