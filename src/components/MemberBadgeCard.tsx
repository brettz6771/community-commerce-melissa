"use client";

import { ShieldCheck, Sparkles } from "lucide-react";
import { getBadgeTierLabel } from "@/lib/member-badge";

type MemberBadgeCardProps = {
  businessName: string;
  memberId: string;
  tier?: string;
  ownerName?: string;
  validThrough?: string;
};

export default function MemberBadgeCard({
  businessName,
  memberId,
  tier,
  ownerName,
  validThrough,
}: MemberBadgeCardProps) {
  const cleanTierDisplay = getBadgeTierLabel(tier);

  return (
    <div className="bg-[#0B0E14] text-white rounded-3xl p-6 sm:p-8 border-4 border-[#A81C24] shadow-2xl relative overflow-hidden ring-4 ring-black/20">
      <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="border-b border-white/10 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/ccm-logo-transparent.png"
            alt="CCM Logo"
            className="h-12 w-auto object-contain drop-shadow"
          />
          <div>
            <div className="font-outfit font-extrabold text-sm sm:text-base tracking-wider uppercase text-white">
              COMMUNITY COMMERCE MELISSA
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>MELISSA, TEXAS</span>
              <span className="w-1 h-1 rounded-full bg-red-500" />
              <span className="text-red-400">BUSINESS MEMBER</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 border border-red-500/50 rounded-xl px-3 py-1.5 text-center shadow">
          <div className="text-[9px] font-black text-slate-200 uppercase tracking-wider">OFFICIAL</div>
          <div className="text-xs font-black text-white uppercase tracking-tight">2026–2027</div>
        </div>
      </div>

      <div className="py-8 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          CERTIFIED BUSINESS MEMBER
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">MEMBERSHIP LEVEL</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-outfit uppercase tracking-tight text-white">
            {cleanTierDisplay}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-lg mx-auto shadow-inner">
          <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider">PROUDLY ISSUED TO:</div>
          <div className="text-xl sm:text-2xl font-black font-outfit text-white uppercase mt-0.5">
            {businessName || "Melissa Business Member"}
          </div>
          {ownerName ? (
            <div className="text-xs text-slate-300 mt-1 font-medium">Representative: {ownerName}</div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/10 pt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">MEMBER ID</div>
          <div className="font-mono font-bold text-white text-sm mt-0.5">{memberId}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">VALID THROUGH</div>
          <div className="font-bold text-white text-sm mt-0.5">{validThrough || "2026 – 2027"}</div>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end gap-2 text-emerald-400 font-bold">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-[11px] uppercase tracking-wider">Active Verified</span>
        </div>
      </div>

    </div>
  );
}
