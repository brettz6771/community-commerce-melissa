import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      // Return simulated receipt data if in development without key
      return NextResponse.json({
        id: sessionId,
        customerName: "Community Member",
        customerEmail: "member@example.com",
        businessName: "Melissa Local Business",
        tier: "Community Partner",
        amount: 390,
        memberId: `CCM-2026-${sessionId.slice(-6).toUpperCase()}`,
        status: "complete",
        isSubscription: true,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer", "subscription"],
    });

    const metadata = session.metadata || {};
    const customerDetails = session.customer_details;
    const isDonation = metadata.type === "donation";
    const isTestSession = metadata.isTest === "true" || (metadata.tier && metadata.tier.toLowerCase().includes("test"));
    const customerName = metadata.contactName || metadata.donorName || customerDetails?.name || "Community Supporter";
    const customerEmail = customerDetails?.email || metadata.donorEmail || metadata.email || "";
    const businessName = metadata.businessName || metadata.company || customerDetails?.name || "Melissa Community Member";
    const tier = isTestSession 
      ? "Community Partner ($390 1st Yr • Renews $490/yr)" 
      : metadata.tier || (isDonation ? "One-Time Contribution" : "Community Partner ($390/yr)");
    const amount = (session.amount_total || 0) / 100;
    const shortId = session.id.slice(-6).toUpperCase();
    const memberId = `CCM-2026-${shortId}`;
    const date = new Date(session.created * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
      subscriptionId: typeof session.subscription === "string" ? session.subscription : (session.subscription as any)?.id,
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
