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

    const isDonation = Boolean(body.isDonation) || body.type === "donation" || body.formType === "Donation";
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://communitycommercemelissa.org";

    // ----------------------------------------------------
    // Case 1: One-Time Donation / Contribution (mode: "payment")
    // ----------------------------------------------------
    if (isDonation) {
      const donationAmountNum = Math.max(1, Number(body.amount) || 100);
      const amountInCents = Math.round(donationAmountNum * 100);
      const donorName = body.name || body.donorName || ownerName || "Generous Supporter";
      const donorEmail = body.email || body.donorEmail || email;
      const donationMessage = body.message || notes || "";
      const company = body.company || businessName || "";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Community Commerce Melissa — One-Time Contribution ($${donationAmountNum})`,
                description: `501(c)(3) Non-Profit Contribution supporting Melissa community programs, youth scholarships, and local initiatives.`,
                images: [`${origin}/ccm-logo-transparent.png`],
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: donorEmail && donorEmail.includes("@") ? donorEmail : undefined,
        metadata: {
          type: "donation",
          donorName,
          donorEmail: donorEmail || "N/A",
          company: company || "N/A",
          donationAmount: `$${donationAmountNum}`,
          message: donationMessage || "None",
        },
        success_url: `${origin}/give-donate?success=true&amount=${encodeURIComponent(`$${donationAmountNum}`)}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/give-donate?canceled=true`,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    // ----------------------------------------------------
    // Case 2: Membership Subscriptions (mode: "subscription")
    // ----------------------------------------------------
    const isTest = Boolean(body.isTest) || tier.toLowerCase().includes("test");
    const isPartner = !isTest && tier.toLowerCase().includes("partner");

    let amountInCents = 35000; // default Community Member $350/yr
    let productName = "Community Member — Annual Membership";
    let productDesc = "Community Commerce Melissa — Community Member Level (1 Year Recurring Membership)";
    let successTierParam = "Community Member";
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined = undefined;

    if (isTest) {
      amountInCents = 100; // $1.00 for testing
      productName = "Community Commerce Melissa — Live Test Membership ($1.00/yr)";
      productDesc = "Live Stripe testing checkout for Community Commerce Melissa (Annual Recurring Subscription)";
      successTierParam = "Live Test Membership ($1.00)";
    } else if (isPartner) {
      amountInCents = 49000; // Base rate is $490/yr
      productName = "Community Partner — Annual Membership";
      productDesc = "Community Commerce Melissa — Enhanced Partner Membership ($390 First Year Introductory Deal • Renews at $490/yr)";
      successTierParam = "Community Partner";

      // Create a $100 off coupon for the first invoice only (duration: 'once')
      try {
        const coupon = await stripe.coupons.create({
          amount_off: 10000, // $100.00 off
          currency: "usd",
          duration: "once", // Applies only to the first billing cycle
          name: "Inaugural Partner Discount ($100 Off First Year)",
        });
        discounts = [{ coupon: coupon.id }];
      } catch (couponErr) {
        console.warn("Could not create dynamic Stripe coupon:", couponErr);
      }
    }

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
            recurring: {
              interval: "year",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      discounts,
      mode: "subscription",
      customer_email: email && email.includes("@") ? email : undefined,
      metadata: {
        tier,
        isTest: isTest ? "true" : "false",
        businessName: businessName || "N/A",
        contactName: ownerName || "N/A",
        email: email || "N/A",
        phone: phone || "N/A",
        category: category || "N/A",
        website: website || "N/A",
        notes: notes || "None",
      },
      success_url: `${origin}/membership?success=true&tier=${encodeURIComponent(successTierParam)}&session_id={CHECKOUT_SESSION_ID}`,
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
