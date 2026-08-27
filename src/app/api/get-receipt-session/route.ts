import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId || !sessionId.startsWith("cs_")) {
      return NextResponse.json({ error: "Missing or invalid session_id parameter" }, { status: 400 });
    }

    if (sessionId.startsWith("cs_test_sim_")) {
      return NextResponse.json({ error: "Simulated sessions are not available." }, { status: 404 });
    }

    let stripe;
    try {
      stripe = getStripe();
    } catch {
      return NextResponse.json(
        { error: "Receipt lookup is unavailable because Stripe is not configured." },
        { status: 503 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer", "subscription"],
    });

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json(
        { error: "Checkout session is not paid." },
        { status: 402 }
      );
    }

    const metadata = session.metadata || {};
    const customerDetails = session.customer_details;
    const isDonation = metadata.type === "donation";
    const isTestSession = metadata.isTest === "true" || (metadata.tier && metadata.tier.toLowerCase().includes("test"));
    const customerName = metadata.contactName || metadata.donorName || customerDetails?.name || "Community Partner";
    const customerEmail = customerDetails?.email || metadata.donorEmail || metadata.email || "";
    const businessName = metadata.businessName || metadata.company || customerDetails?.name || "Melissa Community Partner";
    const tier = isTestSession 
      ? "Community Partner ($390 1st Yr • Renews $490/yr)" 
      : metadata.tier || (isDonation ? "One-Time Contribution" : "Community Partner ($390 1st Yr • Renews $490/yr)");
    const amount = (session.amount_total || 0) / 100;
    const shortId = session.id.slice(-6).toUpperCase();
    const memberId = `CCM-2026-${shortId}`;
    const date = new Date(session.created * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Directory writes happen in the Stripe webhook after verified payment.
    // This GET endpoint is read-only so loading a receipt cannot mutate memberships.

    return NextResponse.json({
      id: session.id,
      customerName,
      customerEmail,
      businessName,
      tier,
      amount,
      memberId,
      status: session.status,
      paymentStatus: session.payment_status,
      isSubscription: session.mode === "subscription",
      subscriptionId: typeof session.subscription === "string" ? session.subscription : (session.subscription as { id?: string } | null)?.id,
      date,
      isTest: metadata.isTest === "true",
      category: metadata.category || "General Business",
      website: metadata.website || "",
      notes: metadata.notes || "",
    });
  } catch (error: any) {
    console.error("Error retrieving checkout receipt session:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve receipt details." },
      { status: 500 }
    );
  }
}
