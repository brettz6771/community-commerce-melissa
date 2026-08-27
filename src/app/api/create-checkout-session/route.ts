import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { clampDonationAmountUsd, getCheckoutOrigin, truncateMeta } from "@/lib/site";
import { isValidEmail } from "@/lib/html";

const PARTNER_ANNUAL_CENTS = 49000; // Recurring list price: $490/year
const PARTNER_INTRO_OFF_CENTS = 10000; // First invoice only: $100 off → $390 due today

function isOnceHundredOffCoupon(coupon: Stripe.Coupon): boolean {
  return (
    !coupon.deleted &&
    coupon.valid &&
    coupon.duration === "once" &&
    coupon.amount_off === PARTNER_INTRO_OFF_CENTS &&
    (coupon.currency || "usd") === "usd"
  );
}

/**
 * Resolve a duration=once $100-off coupon so year 1 bills $390 and every
 * renewal bills the $490 subscription price. Never fall back to a $390
 * recurring price — that would keep renewing at $390 forever.
 */
async function resolvePartnerCoupon(stripe: Stripe): Promise<string | null> {
  const CANDIDATE_IDS = ["CCM_PARTNER_100_OFF_V2", "CCM_PARTNER_100_OFF"];

  for (const cid of CANDIDATE_IDS) {
    try {
      const existing = await stripe.coupons.retrieve(cid);
      if (isOnceHundredOffCoupon(existing)) {
        return existing.id;
      }
    } catch {
      // Not found or deleted; continue
    }
  }

  try {
    const list = await stripe.coupons.list({ limit: 100 });
    const match = list.data.find(isOnceHundredOffCoupon);
    if (match) {
      return match.id;
    }
  } catch {
    // List permission may be restricted
  }

  try {
    const created = await stripe.coupons.create({
      id: "CCM_PARTNER_100_OFF_V2",
      amount_off: PARTNER_INTRO_OFF_CENTS,
      currency: "usd",
      duration: "once",
    });
    if (created?.id) {
      return created.id;
    }
  } catch {
    // ID might already exist in a deleted/invalid state
  }

  try {
    const created = await stripe.coupons.create({
      amount_off: PARTNER_INTRO_OFF_CENTS,
      currency: "usd",
      duration: "once",
    });
    if (created?.id) {
      return created.id;
    }
  } catch (err) {
    console.error("Unable to create Community Partner $100-off once coupon:", err);
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      tier = "Community Partner ($390 1st Yr • Renews $490/yr)", 
      businessName, 
      ownerName, 
      email, 
      phone, 
      category, 
      website, 
      notes 
    } = body;

    let stripe: Stripe;
    try {
      stripe = getStripe();
    } catch {
      console.error("STRIPE_SECRET_KEY is not set in environment variables.");
      return NextResponse.json(
        { 
          error: "Stripe is not configured yet. Please add STRIPE_SECRET_KEY to your Railway / environment variables.",
          isConfigured: false 
        },
        { status: 500 }
      );
    }

    const isDonation = Boolean(body.isDonation) || body.type === "donation" || body.formType === "Donation";
    const origin = getCheckoutOrigin(request);

    const useEmbedded = body.uiMode === "embedded" || body.embedded === true;

    // ----------------------------------------------------
    // Case 1: One-Time Donation / Contribution (mode: "payment")
    // ----------------------------------------------------
    if (isDonation) {
      const donationAmountNum = clampDonationAmountUsd(body.amount);
      const amountInCents = Math.round(donationAmountNum * 100);
      const donorName = truncateMeta(body.name || body.donorName || ownerName || "Generous Supporter", 200);
      const donorEmail = body.email || body.donorEmail || email;
      const donationMessage = truncateMeta(body.message || notes || "", 450);
      const company = truncateMeta(body.company || businessName || "", 200);

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
        customer_email: isValidEmail(donorEmail) ? donorEmail.trim() : undefined,
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
    // Sole Membership Tier: Community Partner ($390 1st Yr, renews $490/yr)
    // ----------------------------------------------------
    const isTest = Boolean(body.isTest) || tier.toLowerCase().includes("test");

    const productName = "Community Partner — Annual Membership";
    const productDesc = "Community Commerce Melissa — Community Partner Level ($390 First Year Introductory Special • Renews at $490/yr)";
    const successTierParam = "Community Partner";

    const partnerCouponId = await resolvePartnerCoupon(stripe);
    if (!partnerCouponId) {
      return NextResponse.json(
        {
          error:
            "The $100 first-year membership discount could not be applied. Please try again or email info@communitycommercemelissa.org.",
        },
        { status: 503 }
      );
    }

    const membershipMetadata: Stripe.MetadataParam = {
      type: "membership",
      tier: isTest ? "Community Partner ($390 1st Yr • Renews $490/yr)" : truncateMeta(tier, 200),
      isTest: isTest ? "true" : "false",
      businessName: truncateMeta(businessName || "N/A"),
      contactName: truncateMeta(ownerName || "N/A"),
      email: truncateMeta(email || "N/A"),
      phone: truncateMeta(phone || "N/A", 50),
      category: truncateMeta(category || "General Business", 100),
      description: truncateMeta(body.description || ""),
      website: truncateMeta(website || ""),
      city: truncateMeta(body.city || "Melissa", 80),
      state: truncateMeta(body.state || "TX", 40),
      notes: truncateMeta(notes || "None"),
    };

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
            // Recurring list price is always $490/year. The once coupon takes $100
            // off invoice #1 only ($390 due today); later cycles bill $490.
            unit_amount: PARTNER_ANNUAL_CENTS,
            recurring: {
              interval: "year",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      discounts: [{ coupon: partnerCouponId }],
      mode: "subscription",
      customer_email: isValidEmail(email) ? email.trim() : undefined,
      metadata: membershipMetadata,
      subscription_data: {
        metadata: membershipMetadata,
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
    } catch (createErr: unknown) {
      const errMsg = String(createErr instanceof Error ? createErr.message : createErr).toLowerCase();
      // Keep the $490 recurring price. If the coupon ID was stale, mint a fresh
      // once-only $100 coupon and retry — never drop the list price to $390.
      if (errMsg.includes("coupon") || errMsg.includes("discount") || errMsg.includes("no such")) {
        console.warn("Retrying Community Partner checkout with a fresh $100-off once coupon:", createErr);
        const freshCoupon = await stripe.coupons.create({
          amount_off: PARTNER_INTRO_OFF_CENTS,
          currency: "usd",
          duration: "once",
        });
        sessionParams.discounts = [{ coupon: freshCoupon.id }];
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

