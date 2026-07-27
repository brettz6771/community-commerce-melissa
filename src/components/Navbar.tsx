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
      <div className="w-full px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/community-commerce-logo-transparent.png"
            alt="Community Commerce Melissa Logo"
            className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
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
        </nav>

        {/* Action CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenJoinModal}
            className="btn-red px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-900/30"
          >
            <UserPlus className="w-4 h-4 text-slate-200" />
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
                    ? "bg-red-950/60 text-slate-100 border-l-4 border-slate-200"
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
              <UserPlus className="w-4 h-4 text-slate-200" />
              JOIN TODAY
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
