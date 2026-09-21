export const OKTOBERFEST_PRICE_CENTS = 2000;
export const OKTOBERFEST_PRICE_LABEL = "$20";

export type SiteEventId = "oktoberfest" | "tent-or-treat" | "lunch-and-learn";
export type EventRegistrationPath = "member" | "guest" | "attendee" | "sponsor";
export type EventSignupKind = "attendance" | "business_interest";
export type EventMembershipStatus = "member" | "non_member";
export type EventPricing = "free" | "paid";
export type EventPaymentStatus = "complimentary" | "paid" | "interest";

export type SiteEvent = {
  id: SiteEventId;
  slug: SiteEventId;
  title: string;
  kicker: string;
  date: string;
  dateLabel: string;
  month: string;
  day: string;
  time: string;
  location: string;
  address?: string;
  category: string;
  description: string;
  image: string;
  businessImage?: string;
  isFeatured: boolean;
  href: string;
};

export function resolveOktoberfestImage(): string {
  return "/events/oktoberfest-networking-night.png";
}

export function resolveTentOrTreatImage(): string {
  return "/events/community-tent-or-treat-attendees.png";
}

export function resolveTentOrTreatBusinessImage(): string {
  return "/events/community-tent-or-treat.png";
}

export function resolveLunchAndLearnImage(): string {
  return "/events/lunch-and-learn-10-12-26.png";
}

export const SITE_EVENTS: SiteEvent[] = [
  {
    id: "lunch-and-learn",
    slug: "lunch-and-learn",
    title: "Lunch & Learn: Building a Stronger Community",
    kicker: "Lunch and Learn",
    date: "2026-10-12",
    dateLabel: "Monday, October 12, 2026",
    month: "OCT",
    day: "12",
    time: "11:00 AM - 12:30 PM",
    location: "First United Bank",
    address: "1700 Redbud Blvd. Suite 130, McKinney, TX 75069",
    category: "Lunch and Learn",
    description: "Discover CCM, connect with local owners, and get involved. Free lunch for attendees, thanks to First United Bank.",
    image: resolveLunchAndLearnImage(),
    isFeatured: true,
    href: "/events/lunch-and-learn",
  },
  {
    id: "oktoberfest",
    slug: "oktoberfest",
    title: "Oktoberfest Networking Night",
    kicker: "Networking mixer",
    date: "2026-10-26",
    dateLabel: "Monday, October 26, 2026",
    month: "OCT",
    day: "26",
    time: "6:00 PM - 8:00 PM",
    location: "Texas Republic Bank",
    address: "2220 Sam Rayburn Hwy Suite 100, Melissa, TX 75454",
    category: "Monthly Networking Mixers",
    description:
      "Networking night with complimentary appetizers, beer, and wine. Partner: Three Nations Brewing Co.",
    image: resolveOktoberfestImage(),
    isFeatured: true,
    href: "/events/oktoberfest",
  },
  {
    id: "tent-or-treat",
    slug: "tent-or-treat",
    title: "Community Tent-or-Treat",
    kicker: "Community event",
    date: "2026-10-31",
    dateLabel: "Saturday, October 31, 2026",
    month: "OCT",
    day: "31",
    time: "2:00 PM - 5:00 PM",
    location: "Melissa Lake Park",
    address: "4101 Liberty Way, Melissa, TX 75454",
    category: "Community Events",
    description:
      "A free family evening at Melissa Lake Park. Register to attend, or tell us you want a business tent.",
    image: resolveTentOrTreatImage(),
    businessImage: resolveTentOrTreatBusinessImage(),
    isFeatured: true,
    href: "/events/tent-or-treat",
  },
];

const CHICAGO_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function chicagoCalendarDate(now = new Date()): string {
  return CHICAGO_DATE.format(now);
}

export function eventEndDate(event: { date: string; endDate?: string }): string {
  return event.endDate || event.date;
}

/** True the calendar day after the event ends, using America/Chicago. */
export function isPastEvent(event: { date: string; endDate?: string; isPast?: boolean }, now = new Date()): boolean {
  return eventEndDate(event) < chicagoCalendarDate(now);
}

export function getSiteEvent(slug: string | undefined | null): SiteEvent | null {
  return SITE_EVENTS.find((event) => event.slug === slug) || null;
}

export function siteEventsAsItems() {
  return SITE_EVENTS.map((event) => ({
    id: `evt-${event.id}`,
    title: event.title,
    date: event.date,
    month: event.month,
    day: event.day,
    time: event.time,
    location: event.location,
    address: event.address,
    category: event.category,
    description: event.description,
    image: event.image,
    isFeatured: event.isFeatured,
    registerHref: event.href,
  }));
}

export function allowedPathsForEvent(eventId: SiteEventId): EventRegistrationPath[] {
  if (eventId === "oktoberfest") return ["member", "guest"];
  if (eventId === "tent-or-treat") return ["attendee", "sponsor"];
  return ["attendee"];
}

