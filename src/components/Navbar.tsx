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
  const pathname = usePathname();

  const navLinks = [
    { name: "ABOUT", href: "/about" },
    { name: "EVENTS", href: "/events" },
    { name: "DIRECTORY", href: "/directory" },
    { name: "MEMBERSHIP", href: "/membership" },
    { name: "SPONSOR", href: "/sponsorship" },
    { name: "NEWS", href: "/news" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/10 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-[#A81C24] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0E14] rounded-full flex items-center justify-center relative overflow-hidden">
              {/* Monogram CC with Red Bird Graphic */}
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-red-600 fill-current">
                <path d="M 30,25 C 15,25 15,75 30,75 C 40,75 45,65 45,65 L 55,65 C 55,65 48,85 30,85 C 5,85 0,60 0,50 C 0,30 10,15 30,15 C 48,15 55,35 55,35 L 45,35 C 45,35 40,25 30,25 Z" />
                <path d="M 65,25 C 50,25 50,75 65,75 C 75,75 80,65 80,65 L 90,65 C 90,65 83,85 65,85 C 40,85 35,60 35,50 C 35,30 45,15 65,15 C 83,15 90,35 90,35 L 80,35 C 80,35 75,25 65,25 Z" fill="#D4AF37" />
                {/* Cardinal Crest Accent */}
                <polygon points="75,20 95,10 82,30" fill="#A81C24" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="font-outfit font-extrabold text-lg tracking-wider text-white leading-tight uppercase">
              COMMUNITY
            </span>
            <span className="font-outfit font-bold text-xs tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
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
                    ? "text-amber-400 border-amber-400"
                    : "text-slate-300 border-transparent hover:text-white hover:border-red-500"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenJoinModal}
            className="btn-red px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-900/30"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            JOIN TODAY
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={onOpenJoinModal}
            className="btn-red px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider"
          >
            JOIN
          </button>
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
                    ? "bg-red-950/60 text-amber-400 border-l-4 border-amber-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenJoinModal) onOpenJoinModal();
              }}
              className="w-full btn-red py-3 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              JOIN TODAY
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
