"use client";

import React from "react";
import Link from "next/link";
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Calendar, 
  MapPin,
  Mail,
  Phone
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B0E14] text-white border-t border-white/10">
      
      {/* 4 Community Pillars Strip */}
      <div className="bg-[#12161F] border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-300">
          
          {/* Pillar 1 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-600/40 flex items-center justify-center text-slate-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">501(c)(3) NON-PROFIT</h4>
              <p className="text-xs text-slate-400 mt-1">Official non-profit organization focused entirely on community service.</p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-600/40 flex items-center justify-center text-slate-300 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">GIVING BACK TO MELISSA</h4>
              <p className="text-xs text-slate-400 mt-1">Reinvesting in local causes, youth programs, and community needs.</p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-600/40 flex items-center justify-center text-slate-300 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">LOCAL CONNECTIONS</h4>
              <p className="text-xs text-slate-400 mt-1">Uniting Melissa business owners, founders, and leaders.</p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-600/40 flex items-center justify-center text-slate-300 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">NETWORKING & EVENTS</h4>
              <p className="text-xs text-slate-400 mt-1">Monthly mixers, workshops, and collaborative gatherings.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Domain Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Monogram */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/ccm-logo-transparent.png"
                alt="Community Commerce Melissa Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-sm tracking-wider text-white uppercase group-hover:text-red-400 transition-colors">
                  COMMUNITY COMMERCE
                </span>
                <span className="font-outfit font-bold text-[10px] tracking-widest text-slate-300 uppercase">
                  MELISSA, TEXAS
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              The trusted online business hub connecting, promoting, educating, and strengthening the local business community in Melissa, Texas.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>Melissa, Texas 75454</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/about" className="hover:text-white transition">About Community Commerce</Link></li>
              <li><Link href="/leadership" className="hover:text-white transition">Board of Directors</Link></li>
              <li><Link href="/membership" className="text-white font-bold hover:text-red-400 transition">Membership Levels</Link></li>
              <li><Link href="/events" className="hover:text-white transition">Interactive Event Calendar</Link></li>
              <li><Link href="/news" className="hover:text-white transition">Latest News & Press</Link></li>
            </ul>
          </div>

          {/* Col 3: Community & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              COMMUNITY RESOURCES
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/contact/feedback" className="hover:text-white transition">Leave Feedback / Suggestions</Link></li>
              <li><Link href="/volunteer" className="hover:text-white transition">Volunteer Program</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              STAY CONNECTED
            </h4>
            <p className="text-xs text-slate-400">
              Subscribe for upcoming Melissa event alerts, community news, and economic development updates.
            </p>
            <form 
              onSubmit={async (e) => { 
                e.preventDefault(); 
                const formEl = e.currentTarget;
                const formData = new FormData(formEl);
                const firstNameVal = formData.get("firstName") as string || "";
                const lastNameVal = formData.get("lastName") as string || "";
                const emailVal = formData.get("email") as string || "";
                
                try {
                  await fetch("/api/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      subject: `New Newsletter Subscription: ${firstNameVal} ${lastNameVal} (${emailVal})`,
                      formType: "Newsletter Subscription",
                      senderEmail: emailVal,
                      senderName: `${firstNameVal} ${lastNameVal}`,
                      details: {
                        "First Name": firstNameVal,
                        "Last Name": lastNameVal,
                        "Subscriber Email": emailVal
                      }
                    })
                  });
                } catch (err) {
                  console.error("Error subscribing:", err);
                }
                
                alert("Thank you for subscribing to Community Commerce Melissa!"); 
                formEl.reset();
              }} 
              className="space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full bg-[#151922] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                required
              />
              <button
                type="submit"
                className="w-full btn-red py-2 rounded text-xs font-bold uppercase tracking-wider"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Red Bar matching mockup */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0 hover:scale-105 transition-transform">
              <img
                src="/ccm-logo-transparent.png"
                alt="Community Commerce Melissa Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <span className="font-outfit font-medium text-xs sm:text-sm tracking-wide text-slate-300">
              Community Commerce Melissa is a 501(c)(3) non-profit organization.
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/community.commerce.melissa/" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            MELISSA, TEXAS • &copy; {new Date().getFullYear()} Community Commerce Melissa. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
}
