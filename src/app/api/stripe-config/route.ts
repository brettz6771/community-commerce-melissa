import { NextResponse } from "next/server";

/**
 * Publishable keys are designed to be public (pk_live_ / pk_test_).
 * Railway commonly stores this as STRIPE_PUBLISHABLE_KEY, while Next.js
 * client bundles only inline NEXT_PUBLIC_* names.
 */
export async function GET() {
  const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    "";

  if (!publishableKey) {
    return NextResponse.json({ publishableKey: null, isConfigured: false });
  }

  return NextResponse.json({ publishableKey, isConfigured: true });
}
