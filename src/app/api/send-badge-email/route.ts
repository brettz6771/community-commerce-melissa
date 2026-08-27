import { NextResponse } from "next/server";
import { sendMemberBadgeOnlyEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { isValidEmail } from "@/lib/html";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
      return NextResponse.json({ error: "A valid Stripe checkout session is required." }, { status: 400 });
    }

    let stripe;
    try {
      stripe = getStripe();
    } catch {
      return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json({ error: "Checkout session is not paid." }, { status: 402 });
    }

    const metadata = session.metadata || {};
    const email = session.customer_details?.email || session.customer_email || metadata.email;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email address required" }, { status: 400 });
    }

    const businessName = metadata.businessName || metadata.company || "Melissa Community Partner";
    const ownerName = metadata.contactName || metadata.donorName || "";
    const shortId = session.id.slice(-6).toUpperCase();
    const memberId = `CCM-2026-${shortId}`;

    await sendMemberBadgeOnlyEmail({
      memberEmail: email,
      businessName,
      ownerName,
      tier: metadata.tier || "Community Partner",
      memberId,
      amount: ((session.amount_total || 0) / 100).toFixed(2),
      city: metadata.city || "Melissa",
      state: metadata.state || "TX",
      phone: metadata.phone || "",
      category: metadata.category || "General Business",
      website: metadata.website || "",
      sessionId: session.id,
    });

    console.log(`Digital Membership Badge dispatched to ${email} for Member ID ${memberId}`);

    return NextResponse.json({ 
      success: true, 
      message: `Digital Membership Badge and Welcome Toolkit successfully dispatched to ${email}.` 
    });
  } catch (error: any) {
    console.error("Error dispatching member badge email:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send badge email." },
      { status: 500 }
    );
  }
}
