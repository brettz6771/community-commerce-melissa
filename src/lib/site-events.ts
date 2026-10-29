export const OKTOBERFEST_PRICE_CENTS = 2000;
export const OKTOBERFEST_PRICE_LABEL = "$20";
export const CHRISTMAS_NETWORKING_PRICE_CENTS = 2000;
export const CHRISTMAS_NETWORKING_PRICE_LABEL = "$20";

export type TentSpaceOptionId = "standard" | "larger" | "food-vendor";

export type TentSpaceOption = {
  id: TentSpaceOptionId;
  name: string;
  priceCents: number;
  priceLabel: string;
  originalPriceCents: number;
  originalPriceLabel: string;
  description: string;
};

export const TENT_SPACE_OPTIONS: Record<TentSpaceOptionId, TentSpaceOption> = {
  standard: {
    id: "standard",
    name: "Standard Space (10' x 10')",
    priceCents: 5000,
    priceLabel: "$50",
    originalPriceCents: 15000,
    originalPriceLabel: "$150",
    description: "10' x 10' canopy or tent space to promote your business and hand out treats.",
  },
  larger: {
    id: "larger",
    name: "Larger Space",
    priceCents: 7500,
    priceLabel: "$75",
    originalPriceCents: 25000,
    originalPriceLabel: "$250",
    description: "Expanded footprint for larger displays, multi-canopy setups, or interactive activities.",
  },
  "food-vendor": {
    id: "food-vendor",
    name: "Food Vendor / Truck",
    priceCents: 7500,
    priceLabel: "$75",
    originalPriceCents: 25000,
    originalPriceLabel: "$250",
    description: "Dedicated parking/space for food trucks, trailers, or prepared food vendors.",
  },
};

export const DEFAULT_TENT_SPACE_OPTION: TentSpaceOptionId = "standard";

/** Entered on tent registration for complimentary ($0) Standard Space booth registration. */
export const TENT_OR_TREAT_PROMO_CODE = "CCMTENT26";

/** Entered on Oktoberfest guest registration to waive the $20 guest ticket cost. */
export const OKTOBERFEST_PROMO_CODE = "CCMOKT26";

export function oktoberfestPromoCodeMatches(raw: unknown): boolean {
  return String(raw ?? "").trim().toLowerCase() === OKTOBERFEST_PROMO_CODE.toLowerCase();
}

export function tentPromoCodeMatches(raw: unknown): boolean {
  return String(raw ?? "").trim().toLowerCase() === TENT_OR_TREAT_PROMO_CODE.toLowerCase();
}

/**
 * Deal price ($50 Standard, $75 Larger / Food Vendor), except when CCMTENT26 matches
 * on Standard Space, which makes Standard Space complimentary ($0).
 */
export function tentSpaceChargeCents(spaceOption: unknown, promoCode?: unknown): number {
  const option = getTentSpaceOption(spaceOption);
  if (option.id === "standard" && tentPromoCodeMatches(promoCode)) return 0;
  return option.priceCents;
}

export function tentSpaceChargeLabel(spaceOption: unknown, promoCode?: unknown): string {
  return `$${tentSpaceChargeCents(spaceOption, promoCode) / 100}`;
}

export function getTentSpaceOption(raw: unknown): TentSpaceOption {
  const key = String(raw ?? "").trim().toLowerCase();
  if (key === "larger" || key === "large") return TENT_SPACE_OPTIONS.larger;
  if (key === "food-vendor" || key === "food_vendor" || key === "food" || key === "truck") {
    return TENT_SPACE_OPTIONS["food-vendor"];
  }
  return TENT_SPACE_OPTIONS.standard;
}

export function tentSpacePriceLabel(spaceOption?: TentSpaceOptionId): string {
  return getTentSpaceOption(spaceOption).priceLabel;
}

export function tentSpaceOriginalPriceLabel(spaceOption?: TentSpaceOptionId): string {
  return getTentSpaceOption(spaceOption).originalPriceLabel;
}

export type SiteEventId =
  | "oktoberfest"
  | "tent-or-treat"
  | "lunch-and-learn"
  | "pack-with-purpose"
  | "christmas-networking";
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

export function resolvePackWithPurposeImage(): string {
  return "/events/ccm-luncheon-nov-16.jpg";
}

