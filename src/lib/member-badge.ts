import { escapeHtml } from "./html";

export type BadgeRenderData = {
  businessName: string;
  memberId: string;
  tier: string;
  ownerName?: string;
  validThrough?: string;
};

export function getBadgeTierLabel(tier: string | undefined): string {
  const value = String(tier || "").toLowerCase();
  if (value.includes("corporate") || value.includes("sponsorship")) {
    return "Corporate Partner";
  }
  if (value.includes("founding")) {
    return "Founding Member";
  }
  return "Community Partner";
}

export function resolveMemberId(member: { memberId?: string | null; id?: number | string | null }): string {
  const stored = String(member.memberId || "").trim();
  if (stored) return stored.toUpperCase();
  const numericId = Number(member.id);
  if (Number.isFinite(numericId) && numericId > 0) {
    return `CCM-2026-${String(Math.trunc(numericId)).padStart(6, "0")}`;
  }
  return "CCM-2026-MEMBER";
}

export function getBadgeValidThrough(dateStr?: string): string {
  try {
    const baseDate = dateStr ? new Date(dateStr) : new Date();
    if (Number.isNaN(baseDate.getTime())) {
      const fallback = new Date();
      fallback.setFullYear(fallback.getFullYear() + 1);
      return fallback.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
    }
    const renewalDate = new Date(baseDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    return renewalDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
  } catch {
    return "AUGUST 2027";
  }
}

export function badgePngFilename(memberId: string): string {
  const safe = String(memberId || "CCM-MEMBER").replace(/[^A-Za-z0-9_-]/g, "");
  return `CCM-Official-Badge-${safe || "CCM-MEMBER"}.png`;
}

export function toBadgeRenderData(member: {
  businessName?: string;
  memberId?: string | null;
  id?: number | string | null;
  tier?: string;
  badge?: string;
  ownerName?: string;
  createdAt?: string;
}): BadgeRenderData {
  return {
    businessName: member.businessName || "Melissa Community Partner",
    memberId: resolveMemberId(member),
    tier: member.tier || member.badge || "Community Partner",
    ownerName: member.ownerName || "",
    validThrough: getBadgeValidThrough(member.createdAt),
  };
}

/** Server-safe SVG of the official member badge (same content as the canvas PNG). */
export function renderMemberBadgeSvg(data: BadgeRenderData): string {
  const tier = getBadgeTierLabel(data.tier).toUpperCase();
  const business = escapeHtml((data.businessName || "MELISSA COMMUNITY PARTNER").toUpperCase());
  const memberId = escapeHtml(data.memberId || "CCM-2026-MEMBER");
  const owner = data.ownerName ? escapeHtml(data.ownerName) : "";
  const validThrough = escapeHtml(data.validThrough || getBadgeValidThrough());

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="Community Commerce Melissa member badge">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0E14"/>
      <stop offset="50%" stop-color="#151922"/>
      <stop offset="100%" stop-color="#0B0E14"/>
    </linearGradient>
    <linearGradient id="ribbon" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7A141A"/>
      <stop offset="100%" stop-color="#A81C24"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#DC2626" stop-opacity="0"/>
      <stop offset="50%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#DC2626" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect x="30" y="30" width="1140" height="740" fill="none" stroke="#A81C24" stroke-width="14"/>
  <rect x="46" y="46" width="1108" height="708" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <rect x="50" y="70" width="1100" height="90" fill="url(#ribbon)"/>
  <text x="600" y="125" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">COMMUNITY COMMERCE MELISSA, TX</text>
  <text x="600" y="205" text-anchor="middle" fill="#94A3B8" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">OFFICIAL VERIFIED BUSINESS MEMBER</text>
  <text x="600" y="275" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="800">2026 ${escapeHtml(tier)}</text>
  <line x1="300" y1="310" x2="900" y2="310" stroke="url(#line)" stroke-width="4"/>
  <rect x="150" y="350" width="900" height="140" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
  <text x="600" y="385" text-anchor="middle" fill="#EF4444" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700">OFFICIALLY ISSUED TO:</text>
  <text x="600" y="445" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700">${business}</text>
  ${owner ? `<text x="600" y="475" text-anchor="middle" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="16">${owner}</text>` : ""}
  <rect x="150" y="530" width="420" height="160" fill="rgba(168,28,36,0.15)" stroke="rgba(168,28,36,0.4)"/>
  <text x="180" y="570" fill="#94A3B8" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700">MEMBER ID NUMBER</text>
  <text x="180" y="620" fill="#FFFFFF" font-family="ui-monospace, monospace" font-size="32" font-weight="800">${memberId}</text>
  <text x="180" y="660" fill="#22C55E" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">✓ VERIFIED ACTIVE</text>
  <rect x="630" y="530" width="420" height="160" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
  <text x="660" y="570" fill="#94A3B8" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700">MEMBERSHIP TERM</text>
  <text x="660" y="620" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="800">${validThrough}</text>
  <text x="660" y="660" fill="#94A3B8" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">Melissa, Collin County, TX</text>
</svg>`;
}
