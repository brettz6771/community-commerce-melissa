import { NextResponse } from "next/server";
import { isActiveDirectoryMemberEmail, saveContactToDb, saveEventRegistration } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/html";
import { resolvePortalAuth } from "@/lib/member-portal-session";
import {
  eventCheckoutAmountCents,
  eventConfirmationCopy,
  eventMembershipStatus,
  eventPaymentStatus,
  eventPricing,
  eventRegistrationFormType,
  getSiteEvent,
  isPaidEventPath,
  validateEventRegistrationInput,
} from "@/lib/site-events";

export const dynamic = "force-dynamic";

async function notifyStaffAndGuest({
  eventTitle,
  pathLabel,
  formType,
  name,
  email,
  phone,
  company,
  guests,
  additionalGuests,
  notes,
  confirmation,
}: {
  eventTitle: string;
  pathLabel: string;
  formType: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  guests: string;
  additionalGuests?: { name: string; email: string; phone: string }[];
  notes: string;
  confirmation: string;
}) {
  const details = {
    Event: eventTitle,
    Path: pathLabel,
    Name: name,
    Email: email,
    Phone: phone || "N/A",
    "Business / Company": company || "N/A",
    Guests: guests,
    "Additional guests": additionalGuests?.length
      ? additionalGuests.map((guest, index) => `Guest ${index + 2}: ${guest.name} <${guest.email}>${guest.phone ? ` ${guest.phone}` : ""}`).join("; ")
      : "None",
    Notes: notes || "None",
  };

  await saveContactToDb({
    email,
    formType,
    source: "In-house Event Registration",
    details,
  });

  const formatted = Object.entries(details)
    .map(([key, val]) => `<tr><td style="padding:6px 12px;font-weight:bold">${escapeHtml(key)}</td><td style="padding:6px 12px">${escapeHtml(val)}</td></tr>`)
    .join("");

  await Promise.allSettled([
    sendEmail({
      to: "info@communitycommercemelissa.org",
      replyTo: email,
      subject: `${formType}: ${name}`,
      html: `<h2>${escapeHtml(formType)}</h2><table>${formatted}</table>`,
    }),
    sendEmail({
      to: email,
      replyTo: "info@communitycommercemelissa.org",
      subject: `You're registered — ${eventTitle}`,
      html: `
        <p>Hello ${escapeHtml(name)},</p>
        <p>${escapeHtml(confirmation)}</p>
        <p><strong>${escapeHtml(eventTitle)}</strong></p>
        <p>Questions? Reply to this email or write info@communitycommercemelissa.org.</p>
      `,
      text: `${confirmation} ${eventTitle}`,
    }),
  ]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = validateEventRegistrationInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { eventId, path, name, email, phone, company, guests, additionalGuests, notes } = parsed.value;
    const event = getSiteEvent(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    if (isPaidEventPath(eventId, path)) {
      return NextResponse.json(
        { error: "Guest Oktoberfest tickets are $20. Continue through checkout." },
        { status: 402 }
      );
    }

    const auth = await resolvePortalAuth(request);
    const signedInMatch = auth.status === "ok" && auth.member.email === email;
    const emailIsMember = signedInMatch || (await isActiveDirectoryMemberEmail(email));

    if (eventId === "oktoberfest" && path === "member" && !emailIsMember) {
      return NextResponse.json(
        {
          error:
            "We could not match that email to an active membership. Use the guest $20 checkout, or sign in to the member portal.",
          needsPayment: true,
        },
        { status: 403 }
      );
    }

    const formType = eventRegistrationFormType(eventId, path);
    const confirmation = eventConfirmationCopy(eventId, path);
    const pathLabel =
      path === "member"
        ? "Member (complimentary)"
        : path === "guest"
          ? "Guest ($20)"
          : path === "sponsor"
            ? "Business tent / sponsorship interest"
            : "General attendance";

    await saveEventRegistration({
      eventId,
      path,
      email,
      name,
      phone,
      company,
      guests,
      notes,
      membershipStatus: eventMembershipStatus(path, emailIsMember),
      pricing: eventPricing(eventId, path),
      amountCents: eventCheckoutAmountCents(eventId, path, Number(guests)),
      paymentStatus: eventPaymentStatus(eventId, path),
      details: { phone, company, guests, additionalGuests, notes, pathLabel },
    });

    await notifyStaffAndGuest({
      eventTitle: event.title,
      pathLabel,
      formType,
      name,
      email,
      phone,
      company,
      guests,
      additionalGuests,
      notes,
      confirmation,
    });

    return NextResponse.json({
      status: "registered",
      message: confirmation,
      eventId,
      path,
    });
  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json({ error: "Could not complete registration. Try again." }, { status: 500 });
  }
}
