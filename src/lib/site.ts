const PRODUCTION_ORIGINS = [
  "https://communitycommercemelissa.org",
  "https://www.communitycommercemelissa.org",
];

export function getConfiguredSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://communitycommercemelissa.org").replace(/\/$/, "");
}

/**
 * Resolve the checkout return origin from an allowlist so a forged Origin
 * header cannot send Stripe success redirects to an attacker site.
 */
export function getCheckoutOrigin(request: Request): string {
  const configured = getConfiguredSiteUrl();
  const origin = request.headers.get("origin");

  const allowed = new Set([
    configured,
    ...PRODUCTION_ORIGINS,
  ]);

  if (process.env.NODE_ENV !== "production") {
    if (origin?.startsWith("http://localhost:") || origin?.startsWith("http://127.0.0.1:")) {
      return origin;
    }
  }

  if (origin && allowed.has(origin)) {
    return origin;
  }

  return configured;
}

export function clampDonationAmountUsd(raw: unknown): number {
  const n = Number(raw);
  const dollars = Number.isFinite(n) ? n : 50;
  // Stripe's card minimum is $0.50; cap large values to avoid accidental huge charges.
  return Math.min(10_000, Math.max(1, Math.round(dollars * 100) / 100));
}

export function truncateMeta(value: unknown, max = 450): string {
  const text = String(value ?? "");
  return text.length <= max ? text : text.slice(0, max);
}
