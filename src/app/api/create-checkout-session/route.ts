import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Helper to safely resolve or create a valid $100-off once coupon for Community Partner.
 * Returns a valid coupon ID or null if coupons cannot be retrieved/created.
 */
async function resolvePartnerCoupon(stripe: Stripe): Promise<string | null> {
  const CANDIDATE_IDS = ["CCM_PARTNER_100_OFF_V2", "CCM_PARTNER_100_OFF"];

  // 1. Try candidate IDs
  for (const cid of CANDIDATE_IDS) {
    try {
      const existing = await stripe.coupons.retrieve(cid);
      if (existing && !existing.deleted && existing.valid) {
        return existing.id;
      }
    } catch {
      // Not found or deleted; continue
    }
  }

  // 2. Search existing coupons for a matching $100 off once discount
  try {
    const list = await stripe.coupons.list({ limit: 25 });
    const match = list.data.find(
      (c) => !c.deleted && c.valid && c.amount_off === 10000 && c.duration === "once" && c.currency === "usd"
    );
    if (match) {
      return match.id;
    }
  } catch {
    // List permission may be restricted
  }

  // 3. Try to create with versioned ID (omit 'name' to comply strictly with all Stripe API version constraints)
  try {
    const created = await stripe.coupons.create({
      id: "CCM_PARTNER_100_OFF_V2",
      amount_off: 10000,
      currency: "usd",
      duration: "once",
    });
    if (created?.id) {
      return created.id;
    }
  } catch {
    // ID might be taken or deleted; continue
  }

  // 4. Try to create without custom ID (let Stripe auto-assign ID)
  try {
    const created = await stripe.coupons.create({
      amount_off: 10000,
      currency: "usd",
      duration: "once",
    });
    if (created?.id) {
      return created.id;
    }
  } catch {
    // Handled via fallback to direct $390 unit amount
  }

  return null;
}

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

    const useEmbedded = body.uiMode === "embedded" || body.embedded === true;

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

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
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
      };

      if (useEmbedded) {
        sessionParams.ui_mode = "embedded";
        sessionParams.return_url = `${origin}/give-donate?success=true&amount=${encodeURIComponent(`$${donationAmountNum}`)}&session_id={CHECKOUT_SESSION_ID}`;
      } else {
        sessionParams.success_url = `${origin}/give-donate?success=true&amount=${encodeURIComponent(`$${donationAmountNum}`)}&session_id={CHECKOUT_SESSION_ID}`;
        sessionParams.cancel_url = `${origin}/give-donate?canceled=true`;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      return NextResponse.json({ 
        clientSecret: session.client_secret, 
        url: session.url, 
        sessionId: session.id 
      });
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

    if (isPartner) {
      productName = "Community Partner — Annual Membership";
      productDesc = "Community Commerce Melissa — Community Partner Level ($390 First Year Introductory Special • Renews at $490/yr)";
      successTierParam = "Community Partner";

      const partnerCouponId = await resolvePartnerCoupon(stripe);
      if (partnerCouponId) {
        amountInCents = 49000; // Base annual rate $490.00/yr with $100 off 1st year coupon
        discounts = [{ coupon: partnerCouponId }];
      } else {
        // Fallback if coupons cannot be created/retrieved: charge $390 directly without coupon requirement
        amountInCents = 39000;
        discounts = undefined;
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
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
        tier: isTest ? "Community Partner ($390 1st Yr • Renews $490/yr)" : tier,
        isTest: isTest ? "true" : "false",
        businessName: businessName || "N/A",
        contactName: ownerName || "N/A",
        email: email || "N/A",
        phone: phone || "N/A",
        category: category || "General Business",
        description: body.description || "",
        website: website || "",
        city: body.city || "Melissa",
        state: body.state || "TX",
        notes: notes || "None",
      },
    };

    if (useEmbedded) {
      sessionParams.ui_mode = "embedded";
      sessionParams.return_url = `${origin}/membership/receipt?session_id={CHECKOUT_SESSION_ID}&tier=${encodeURIComponent(successTierParam)}`;
    } else {
      sessionParams.success_url = `${origin}/membership/receipt?session_id={CHECKOUT_SESSION_ID}&tier=${encodeURIComponent(successTierParam)}`;
      sessionParams.cancel_url = `${origin}/membership?canceled=true`;
    }

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(sessionParams);
    } catch (createErr: any) {
      const errMsg = (createErr?.message || "").toLowerCase();
      // If Stripe rejected due to a coupon/discount issue, retry cleanly without discounts and charge $390 directly
      if (discounts && (errMsg.includes("coupon") || errMsg.includes("discount") || errMsg.includes("no such"))) {
        console.warn("Retrying Stripe checkout session creation without coupon discount due to:", createErr.message);
        sessionParams.discounts = undefined;
        if (sessionParams.line_items?.[0]?.price_data) {
          sessionParams.line_items[0].price_data.unit_amount = 39000;
        }
        session = await stripe.checkout.sessions.create(sessionParams);
      } else {
        throw createErr;
      }
    }

    return NextResponse.json({ 
      clientSecret: session.client_secret, 
      url: session.url, 
      sessionId: session.id 
    });
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate Stripe Checkout session." },
      { status: 500 }
    );
  }
}

