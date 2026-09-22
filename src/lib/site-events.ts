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
  return "/events/oktoberfest-networking-night.jpg";
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

export type EventPartyGuest = {
  name: string;
  email: string;
  phone: string;
};

export function maxPartySize(eventId: SiteEventId, path: EventRegistrationPath): number {
  if (path === "sponsor") return 1;
  if (eventId === "oktoberfest" && path === "member") return 2;
  return 4;
}

export function partySizeOptions(eventId: SiteEventId, path: EventRegistrationPath): number[] {
  return Array.from({ length: maxPartySize(eventId, path) }, (_, index) => index + 1);
}

export function parsePartySize(raw: unknown): number | null {
  const text = String(raw ?? "").trim();
  if (!/^[1-4]$/.test(text)) return null;
  return Number(text);
}

export function eventCheckoutAmountCents(
  eventId: SiteEventId,
  path: EventRegistrationPath,
  partySize = 1,
): number {
  if (!isPaidEventPath(eventId, path)) return 0;
  const count = Math.min(4, Math.max(1, Math.round(Number(partySize) || 1)));
  return OKTOBERFEST_PRICE_CENTS * count;
}

export function guestTicketPriceLabel(partySize = 1): string {
  return `$${eventCheckoutAmountCents("oktoberfest", "guest", partySize) / 100}`;
}

export function emptyPartyGuest(): EventPartyGuest {
  return { name: "", email: "", phone: "" };
}

export function resizeAdditionalGuests(
  current: EventPartyGuest[] | undefined,
  partySize: number,
): EventPartyGuest[] {
  const needed = Math.max(0, partySize - 1);
  const existing = Array.isArray(current) ? current : [];
  return Array.from({ length: needed }, (_, index) => existing[index] || emptyPartyGuest());
}

export function parseAdditionalGuests(
  raw: unknown,
  expectedCount: number,
): { ok: true; value: EventPartyGuest[] } | { ok: false; error: string } {
  if (expectedCount <= 0) return { ok: true, value: [] };

  const list = Array.isArray(raw) ? raw : [];
  if (list.length < expectedCount) {
    return { ok: false, error: "Enter name and email for every guest coming with you." };
  }

  const guests: EventPartyGuest[] = [];
  for (let index = 0; index < expectedCount; index += 1) {
    const item = list[index] && typeof list[index] === "object"
      ? (list[index] as Record<string, unknown>)
      : {};
    const name = String(item.name || "").trim();
    const email = String(item.email || "").trim().toLowerCase();
    const phone = String(item.phone || "").trim().slice(0, 40);

    if (!name) return { ok: false, error: `Enter a name for guest ${index + 2}.` };
    if (name.length > 120) return { ok: false, error: "A guest name is too long." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return { ok: false, error: `Enter a valid email for guest ${index + 2}.` };
    }

    guests.push({ name, email, phone });
  }

  return { ok: true, value: guests };
}

export function formatAdditionalGuests(guests: EventPartyGuest[]): string {
  return guests
    .map((guest, index) => {
      const phone = guest.phone ? ` · ${guest.phone}` : "";
      return `Guest ${index + 2}: ${guest.name} <${guest.email}>${phone}`;
    })
    .join("; ");
}

export function additionalGuestsFromMetadata(
  metadata: Record<string, string | undefined | null>,
): EventPartyGuest[] {
  const guests: EventPartyGuest[] = [];
  for (let number = 2; number <= 4; number += 1) {
    const name = String(metadata[`guest${number}Name`] || "").trim();
    const email = String(metadata[`guest${number}Email`] || "").trim().toLowerCase();
    const phone = String(metadata[`guest${number}Phone`] || "").trim();
    if (!name && !email) continue;
    guests.push({ name, email, phone });
  }
  return guests;
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
    additionalGuests: EventPartyGuest[];
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
  const partySize = parsePartySize(body.guests ?? "1");
  if (partySize == null) {
    return { ok: false, error: "Choose 1 to 4 guests, including yourself." };
  }
  if (partySize > maxPartySize(event.id, path)) {
    return {
      ok: false,
      error:
        path === "member"
          ? "Members can register themselves plus one guest."
          : "You can register up to 4 guests, including yourself.",
    };
  }

  const additional = parseAdditionalGuests(body.additionalGuests, path === "sponsor" ? 0 : partySize - 1);
  if (!additional.ok) return additional;

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
      guests: String(partySize),
      additionalGuests: additional.value,
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
  additionalGuests: EventPartyGuest[];
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
  "Additional guests",
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
    formatAdditionalGuests(row.additionalGuests || []),
    row.membershipStatus,
    row.pricing,
    (row.amountCents / 100).toFixed(2),
    row.paymentStatus,
    row.stripeSessionId,
    row.createdAt,
    row.notes,
  ]);
}
