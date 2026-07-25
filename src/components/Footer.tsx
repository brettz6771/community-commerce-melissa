"use client";

import React from "react";
import Link from "next/link";
import { 
  Smartphone, 
  ShieldCheck, 
  Settings, 
  TrendingUp, 
  MapPin,
  Mail,
  Phone
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B0E14] text-white border-t border-white/10">
      
      {/* 4 Feature Highlights Bar (Directly matching mockup bottom strip) */}
      <div className="bg-[#12161F] border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-300">
          
          {/* Highlight 1 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-600/40 flex items-center justify-center text-amber-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">MODERN & MOBILE</h4>
              <p className="text-xs text-slate-400 mt-1">Beautiful design that looks great on any device.</p>
            </div>
          </div>

          {/* Highlight 2 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-600/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">FAST & SECURE</h4>
              <p className="text-xs text-slate-400 mt-1">Built with Next.js for performance and reliability.</p>
            </div>
          </div>

          {/* Highlight 3 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-600/40 flex items-center justify-center text-amber-400 shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">EASY TO MANAGE</h4>
              <p className="text-xs text-slate-400 mt-1">Simple updates for events, members, and content.</p>
            </div>
          </div>

          {/* Highlight 4 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-600/40 flex items-center justify-center text-amber-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">BUILT TO SCALE</h4>
              <p className="text-xs text-slate-400 mt-1">Scalable to grow with our community and our mission.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Domain Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Monogram */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/community-commerce-logo-transparent.png"
                alt="Community Commerce Melissa Logo"
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-sm tracking-wider text-white uppercase">
                  COMMUNITY COMMERCE
                </span>
                <span className="font-outfit font-bold text-[10px] tracking-widest text-amber-400 uppercase">
                  MELISSA, TEXAS
                </span>
              </div>
            </div>

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
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/about" className="hover:text-white transition">About Community Commerce</Link></li>
              <li><Link href="/leadership" className="hover:text-white transition">Board of Directors</Link></li>
              <li><Link href="/events" className="hover:text-white transition">Interactive Event Calendar</Link></li>
              <li><Link href="/directory" className="hover:text-white transition">Searchable Business Directory</Link></li>
              <li><Link href="/membership" className="hover:text-white transition">Membership Levels & Pricing</Link></li>
              <li><Link href="/sponsorship" className="hover:text-white transition">Sponsorship Packages</Link></li>
            </ul>
          </div>

          {/* Col 3: Community & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              COMMUNITY RESOURCES
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/spotlight" className="hover:text-white transition">Business Spotlight</Link></li>
              <li><Link href="/community" className="hover:text-white transition">City & Economic Updates</Link></li>
              <li><Link href="/photos-videos" className="hover:text-white transition">Photo & Video Library</Link></li>
              <li><Link href="/news" className="hover:text-white transition">News & Blog Articles</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Volunteer & Contact Form</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              STAY CONNECTED
            </h4>
            <p className="text-xs text-slate-400">
              Subscribe for upcoming Melissa event alerts, member news, and economic development updates.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Community Commerce Melissa!"); }} className="space-y-2">
              <input
                type="email"
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
            <img
              src="/community-commerce-logo-transparent.png"
              alt="Community Commerce Melissa Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-outfit font-bold text-base tracking-wide text-white">
              CommunityCommerceMelissa.com
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
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
