import { NextResponse } from "next/server";
import Stripe from "stripe";
import { saveContactToDb, saveDirectoryMember, saveEventRegistration } from "@/lib/db";
import { sendEmail, sendMemberWelcomeAndAdminAlert } from "@/lib/email";
import { escapeHtml } from "@/lib/html";
import { getStripe } from "@/lib/stripe";
import { isStripeCheckoutFulfilled } from "@/lib/membership-coupons";
import { eventConfirmationCopy, eventRegistrationFormType, getSiteEvent } from "@/lib/site-events";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is required in production.");
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
      }
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else if (!isProd) {
      // Local development only: allow unsigned payloads when no webhook secret is set
      event = JSON.parse(rawBody);
    } else {
      return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
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
        const isDonation = metadata.type === "donation";
        const isEvent = metadata.type === "event";

        console.log("Stripe Checkout Completed:", {
          id: session.id,
          type: isDonation ? "donation" : isEvent ? "event" : "subscription",
          subscriptionId: session.subscription,
          customerId: session.customer,
          customerEmail: session.customer_email || metadata.donorEmail || metadata.email,
          amount: session.amount_total,
          tier: metadata.tier,
          isTest: metadata.isTest,
          eventId: metadata.eventId,
        });

        // Save to database
        const targetEmail = session.customer_email || metadata.donorEmail || metadata.email;
        if (targetEmail) {
          if (isEvent) {
            const siteEvent = getSiteEvent(metadata.eventId);
            const path = (metadata.path || "guest") as "guest";
            const eventId = siteEvent?.id || "oktoberfest";
            const name = metadata.name || "Guest";
            await saveEventRegistration({
              eventId,
              path: metadata.path || "guest",
              email: String(targetEmail),
              name,
              phone: metadata.phone || "",
              company: metadata.company || "",
              guests: metadata.guests || "1",
              notes: metadata.notes || "",
              membershipStatus: "non_member",
              pricing: "paid",
              amountCents: session.amount_total || 0,
              paymentStatus: "paid",
              stripeSessionId: session.id,
              details: {
                phone: metadata.phone || "",
                company: metadata.company || "",
                guests: metadata.guests || "1",
                notes: metadata.notes || "",
                amount: `$${((session.amount_total || 0) / 100).toFixed(2)}`,
              },
            });
            await saveContactToDb({
              email: String(targetEmail),
              formType: eventRegistrationFormType(eventId, path),
              source: "Stripe Event Checkout",
              details: {
                Event: siteEvent?.title || metadata.eventId || "Event",
                Path: "Guest ($20)",
                Name: name,
                "Stripe Session ID": session.id,
                "Amount Paid": `$${((session.amount_total || 0) / 100).toFixed(2)}`,
                Phone: metadata.phone || "N/A",
                Company: metadata.company || "N/A",
                Guests: metadata.guests || "1",
              },
            });
            const confirmation = eventConfirmationCopy(eventId, path);
            await Promise.allSettled([
              sendEmail({
                to: String(targetEmail),
                replyTo: "info@communitycommercemelissa.org",
                subject: `You're registered — ${siteEvent?.title || "Community Commerce event"}`,
                html: `<p>Hello ${escapeHtml(name)},</p><p>${escapeHtml(confirmation)}</p>`,
              }),
              sendEmail({
                to: "info@communitycommercemelissa.org",
                replyTo: String(targetEmail),
                subject: `Oktoberfest guest ticket: ${name}`,
                html: `<p>${escapeHtml(name)} paid for Oktoberfest guest admission.</p>`,
              }),
            ]);
          } else if (isDonation) {
            await saveContactToDb({
              email: targetEmail as string,
              formType: "Donation Contribution (Stripe)",
              source: "Stripe Online Donation",
              details: {
                "Payment Status": "Paid (One-Time Contribution)",
                "Stripe Session ID": session.id,
                "Amount Donated": `$${((session.amount_total || 0) / 100).toFixed(2)}`,
                "Donor Name": metadata.donorName || "N/A",
                "Company": metadata.company || "N/A",
                "Message / Dedication": metadata.message || "None",
              },
            });
          } else {
            const isComplimentary = metadata.complimentary === "true";
            const isNonprofit = metadata.nonprofit === "true";
            const membershipFulfilled = isStripeCheckoutFulfilled(session);
            await saveContactToDb({
              email: targetEmail as string,
              formType:
                metadata.isTest === "true"
                  ? "Live Test Membership (Stripe)"
                  : isComplimentary
                    ? "Complimentary Membership (Stripe)"
                    : "Paid Membership (Stripe)",
              source: "Stripe Subscription Checkout",
              details: {
                "Payment Status": isComplimentary
                  ? "Complimentary — $0, no automatic billing"
                  : isNonprofit
                    ? "Active Subscription — 20% non-profit rate"
                    : "Active Subscription",
                "Stripe Session ID": session.id,
                "Stripe Subscription ID": session.subscription ? String(session.subscription) : "N/A",
                "Stripe Customer ID": session.customer ? String(session.customer) : "N/A",
                "Amount Paid": `$${((session.amount_total || 0) / 100).toFixed(2)}`,
                "Billing Frequency": isComplimentary
                  ? "Indefinite complimentary (cancels only if member or staff cancel)"
                  : isNonprofit
                    ? "Annual Recurring — 20% off $390 year 1, 20% off $490 thereafter"
                    : "Annual Recurring",
                "Membership Tier": metadata.tier || "N/A",
                "Complimentary Code": isComplimentary ? metadata.promoCode || "CCMCommunityBuilder" : "N/A",
                "Coupon Code": isNonprofit ? metadata.promoCode || "CCMNonprofits" : isComplimentary ? metadata.promoCode || "CCMCommunityBuilder" : "N/A",
                "Is Test Mode": metadata.isTest === "true" ? "Yes" : "No",
                "Business Name": metadata.businessName || "N/A",
                "Contact Name": metadata.contactName || "N/A",
                "Phone": metadata.phone || "N/A",
                "Category": metadata.category || "N/A",
                "City": metadata.city || "Melissa",
                "State": metadata.state || "TX",
                "Website": metadata.website || "N/A",
                "Notes": metadata.notes || "None",
              },
            });

            // Auto-add new business after paid or $0 complimentary checkout
            if (membershipFulfilled && metadata.businessName && metadata.businessName !== "N/A") {
              const shortId = session.id.slice(-6).toUpperCase();
              const memberId = `CCM-2026-${shortId}`;

              await saveDirectoryMember({
                businessName: metadata.businessName,
                category: metadata.category || "General Business",
                description: metadata.description || "",
                website: metadata.website || "",
                city: metadata.city || "Melissa",
                state: metadata.state || "TX",
                phone: metadata.phone || "",
                email: targetEmail as string,
                ownerName: metadata.contactName || "",
                tier: metadata.tier || "Community Partner",
                memberId,
                isTest: metadata.isTest === "true",
              });

              // Dispatch Member Welcome Email & Admin Notification
              await sendMemberWelcomeAndAdminAlert({
                memberEmail: targetEmail as string,
                businessName: metadata.businessName,
                ownerName: metadata.contactName || "",
                tier: metadata.tier || "Community Partner",
                memberId,
                amount: isComplimentary
                  ? "0.00 (Complimentary — CCMCommunityBuilder)"
                  : ((session.amount_total || 0) / 100).toFixed(2),
                city: metadata.city || "Melissa",
                state: metadata.state || "TX",
                phone: metadata.phone || "",
                category: metadata.category || "General Business",
                website: metadata.website || "",
                sessionId: session.id,
              }).catch((err) => console.warn("Webhook email dispatch notice:", err));
            }
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        // Ignore the very first invoice if it was already handled by checkout.session.completed
        if (invoice.billing_reason === "subscription_cycle") {
          const subscriptionId = invoice.subscription || invoice.parent?.subscription_details?.subscription || invoice.subscription_details?.subscription || "N/A";
          console.log("Stripe Recurring Subscription Payment Succeeded:", {
            invoiceId: invoice.id,
            subscriptionId: subscriptionId,
            customerEmail: invoice.customer_email,
            amountPaid: invoice.amount_paid,
          });

          if (invoice.customer_email) {
            await saveContactToDb({
              email: invoice.customer_email,
              formType: "Membership Subscription Renewal (Stripe)",
              source: "Stripe Recurring Billing",
              details: {
                "Payment Status": "Renewed",
                "Invoice ID": invoice.id,
                "Subscription ID": String(subscriptionId),
                "Amount Paid": `$${((invoice.amount_paid || 0) / 100).toFixed(2)}`,
                "Billing Reason": invoice.billing_reason,
              },
            });
          }
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
