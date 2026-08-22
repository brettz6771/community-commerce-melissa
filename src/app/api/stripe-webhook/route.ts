import { NextResponse } from "next/server";
import Stripe from "stripe";
import { saveContactToDb } from "@/lib/db";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia" as any,
  });

  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // If webhook secret is not set, parse body directly (development / testing)
      event = JSON.parse(rawBody);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        console.log("Stripe Checkout Completed:", {
          id: session.id,
          customerEmail: session.customer_email || metadata.email,
          amount: session.amount_total,
          tier: metadata.tier,
        });

        // Save to database
        if (session.customer_email || metadata.email) {
          await saveContactToDb({
            email: (session.customer_email || metadata.email) as string,
            formType: "Paid Membership (Stripe)",
            source: "Stripe Checkout",
            details: {
              "Payment Status": "Paid",
              "Stripe Session ID": session.id,
              "Amount Paid": `$${((session.amount_total || 0) / 100).toFixed(2)}`,
              "Membership Tier": metadata.tier || "N/A",
              "Business Name": metadata.businessName || "N/A",
              "Contact Name": metadata.contactName || "N/A",
              "Phone": metadata.phone || "N/A",
              "Category": metadata.category || "N/A",
              "Website": metadata.website || "N/A",
              "Notes": metadata.notes || "None",
            },
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("Stripe Charge Refunded:", {
          id: charge.id,
          customerEmail: charge.billing_details?.email,
          amountRefunded: charge.amount_refunded,
        });

        if (charge.billing_details?.email) {
          await saveContactToDb({
            email: charge.billing_details.email,
            formType: "Membership Refund (Stripe)",
            source: "Stripe Refund",
            details: {
              "Payment Status": "Refunded",
              "Charge ID": charge.id,
              "Amount Refunded": `$${((charge.amount_refunded || 0) / 100).toFixed(2)}`,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Stripe Subscription Canceled:", subscription.id);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error processing Stripe webhook:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
