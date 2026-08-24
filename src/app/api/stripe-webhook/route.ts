import { NextResponse } from "next/server";
import Stripe from "stripe";
import { saveContactToDb, saveDirectoryMember } from "@/lib/db";
import { sendMemberWelcomeAndAdminAlert } from "@/lib/email";

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

        // Save to database
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
            await saveContactToDb({
              email: targetEmail as string,
              formType: metadata.isTest === "true" ? "Live Test Membership (Stripe)" : "Paid Membership (Stripe)",
              source: "Stripe Subscription Checkout",
              details: {
                "Payment Status": "Active Subscription",
                "Stripe Session ID": session.id,
                "Stripe Subscription ID": session.subscription ? String(session.subscription) : "N/A",
                "Stripe Customer ID": session.customer ? String(session.customer) : "N/A",
                "Amount Paid": `$${((session.amount_total || 0) / 100).toFixed(2)}`,
                "Billing Frequency": "Annual Recurring",
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

            // Auto-add new business to Directory table
            if (metadata.businessName) {
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
              });

              // Dispatch Member Welcome Email & Admin Notification
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