export function resolveChristmasNetworkingImage(): string {
  return "/events/christmas-networking-event.jpg";
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
    id: "pack-with-purpose",
    slug: "pack-with-purpose",
    title: "Pack with Purpose: A Give-Back Lunch & Learn",
    kicker: "Give-Back Lunch & Learn",
    date: "2026-11-16",
    dateLabel: "Monday, November 16, 2026",
    month: "NOV",
    day: "16",
    time: "11:00 AM - 1:00 PM",
    location: "First United Bank",
    address: "1700 Redbud Blvd Ste 130, McKinney, TX 75069",
    category: "Lunch and Learn",
    description:
      "Join Community Commerce Melissa and National University as we come together to assemble care packages for our deployed military members with Soldiers' Angels. Free to attend — free lunch included, gifted by Portillo's!",
    image: resolvePackWithPurposeImage(),
    isFeatured: true,
    href: "/events/pack-with-purpose",
  },
  {
    id: "christmas-networking",
    slug: "christmas-networking",
    title: "Christmas Networking Night",
    kicker: "Christmas Networking Mixer",
    date: "2026-11-30",
    dateLabel: "Monday, November 30, 2026",
    month: "NOV",
    day: "30",
    time: "6:00 PM - 8:00 PM",
    location: "3 Nations Brewery",
    address: "W. 4th St., Anna, TX 75409",
    category: "Monthly Networking Mixers",
    description:
      "The last networking event for this year — you don't want to miss it! Join us at 3 Nations Brewery for games, prizes, networking fun, and music by DJ Smiley. Food, beer, and wine included! Free for members; $20 for non-members.",
    image: resolveChristmasNetworkingImage(),
    isFeatured: true,
    href: "/events/christmas-networking",
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
  const normalized = String(slug || "").trim().toLowerCase();
  if (normalized === "ccm-luncheon-nov-16" || normalized === "luncheon-nov-16") {
    return SITE_EVENTS.find((event) => event.slug === "pack-with-purpose") || null;
  }
  if (
    normalized === "christmas-networking-night" ||
    normalized === "christmas-networking-event" ||
    normalized === "christmas"
  ) {
    return SITE_EVENTS.find((event) => event.slug === "christmas-networking") || null;
  }
  return SITE_EVENTS.find((event) => event.slug === normalized) || null;
}

export function getUpcomingEvents<T extends { date: string; endDate?: string; isPast?: boolean }>(
  events: readonly T[],
  now = new Date(),
): T[] {
  return events
    .filter((event) => !isPastEvent(event, now))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getNextUpcomingEvents<T extends { date: string; endDate?: string; isPast?: boolean }>(
  events: readonly T[],
  limit = 3,
  now = new Date(),
): T[] {
  return getUpcomingEvents(events, now).slice(0, Math.max(0, limit));
}

export function resolveSiteEventForItem(item: {
  id?: string;
  slug?: string;
  registerHref?: string;
  href?: string;
}): SiteEvent | null {
  if (item.slug) {
    const bySlug = getSiteEvent(item.slug);
    if (bySlug) return bySlug;
  }
  const href = item.registerHref || item.href || "";
  if (href.startsWith("/events/")) {
    const slug = href.slice("/events/".length).split(/[?#]/)[0];
    const byHref = getSiteEvent(slug);
    if (byHref) return byHref;
  }
  if (item.id) {
    const rawId = item.id.startsWith("evt-") ? item.id.slice(4) : item.id;
    const byId = getSiteEvent(rawId);
    if (byId) return byId;
  }
  return null;
}

const EVENT_DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function formatEventDateLabel(dateStr: string, explicitLabel?: string): string {
  if (explicitLabel && explicitLabel.trim()) return explicitLabel.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const parsed = new Date(`${dateStr}T12:00:00Z`);
    if (!Number.isNaN(parsed.getTime())) {
      return EVENT_DATE_LABEL_FORMATTER.format(parsed);
    }
  }
  return dateStr;
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
  if (eventId === "oktoberfest" || eventId === "christmas-networking") return ["member", "guest"];
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

export function eventPaymentStatus(
  eventId: SiteEventId,
  path: EventRegistrationPath,
  promoCode?: unknown,
  spaceOption?: unknown,
): EventPaymentStatus {
  if (isPaidEventPath(eventId, path, promoCode, spaceOption)) return "paid";
  if (
    eventId === "tent-or-treat" &&
    path === "sponsor" &&
    getTentSpaceOption(spaceOption).id === "standard" &&
    tentPromoCodeMatches(promoCode)
  ) {
    return "complimentary";
  }
  if (path === "sponsor") return "interest";
  return "complimentary";
}

export function eventPricing(
  eventId: SiteEventId,
  path: EventRegistrationPath,
  promoCode?: unknown,
  spaceOption?: unknown,
): EventPricing {
  return isPaidEventPath(eventId, path, promoCode, spaceOption) ? "paid" : "free";
}

export function isPaidEventPath(
  eventId: SiteEventId,
  path: EventRegistrationPath,
  promoCode?: unknown,
  spaceOption?: unknown,
): boolean {
  if (eventId === "oktoberfest" && path === "guest") {
    return !oktoberfestPromoCodeMatches(promoCode);
  }
  if (eventId === "christmas-networking" && path === "guest") {
    return true;
  }
  if (eventId === "tent-or-treat" && path === "sponsor") {
    return tentSpaceChargeCents(spaceOption, promoCode) > 0;
  }
  return false;
}

export type EventPartyGuest = {
  name: string;
  email: string;
  phone: string;
};

export function maxPartySize(eventId: SiteEventId, path: EventRegistrationPath): number {
  if (path === "sponsor") return 1;
  if ((eventId === "oktoberfest" || eventId === "christmas-networking") && path === "member") return 2;
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
  spaceOption?: TentSpaceOptionId,
  promoCode?: unknown,
): number {
  if (!isPaidEventPath(eventId, path, promoCode, spaceOption)) return 0;
  if (eventId === "tent-or-treat" && path === "sponsor") {
    return tentSpaceChargeCents(spaceOption, promoCode);
  }
  const count = Math.min(4, Math.max(1, Math.round(Number(partySize) || 1)));
  return OKTOBERFEST_PRICE_CENTS * count;
}

export function guestTicketPriceLabel(partySize = 1, promoCode?: unknown): string {
  return `$${eventCheckoutAmountCents("oktoberfest", "guest", partySize, undefined, promoCode) / 100}`;
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
    spaceOption?: TentSpaceOptionId;
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
    return { ok: false, error: "Enter the business name for your tent space." };
  }

  const spaceOption =
    event.id === "tent-or-treat" && path === "sponsor"
      ? getTentSpaceOption(body.spaceOption).id
      : undefined;

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
      spaceOption,
    },
  };
}