export function eventSignupKind(path: EventRegistrationPath): EventSignupKind {
  return path === "sponsor" ? "business_interest" : "attendance";
}

export function eventMembershipStatus(path: EventRegistrationPath, emailIsMember = false): EventMembershipStatus {
  if (path === "member" || emailIsMember) return "member";
  return "non_member";
}

export function eventPaymentStatus(eventId: SiteEventId, path: EventRegistrationPath): EventPaymentStatus {
  if (path === "sponsor") return "interest";
  if (isPaidEventPath(eventId, path)) return "paid";
  return "complimentary";
}

export function eventPricing(eventId: SiteEventId, path: EventRegistrationPath): EventPricing {
  return isPaidEventPath(eventId, path) ? "paid" : "free";
}

export function isPaidEventPath(eventId: SiteEventId, path: EventRegistrationPath): boolean {
  return eventId === "oktoberfest" && path === "guest";
}

export function eventCheckoutAmountCents(eventId: SiteEventId, path: EventRegistrationPath): number {
  return isPaidEventPath(eventId, path) ? OKTOBERFEST_PRICE_CENTS : 0;
}

export function validateEventRegistrationInput(input: unknown): {
  ok: true;
  value: {
    eventId: SiteEventId;
    path: EventRegistrationPath;
    name: string;
    email: string;
    phone: string;
    company: string;
    guests: string;
    notes: string;
  };
} | { ok: false; error: string } {
  const body = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const event = getSiteEvent(String(body.eventId || body.slug || ""));
  if (!event) return { ok: false, error: "Choose a current Community Commerce event." };

  const path = String(body.path || "").trim() as EventRegistrationPath;
  if (!allowedPathsForEvent(event.id).includes(path)) {
    return { ok: false, error: "That registration option is not available for this event." };
  }

  const name = String(body.name || body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const company = String(body.company || body.businessName || "").trim();
  const guests = String(body.guests || "1").trim() || "1";
  const notes = String(body.notes || body.message || "").trim().slice(0, 1000);

  if (!name) return { ok: false, error: "Enter your name." };
  if (name.length > 120) return { ok: false, error: "Name is too long." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (path === "sponsor" && !company) {
    return { ok: false, error: "Enter the business name for the tent or sponsorship inquiry." };
  }

  return {
    ok: true,
    value: {
      eventId: event.id,
      path,
      name,
      email,
      phone,
      company,
      guests,
      notes,
    },
  };
}

export function eventRegistrationFormType(eventId: SiteEventId, path: EventRegistrationPath): string {
  if (eventId === "oktoberfest") {
    return path === "member" ? "Oktoberfest Registration (Member)" : "Oktoberfest Registration (Guest)";
  }
  if (eventId === "lunch-and-learn") {
    return "Lunch & Learn Registration";
  }
  return path === "sponsor"
    ? "Tent or Treat Business Tent Interest"
    : "Tent or Treat Attendance";
}

export function eventConfirmationCopy(eventId: SiteEventId, path: EventRegistrationPath): string {
  if (eventId === "oktoberfest") {
    return path === "member"
      ? "You're registered — member admission is complimentary."
      : "You're registered. Thank you for supporting Community Commerce Melissa.";
  }
  if (eventId === "lunch-and-learn") {
    return "You're registered. See you at Lunch & Learn — lunch is complimentary.";
  }
  if (path === "sponsor") {
    return "Thanks — a team member will contact you about tent or sponsorship details. No payment is collected here.";
  }
  return "You're registered. Enjoy the afternoon at Melissa Lake Park.";
}

export type EventRegistrationRecord = {
  id: number;
  eventId: string;
  eventTitle: string;
  path: EventRegistrationPath | string;
  kind: EventSignupKind;
  name: string;
  email: string;
  phone: string;
  company: string;
  guests: string;
  notes: string;
  membershipStatus: EventMembershipStatus;
  pricing: EventPricing;
  amountCents: number;
  paymentStatus: EventPaymentStatus;
  stripeSessionId: string;
  createdAt: string;
};

export const EVENT_REGISTRATION_CSV_HEADERS = [
  "Event",
  "Kind",
  "Name",
  "Email",
  "Phone",
  "Company",
  "Guests",
  "Member status",
  "Pricing",
  "Amount",
  "Payment status",
  "Stripe session",
  "Registered at",
  "Notes",
];

export function eventRegistrationCsvRows(rows: EventRegistrationRecord[]): Array<Array<unknown>> {
  return rows.map((row) => [
    row.eventTitle || row.eventId,
    row.kind,
    row.name,
    row.email,
    row.phone,
    row.company,
    row.guests,
    row.membershipStatus,
    row.pricing,
    (row.amountCents / 100).toFixed(2),
    row.paymentStatus,
    row.stripeSessionId,
    row.createdAt,
    row.notes,
  ]);
}
