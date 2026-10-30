import { NextResponse } from "next/server";
import Stripe from "stripe";
import { saveContactToDb, saveDirectoryMember, saveEventRegistration } from "@/lib/db";
import { sendEmail, sendMemberWelcomeAndAdminAlert } from "@/lib/email";
import { escapeHtml } from "@/lib/html";
import { getStripe } from "@/lib/stripe";
import { isStripeCheckoutFulfilled } from "@/lib/membership-coupons";
import {
  additionalGuestsFromMetadata,
  eventConfirmationCopy,
  eventRegistrationFormType,
  formatAdditionalGuests,
  getSiteEvent,
  type EventRegistrationPath,
} from "@/lib/site-events";

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
            const path = (metadata.path || "guest") as EventRegistrationPath;
            const eventId = siteEvent?.id || "oktoberfest";
            const name = metadata.name || "Guest";
            const isTentSpace = eventId === "tent-or-treat" && path === "sponsor";
            const additionalGuests = isTentSpace ? [] : additionalGuestsFromMetadata(metadata);
            const spaceName = metadata.spaceName || (isTentSpace ? "Tent Space" : "");
            const spacePrice = metadata.spacePrice || (session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "");
            const amountFormatted = `$${((session.amount_total || 0) / 100).toFixed(2)}`;

            await saveEventRegistration({
              eventId,
              path,
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
                additionalGuests,
                notes: metadata.notes || "",
                amount: amountFormatted,
                ...(isTentSpace ? { spaceOption: metadata.spaceOption, spaceName, spacePrice } : {}),
              },
            });

            const contactDetails: Record<string, string> = {
              Event: siteEvent?.title || metadata.eventId || "Event",
              Path: isTentSpace ? `Tent Space (${spaceName} — ${spacePrice})` : "Guest ($20 each)",
              Name: name,
              "Stripe Session ID": session.id,
              "Amount Paid": amountFormatted,
              Phone: metadata.phone || "N/A",
              Company: metadata.company || "N/A",
              Guests: metadata.guests || "1",
            };
            if (isTentSpace) {
              contactDetails["Space Type"] = spaceName;
              contactDetails["Notes / Requests"] = metadata.notes || "None";
            } else {
              contactDetails["Additional guests"] = formatAdditionalGuests(additionalGuests) || "None";
            }

            await saveContactToDb({
              email: String(targetEmail),
              formType: eventRegistrationFormType(eventId, path),
              source: "Stripe Event Checkout",
              details: contactDetails,
            });

            const confirmation = eventConfirmationCopy(eventId, path);
            const userSubject = isTentSpace
              ? `Tent Space Confirmed — ${siteEvent?.title || "Community Tent-or-Treat"}`
              : `You're registered — ${siteEvent?.title || "Community Commerce event"}`;

            const userHtml = isTentSpace
              ? `
                <p>Hello ${escapeHtml(name)},</p>
                <p>Thank you for purchasing tent space for <strong>${escapeHtml(siteEvent?.title || "Community Tent-or-Treat")}</strong>!</p>
                <p><strong>Space Reserved:</strong> ${escapeHtml(spaceName)} (${escapeHtml(spacePrice)})</p>
                <p><strong>Business:</strong> ${escapeHtml(metadata.company || name)}</p>
                <p><strong>Amount Paid:</strong> ${escapeHtml(amountFormatted)}</p>
                <p><strong>Date & Time:</strong> Saturday, October 31, 2026 · 2:00 PM – 5:00 PM</p>
                <p><strong>Business Setup:</strong> 12:30 PM – 2:00 PM</p>
                <p><strong>Location:</strong> Melissa Lake Park (4101 Liberty Way, Melissa, TX 75454)</p>
                <p>Questions? Contact Cindy Karman at <a href="mailto:cindy@barefootnaturals.com">cindy@barefootnaturals.com</a> or reply to this email.</p>
              `
              : `<p>Hello ${escapeHtml(name)},</p><p>${escapeHtml(confirmation)}</p>`;

            const staffSubject = isTentSpace
              ? `Tent Space Purchase (${spaceName}): ${metadata.company || name}`
              : `${siteEvent?.title || "Event"} guest ticket: ${name}`;

            const staffHtml = isTentSpace
              ? `<p><strong>${escapeHtml(metadata.company || name)}</strong> purchased tent space for Tent or Treat.</p>
                 <p><strong>Contact:</strong> ${escapeHtml(name)} &lt;${escapeHtml(String(targetEmail))}&gt; ${escapeHtml(metadata.phone || "")}</p>
                 <p><strong>Space:</strong> ${escapeHtml(spaceName)} (${escapeHtml(spacePrice)})</p>
                 <p><strong>Amount:</strong> ${escapeHtml(amountFormatted)}</p>
                 <p><strong>Notes:</strong> ${escapeHtml(metadata.notes || "None")}</p>`
              : `<p>${escapeHtml(name)} paid for ${escapeHtml(siteEvent?.title || "event")} guest admission.</p>`;

            await Promise.allSettled([
              sendEmail({
                to: String(targetEmail),
                replyTo: isTentSpace ? "cindy@barefootnaturals.com" : "info@communitycommercemelissa.org",
                subject: userSubject,
                html: userHtml,
              }),
              sendEmail({
                to: "info@communitycommercemelissa.org",
                replyTo: String(targetEmail),
                subject: staffSubject,
                html: staffHtml,
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
            const isNetworkPartner = metadata.networkPartner === "true";
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
                    : isNetworkPartner
                      ? "Active Subscription — 20% networking partner rate"
                      : "Active Subscription",
                "Stripe Session ID": session.id,
                "Stripe Subscription ID": session.subscription ? String(session.subscription) : "N/A",
                "Stripe Customer ID": session.customer ? String(session.customer) : "N/A",
                "Amount Paid": `$${((session.amount_total || 0) / 100).toFixed(2)}`,
                "Billing Frequency": isComplimentary
                  ? "Indefinite complimentary (cancels only if member or staff cancel)"
                  : isNonprofit || isNetworkPartner
                    ? "Annual Recurring — 20% off $390 year 1, 20% off $490 thereafter"
                    : "Annual Recurring",
                "Membership Tier": metadata.tier || "N/A",
                "Complimentary Code": isComplimentary ? metadata.promoCode || "CCMCommunityBuilder" : "N/A",
                "Coupon Code": isNonprofit
                  ? metadata.promoCode || "CCMNonprofits"
                  : isNetworkPartner
                    ? metadata.promoCode || "CCMnetworkpartner"
                    : isComplimentary
                      ? metadata.promoCode || "CCMCommunityBuilder"
                      : "N/A",
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