export function eventRegistrationFormType(
  eventId: SiteEventId,
  path: EventRegistrationPath,
  promoCode?: unknown,
  spaceOption?: unknown,
): string {
  if (eventId === "oktoberfest") {
    if (path === "member") return "Oktoberfest Registration (Member)";
    if (oktoberfestPromoCodeMatches(promoCode)) {
      return `Oktoberfest Registration (Guest — Coupon ${OKTOBERFEST_PROMO_CODE})`;
    }
    return "Oktoberfest Registration (Guest)";
  }
  if (eventId === "christmas-networking") {
    if (path === "member") return "Christmas Networking Night Registration (Member)";
    return "Christmas Networking Night Registration (Non-Member / Guest)";
  }
  if (eventId === "lunch-and-learn") {
    return "Lunch & Learn Registration";
  }
  if (eventId === "pack-with-purpose") {
    return "Pack with Purpose Lunch & Learn Registration";
  }
  if (path === "sponsor") {
    if (getTentSpaceOption(spaceOption).id === "standard" && tentPromoCodeMatches(promoCode)) {
      return `Tent or Treat Business Tent Registration (Complimentary — Code ${TENT_OR_TREAT_PROMO_CODE})`;
    }
    return "Tent or Treat Business Tent Registration";
  }
  return "Tent or Treat Attendance";
}

