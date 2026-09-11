import { NextResponse } from "next/server";
import Stripe from "stripe";
import { saveContactToDb, saveDirectoryMember, updateDirectoryMembershipStatus } from "@/lib/db";
import { sendMemberWelcomeAndAdminAlert } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import {
  defaultMembershipExpiresAt,
  shouldRestoreAfterDispute,
  subscriptionPeriodEndUnix,
  unixSecondsToDate,
} from "@/lib/membership-listing";

function idOf(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value && "id" in value) {
    return String((value as { id?: string }).id || "");
  }
  return String(value);
}

async function contactFromDispute(
  stripe: Stripe,
  dispute: Stripe.Dispute
): Promise<{ email: string; customerId: string }> {
  let email = dispute.evidence?.customer_email_address || "";
  let customerId = "";
  let charge = dispute.charge;
  try {
    if (typeof charge === "string") {
      charge = await stripe.charges.retrieve(charge);
    }
  } catch (err) {
    console.warn("Could not retrieve disputed charge:", err);
  }
  if (charge && typeof charge !== "string") {
    email = email || charge.billing_details?.email || "";
    customerId = idOf(charge.customer);
  }
  return { email, customerId };
}

function periodEndFromSubscription(sub: Stripe.Subscription): Date {
  const unix = subscriptionPeriodEndUnix(sub);
  return unixSecondsToDate(unix) || defaultMembershipExpiresAt(new Date());
}

async function expiresAtForSubscription(stripe: Stripe, subscriptionId: string): Promise<Date> {
  if (!subscriptionId) {
    return defaultMembershipExpiresAt(new Date());
  }
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    return periodEndFromSubscription(sub);
  } catch (err) {
    console.warn("Could not retrieve Stripe subscription period end:", err);
    return defaultMembershipExpiresAt(new Date());
  }
}

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

        console.log("Stripe Checkout Completed:", {
          id: session.id,
          type: isDonation ? "donation" : "subscription",
          subscriptionId: session.subscription,
          customerId: session.customer,
          customerEmail: session.customer_email || metadata.donorEmail || metadata.email,
          amount: session.amount_total,
          tier: metadata.tier,
          isTest: metadata.isTest,
        });

        const targetEmail = session.customer_email || metadata.donorEmail || metadata.email;
        if (targetEmail) {
          if (isDonation) {
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
            const subscriptionId = idOf(session.subscription);
            const customerId = idOf(session.customer);
            const membershipExpiresAt = await expiresAtForSubscription(stripe, subscriptionId);

            await saveContactToDb({
              email: targetEmail as string,
              formType: metadata.isTest === "true" ? "Live Test Membership (Stripe)" : "Paid Membership (Stripe)",
              source: "Stripe Subscription Checkout",
              details: {
                "Payment Status": "Active Subscription",
                "Stripe Session ID": session.id,
                "Stripe Subscription ID": subscriptionId || "N/A",
                "Stripe Customer ID": customerId || "N/A",
                "Amount Paid": `$${((session.amount_total || 0) / 100).toFixed(2)}`,
                "Billing Frequency": "Annual Recurring",
                "Membership Term": "12 months from payment, auto-renews until canceled",
                "Membership Expires At": membershipExpiresAt.toISOString(),
                "Membership Tier": metadata.tier || "N/A",
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

            if (session.payment_status === "paid" && metadata.businessName && metadata.businessName !== "N/A") {
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
                isTest: metadata.isTest === "true",
                isActive: true,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId,
                membershipStartedAt: new Date(),
                membershipExpiresAt,
              });

              const shortId = session.id.slice(-6).toUpperCase();
              const memberId = `CCM-2026-${shortId}`;
              await sendMemberWelcomeAndAdminAlert({
                memberEmail: targetEmail as string,
                businessName: metadata.businessName,
                ownerName: metadata.contactName || "",
                tier: metadata.tier || "Community Partner",
                memberId,
                amount: ((session.amount_total || 0) / 100).toFixed(2),
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
        const invoice = event.data.object as Stripe.Invoice;
        const billingReason = (invoice as { billing_reason?: string }).billing_reason;
        if (billingReason === "subscription_cycle") {
          const subscriptionId =
            idOf((invoice as { subscription?: unknown }).subscription) ||
            idOf((invoice as { parent?: { subscription_details?: { subscription?: unknown } } }).parent?.subscription_details?.subscription);
          const customerEmail = invoice.customer_email || "";
          const customerId = idOf(invoice.customer);
          const membershipExpiresAt = await expiresAtForSubscription(stripe, subscriptionId);

          console.log("Stripe Recurring Subscription Payment Succeeded:", {
            invoiceId: invoice.id,
            subscriptionId,
            customerEmail,
            amountPaid: invoice.amount_paid,
          });

          if (customerEmail) {
            await saveContactToDb({
              email: customerEmail,
              formType: "Membership Subscription Renewal (Stripe)",
              source: "Stripe Recurring Billing",
              details: {
                "Payment Status": "Renewed",
                "Invoice ID": invoice.id,
                "Subscription ID": subscriptionId || "N/A",
                "Amount Paid": `$${((invoice.amount_paid || 0) / 100).toFixed(2)}`,
                "Billing Reason": billingReason,
                "Membership Expires At": membershipExpiresAt.toISOString(),
              },
            });
          }

          await updateDirectoryMembershipStatus({
            isActive: true,
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: customerId,
            email: customerEmail,
            membershipExpiresAt,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const inactiveStatuses = new Set(["canceled", "unpaid", "incomplete_expired", "paused"]);
        const isActive = !inactiveStatuses.has(subscription.status);
        const metadata = subscription.metadata || {};
        await updateDirectoryMembershipStatus({
          isActive,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: idOf(subscription.customer),
          email: metadata.email || "",
          membershipExpiresAt: isActive ? periodEndFromSubscription(subscription) : new Date(),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const metadata = subscription.metadata || {};
        console.log("Stripe Subscription Canceled:", subscription.id);
        await updateDirectoryMembershipStatus({
          isActive: false,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: idOf(subscription.customer),
          email: metadata.email || "",
          membershipExpiresAt: new Date(),
        });
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const { email, customerId } = await contactFromDispute(stripe, dispute);
        console.log("Stripe Dispute Created; temporarily suspending associated membership benefits:", dispute.id);
        await updateDirectoryMembershipStatus({
          isActive: false,
          stripeCustomerId: customerId,
          email,
        });
        break;
      }

      case "charge.dispute.closed": {
        const dispute = event.data.object as Stripe.Dispute;
        if (!shouldRestoreAfterDispute(dispute.status)) {
          break;
        }
        const { email, customerId } = await contactFromDispute(stripe, dispute);
        await updateDirectoryMembershipStatus({
          isActive: true,
          stripeCustomerId: customerId,
          email,
        });
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

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error processing Stripe webhook:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
