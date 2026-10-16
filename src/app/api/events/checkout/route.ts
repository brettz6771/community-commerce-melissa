import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getCheckoutOrigin, truncateMeta } from "@/lib/site";
import { isValidEmail } from "@/lib/html";
import {
  OKTOBERFEST_PRICE_CENTS,
  TENT_OR_TREAT_PROMO_CODE,
  getSiteEvent,
  getTentSpaceOption,
  isPaidEventPath,
  tentPromoCodeMatches,
  tentSpaceChargeCents,
  tentSpaceChargeLabel,
  validateEventRegistrationInput,
} from "@/lib/site-events";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = validateEventRegistrationInput({ ...body, path: body.path || "guest" });
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { eventId, path, name, email, phone, company, guests, additionalGuests, notes, spaceOption } = parsed.value;
    const partySize = Number(guests) || 1;
    if (!isPaidEventPath(eventId, path)) {
      return NextResponse.json({ error: "This registration path does not use checkout." }, { status: 400 });
    }

    const event = getSiteEvent(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    let stripe;
    try {
      stripe = getStripe();
    } catch {
      return NextResponse.json(
        { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to continue." },
        { status: 500 }
      );
    }

    const origin = getCheckoutOrigin(request);
    const isTentSpace = eventId === "tent-or-treat" && path === "sponsor";
    const selectedTentSpace = isTentSpace ? getTentSpaceOption(spaceOption) : undefined;
    const rawPromo = isTentSpace ? (body.promoCode ?? body.couponCode) : undefined;
    const promoApplied = isTentSpace && tentPromoCodeMatches(rawPromo);
    const tentChargeCents = selectedTentSpace
      ? tentSpaceChargeCents(selectedTentSpace.id, rawPromo)
      : 0;

    const lineItems = isTentSpace && selectedTentSpace
      ? [
          {
            price_data: {
              currency: "usd",
              unit_amount: tentChargeCents,
              product_data: {
                name: `${event.title} — ${selectedTentSpace.name}`,
                description: `${selectedTentSpace.description} Setup: Saturday, Oct 31, 2026, 12:30 PM - 2:00 PM at Melissa Lake Park.`,
                images: [`${origin}/events/community-tent-or-treat.png`],
              },
            },
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: "usd",
              unit_amount: OKTOBERFEST_PRICE_CENTS,
              product_data: {
                name: `${event.title} — guest ticket`,
                description: "Non-member admission, $20 per guest including yourself. Members register free with a matching membership email.",
                images: [`${origin}/ccm-logo-transparent.png`],
              },
            },
            quantity: partySize,
          },
        ];

    const sessionMetadata: Record<string, string> = {
      type: "event",
      eventId,
      path,
      name: truncateMeta(name, 200),
      email: truncateMeta(email, 200),
      phone: truncateMeta(phone, 50),
      company: truncateMeta(company, 200),
      guests: truncateMeta(guests, 20),
      notes: truncateMeta(notes, 450),
    };

    if (isTentSpace && selectedTentSpace) {
      sessionMetadata.spaceOption = selectedTentSpace.id;
      sessionMetadata.spaceName = truncateMeta(selectedTentSpace.name, 100);
      sessionMetadata.listPrice = selectedTentSpace.priceLabel;
      sessionMetadata.spacePrice = tentSpaceChargeLabel(selectedTentSpace.id, rawPromo);
      if (promoApplied) sessionMetadata.promoCode = TENT_OR_TREAT_PROMO_CODE;
    } else {
      sessionMetadata.guest2Name = truncateMeta(additionalGuests[0]?.name, 120);
      sessionMetadata.guest2Email = truncateMeta(additionalGuests[0]?.email, 200);
      sessionMetadata.guest2Phone = truncateMeta(additionalGuests[0]?.phone, 40);
      sessionMetadata.guest3Name = truncateMeta(additionalGuests[1]?.name, 120);
      sessionMetadata.guest3Email = truncateMeta(additionalGuests[1]?.email, 200);
      sessionMetadata.guest3Phone = truncateMeta(additionalGuests[1]?.phone, 40);
      sessionMetadata.guest4Name = truncateMeta(additionalGuests[2]?.name, 120);
      sessionMetadata.guest4Email = truncateMeta(additionalGuests[2]?.email, 200);
      sessionMetadata.guest4Phone = truncateMeta(additionalGuests[2]?.phone, 40);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: isValidEmail(email) ? email : undefined,
      line_items: lineItems,
      metadata: sessionMetadata,
      success_url: `${origin}${event.href}?registered=paid&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${event.href}?canceled=true`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Event checkout error:", error);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