export function eventConfirmationCopy(eventId: SiteEventId, path: EventRegistrationPath): string {
  if (eventId === "oktoberfest") {
    return path === "member"
      ? "You're registered — member admission is complimentary."
      : "You're registered. Thank you for supporting Community Commerce Melissa.";
  }
  if (eventId === "christmas-networking") {
    return path === "member"
      ? "You're registered for Christmas Networking Night on Monday, November 30, 2026 (6:00 PM - 8:00 PM) at 3 Nations Brewery — member admission is complimentary!"
      : "You're registered for Christmas Networking Night on Monday, November 30, 2026 (6:00 PM - 8:00 PM) at 3 Nations Brewery. Thank you for supporting Community Commerce Melissa!";
  }
  if (eventId === "lunch-and-learn") {
    return "You're registered. See you at Lunch & Learn — lunch is complimentary.";
  }
  if (eventId === "pack-with-purpose") {
    return "You're registered for Pack with Purpose: A Give-Back Lunch & Learn on Monday, November 16, 2026 (11:00 AM - 1:00 PM) at First United Bank in McKinney. Free lunch is included, gifted by Portillo's!";
  }
  if (path === "sponsor") {
    return "Your tent space registration has been received. Setup is Saturday, October 31, 2026 from 12:30 PM to 2:00 PM at Melissa Lake Park.";
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

export type EventRegistrationsSummary = {
  totalSignups: number;
  totalGuests: number;
  memberSignups: number;
  memberGuests: number;
  nonMemberSignups: number;
  nonMemberGuests: number;
  paidSignups: number;
  paidGuests: number;
  complimentarySignups: number;
  complimentaryGuests: number;
  businessInterestSignups: number;
  totalAmountCents: number;
};

export function calculateEventRegistrationGuests(row: EventRegistrationRecord): number {
  const parsedGuests = parseInt(String(row.guests || "1"), 10);
  const baseCount = Number.isFinite(parsedGuests) && parsedGuests > 0 ? parsedGuests : 1;
  const companionCount = Array.isArray(row.additionalGuests) ? row.additionalGuests.length : 0;
  return Math.max(baseCount, 1 + companionCount);
}

export function calculateEventRegistrationsSummary(rows: EventRegistrationRecord[]): EventRegistrationsSummary {
  let totalGuests = 0;
  let memberSignups = 0;
  let memberGuests = 0;
  let nonMemberSignups = 0;
  let nonMemberGuests = 0;
  let paidSignups = 0;
  let paidGuests = 0;
  let complimentarySignups = 0;
  let complimentaryGuests = 0;
  let businessInterestSignups = 0;
  let totalAmountCents = 0;

  for (const row of rows) {
    const guests = calculateEventRegistrationGuests(row);
    totalGuests += guests;
    totalAmountCents += Number(row.amountCents || 0);

    if (row.kind === "business_interest") {
      businessInterestSignups += 1;
    }

    if (row.membershipStatus === "member") {
      memberSignups += 1;
      memberGuests += guests;
    } else {
      nonMemberSignups += 1;
      nonMemberGuests += guests;
    }

    if (row.paymentStatus === "paid" || row.pricing === "paid") {
      paidSignups += 1;
      paidGuests += guests;
    } else {
      complimentarySignups += 1;
      complimentaryGuests += guests;
    }
  }

  return {
    totalSignups: rows.length,
    totalGuests,
    memberSignups,
    memberGuests,
    nonMemberSignups,
    nonMemberGuests,
    paidSignups,
    paidGuests,
    complimentarySignups,
    complimentaryGuests,
    businessInterestSignups,
    totalAmountCents,
  };
}

export const EVENT_CHECKIN_ROSTER_CSV_HEADERS = [
  "Event",
  "Check-In",
  "Attendee Name",
  "Attendee Email",
  "Attendee Phone",
  "Role",
  "Party Host",
  "Company",
  "Member Status",
  "Payment Status",
  "Amount Paid",
  "Registered At",
  "Notes",
];

export function eventCheckinRosterCsvRows(rows: EventRegistrationRecord[]): Array<Array<unknown>> {
  const roster: Array<Array<unknown>> = [];
  for (const row of rows) {
    const eventName = row.eventTitle || row.eventId;
    const amountStr = (row.amountCents / 100).toFixed(2);

    // Primary attendee
    roster.push([
      eventName,
      "[ ]",
      row.name || row.email,
      row.email,
      row.phone || "",
      "Primary Registrant",
      row.name || row.email,
      row.company || "",
      row.membershipStatus === "member" ? "Member" : "Non-member",
      row.paymentStatus,
      amountStr,
      row.createdAt,
      row.notes || "",
    ]);

    // Additional guests
    if (Array.isArray(row.additionalGuests)) {
      row.additionalGuests.forEach((guest, index) => {
        roster.push([
          eventName,
          "[ ]",
          guest.name || `Guest ${index + 2}`,
          guest.email || "",
          guest.phone || "",
          `Companion (Guest ${index + 2})`,
          row.name || row.email,
          row.company || "",
          row.membershipStatus === "member" ? "Member Party" : "Non-member Party",
          row.paymentStatus,
          "Included in ticket",
          row.createdAt,
          row.notes || "",
        ]);
      });
    }
  }
  return roster;
}
