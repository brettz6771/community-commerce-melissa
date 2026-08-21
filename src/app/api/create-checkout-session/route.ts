import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      tier = "Community Partner ($390/yr)", 
      businessName, 
      ownerName, 
      email, 
      phone, 
      category, 
      website, 
      notes 
    } = body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not set in environment variables.");
      return NextResponse.json(
        { 
          error: "Stripe is not configured yet. Please add STRIPE_SECRET_KEY to your Railway / environment variables.",
          isConfigured: false 
        },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });

    const isPartner = tier.toLowerCase().includes("partner");
    const amountInCents = isPartner ? 39000 : 35000; // $390 for Partner, $350 for Member
    const productName = isPartner 
      ? "Community Partner — Annual Membership" 
      : "Community Member — Annual Membership";
    const productDesc = isPartner
      ? "Community Commerce Melissa — Enhanced Partner Membership (1 Year • Limited-Time Rate)"
      : "Community Commerce Melissa — Community Member Level (1 Year)";

    // Determine site base URL
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://communitycommercemelissa.org";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: productDesc,
              images: [`${origin}/ccm-logo-transparent.png`],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email && email.includes("@") ? email : undefined,
      metadata: {
        tier,
        businessName: businessName || "N/A",
        contactName: ownerName || "N/A",
        email: email || "N/A",
        phone: phone || "N/A",
        category: category || "N/A",
        website: website || "N/A",
        notes: notes || "None",
      },
      success_url: `${origin}/membership?success=true&tier=${encodeURIComponent(isPartner ? "Community Partner" : "Community Member")}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/membership?canceled=true`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate Stripe Checkout session." },
      { status: 500 }
    );
  }
}
