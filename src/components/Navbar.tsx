"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, UserPlus, PhoneCall } from "lucide-react";

interface NavbarProps {
  onOpenJoinModal?: () => void;
}

export default function Navbar({ onOpenJoinModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "MEMBERSHIP", href: "/membership" },
    { name: "ABOUT", href: "/about" },
    { name: "LEADERSHIP", href: "/leadership" },
    { name: "EVENTS", href: "/events" },
    { name: "NEWS", href: "/news" },
  ];

  const contactSublinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Volunteer", href: "/volunteer" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/10 text-white shadow-xl">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <img
            src="/ccm-logo-transparent.png"
            alt="Community Commerce Melissa Logo"
            className="h-16 w-auto max-h-16 object-contain group-hover:scale-105 transition-transform drop-shadow-md"
          />
          
          <div className="flex flex-col">
            <span className="font-outfit font-extrabold text-lg tracking-wider text-white leading-tight uppercase">
              COMMUNITY
            </span>
            <span className="font-outfit font-bold text-xs tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
              COMMERCE
              <span className="h-0.5 w-3 bg-red-600 inline-block"></span>
              <span className="text-red-500 font-extrabold tracking-widest">MELISSA</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-semibold tracking-wider uppercase transition-colors py-2 border-b-2 ${
                  isActive
                    ? "text-slate-100 border-slate-200 font-bold"
                    : "text-slate-300 border-transparent hover:text-white hover:border-red-500"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* CONTACT Dropdown */}
          <div 
            className="relative group py-2"
            onMouseEnter={() => setContactDropdownOpen(true)}
            onMouseLeave={() => setContactDropdownOpen(false)}
          >
            <Link
              href="/contact"
              className={`text-xs font-semibold tracking-wider uppercase transition-colors py-2 border-b-2 flex items-center gap-1 ${
                pathname.includes("contact") || pathname.includes("volunteer") || pathname.includes("give-donate")
                  ? "text-slate-100 border-slate-200 font-bold"
                  : "text-slate-300 border-transparent hover:text-white hover:border-red-500"
              }`}
            >
              CONTACT ▾
            </Link>

            {/* Seamless Dropdown Container with invisible hover bridge */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-1 w-48 z-50 transition-all duration-150 ${
              contactDropdownOpen 
                ? "opacity-100 visible pointer-events-auto" 
                : "opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto"
            }`}>
              <div className="bg-[#0F1218] border border-white/15 rounded-xl shadow-2xl p-2 space-y-1">
                {contactSublinks.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    onClick={() => setContactDropdownOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition ${
                      pathname === sub.href
                        ? "bg-red-950/80 text-white border-l-2 border-red-500"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Action CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="btn-red px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-900/30"
          >
            <PhoneCall className="w-4 h-4 text-slate-200" />
            CONTACT US
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F1218] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-semibold tracking-wider uppercase ${
                  isActive
                    ? "bg-red-950/60 text-slate-100 border-l-4 border-slate-200"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            );
          })}

          {/* Contact Subpages in Mobile Drawer */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">CONTACT & ENGAGEMENT</div>
            {contactSublinks.map((sub) => (
              <Link
                key={sub.name}
                href={sub.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold tracking-wider text-slate-300 hover:text-white hover:bg-white/5"
              >
                <span>{sub.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            ))}
          </div>
          
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full btn-red py-3 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-slate-200" />
              CONTACT US
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
