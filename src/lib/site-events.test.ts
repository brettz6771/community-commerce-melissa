import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EVENT_REGISTRATION_CSV_HEADERS,
  OKTOBERFEST_PRICE_CENTS,
  TENT_OR_TREAT_PROMO_CODE,
  TENT_SPACE_OPTIONS,
  allowedPathsForEvent,
  calculateEventRegistrationsSummary,
  chicagoCalendarDate,
  eventCheckinRosterCsvRows,
  eventCheckoutAmountCents,
  eventConfirmationCopy,
  eventRegistrationCsvRows,
  eventSignupKind,
  formatEventDateLabel,
  getNextUpcomingEvents,
  getSiteEvent,
  getUpcomingEvents,
  resolveSiteEventForItem,
  tentPromoCodeMatches,
  tentSpaceChargeLabel,
  isPaidEventPath,
  isPastEvent,
  maxPartySize,
  partySizeOptions,
  siteEventsAsItems,
  validateEventRegistrationInput,
} from "./site-events.ts";

describe("site events catalog", () => {
  it("lists Lunch & Learn, Oktoberfest, and Tent or Treat with in-house registration links", () => {
    const items = siteEventsAsItems();
    assert.equal(items.length, 3);
    assert.equal(getSiteEvent("lunch-and-learn")?.title, "Lunch & Learn: Building a Stronger Community");
    assert.equal(getSiteEvent("oktoberfest")?.title, "Oktoberfest Networking Night");
    assert.equal(getSiteEvent("tent-or-treat")?.title, "Community Tent-or-Treat");
    assert.equal(getSiteEvent("lunch-and-learn")?.href, "/events/lunch-and-learn");
    assert.equal(items.find((item) => item.id === "evt-oktoberfest")?.registerHref, "/events/oktoberfest");
    assert.equal(items.find((item) => item.id === "evt-tent-or-treat")?.registerHref, "/events/tent-or-treat");
  });

  it("makes Oktoberfest free for members and $20 for guests", () => {
    assert.deepEqual(allowedPathsForEvent("oktoberfest"), ["member", "guest"]);
    assert.equal(isPaidEventPath("oktoberfest", "member"), false);
    assert.equal(isPaidEventPath("oktoberfest", "guest"), true);
    assert.equal(eventCheckoutAmountCents("oktoberfest", "member"), 0);
    assert.equal(eventCheckoutAmountCents("oktoberfest", "guest"), OKTOBERFEST_PRICE_CENTS);
    assert.equal(eventCheckoutAmountCents("oktoberfest", "guest", 3), OKTOBERFEST_PRICE_CENTS * 3);
    assert.equal(OKTOBERFEST_PRICE_CENTS, 2000);
    assert.deepEqual(partySizeOptions("oktoberfest", "member"), [1, 2]);
    assert.deepEqual(partySizeOptions("oktoberfest", "guest"), [1, 2, 3, 4]);
    assert.equal(maxPartySize("lunch-and-learn", "attendee"), 4);
  });

  it("makes Tent or Treat business tent spaces purchaseable per flyer pricing", () => {
    assert.deepEqual(allowedPathsForEvent("tent-or-treat"), ["attendee", "sponsor"]);
    assert.equal(isPaidEventPath("tent-or-treat", "attendee"), false);
    assert.equal(isPaidEventPath("tent-or-treat", "sponsor"), true);
    // Standard space: $150
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor"), 15000);
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "standard"), 15000);
    assert.equal(TENT_SPACE_OPTIONS.standard.priceCents, 15000);
    assert.equal(TENT_SPACE_OPTIONS.standard.priceLabel, "$150");
    // Larger space: $250
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "larger"), 25000);
    assert.equal(TENT_SPACE_OPTIONS.larger.priceCents, 25000);
    assert.equal(TENT_SPACE_OPTIONS.larger.priceLabel, "$250");
    // Food vendor / truck: $250
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "food-vendor"), 25000);
    assert.equal(TENT_SPACE_OPTIONS["food-vendor"].priceCents, 25000);
    assert.equal(TENT_SPACE_OPTIONS["food-vendor"].priceLabel, "$250");
    // Confirmation copy mentions setup time and location
    assert.match(eventConfirmationCopy("tent-or-treat", "sponsor"), /tent space registration/i);
    assert.match(eventConfirmationCopy("tent-or-treat", "sponsor"), /12:30 PM to 2:00 PM/i);
  });

  it("charges $50 and $75 only when CCMTOT26 matches, and keeps flyer prices otherwise", () => {
    assert.equal(TENT_OR_TREAT_PROMO_CODE, "CCMTOT26");
    assert.equal(tentPromoCodeMatches("CCMTOT26"), true);
    assert.equal(tentPromoCodeMatches("  ccmtot26 "), true);
    assert.equal(tentPromoCodeMatches(""), false);
    assert.equal(tentPromoCodeMatches("CCMTOT27"), false);
    assert.equal(tentPromoCodeMatches("CCMTOT26extra"), false);

    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "standard", ""), 15000);
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "standard", "NOPE"), 15000);
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "larger", "CCMTOT27"), 25000);
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "food-vendor"), 25000);

    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "standard", "CCMTOT26"), 5000);
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "larger", "ccmtot26"), 7500);
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor", 1, "food-vendor", " CCMTOT26 "), 7500);

    assert.equal(tentSpaceChargeLabel("standard", ""), "$150");
    assert.equal(tentSpaceChargeLabel("larger", "wrong"), "$250");
    assert.equal(tentSpaceChargeLabel("food-vendor", "wrong"), "$250");
    assert.equal(tentSpaceChargeLabel("standard", "CCMTOT26"), "$50");
    assert.equal(tentSpaceChargeLabel("larger", "CCMTOT26"), "$75");
    assert.equal(tentSpaceChargeLabel("food-vendor", "CCMTOT26"), "$75");
    assert.equal(eventCheckoutAmountCents("oktoberfest", "guest", 1, undefined, "CCMTOT26"), OKTOBERFEST_PRICE_CENTS);

    assert.equal(TENT_SPACE_OPTIONS.standard.priceLabel, "$150");
    assert.equal(TENT_SPACE_OPTIONS.larger.priceLabel, "$250");
    assert.equal(TENT_SPACE_OPTIONS["food-vendor"].priceLabel, "$250");
  });

  it("moves events to Past the Chicago calendar day after they end", () => {
    const event = { date: "2026-09-14" };
    assert.equal(isPastEvent(event, new Date("2026-09-14T22:00:00-05:00")), false);
    assert.equal(isPastEvent(event, new Date("2026-09-15T00:30:00-05:00")), true);
    assert.equal(isPastEvent({ date: "2026-09-21" }, new Date("2026-09-21T18:00:00-05:00")), false);
    assert.match(chicagoCalendarDate(new Date("2026-09-21T10:00:00-05:00")), /^\d{4}-\d{2}-\d{2}$/);
  });

  it("validates registration payloads and requires a business name on the tent interest path", () => {
    const guest = validateEventRegistrationInput({
      eventId: "oktoberfest",
      path: "guest",
      name: "Jordan Hale",
      email: "jordan@example.com",
    });
    assert.equal(guest.ok, true);

    const plusRejected = validateEventRegistrationInput({
      eventId: "lunch-and-learn",
      path: "attendee",
      name: "Jordan Hale",
      email: "jordan@example.com",
      guests: "4+",
    });
    assert.equal(plusRejected.ok, false);

    const memberTooMany = validateEventRegistrationInput({
      eventId: "oktoberfest",
      path: "member",
      name: "Jordan Hale",
      email: "jordan@example.com",
      guests: "3",
    });
    assert.equal(memberTooMany.ok, false);

    const missingCompanion = validateEventRegistrationInput({
      eventId: "oktoberfest",
      path: "guest",
      name: "Jordan Hale",
      email: "jordan@example.com",
      guests: "2",
    });
    assert.equal(missingCompanion.ok, false);

    const paidParty = validateEventRegistrationInput({
      eventId: "oktoberfest",
      path: "guest",
      name: "Jordan Hale",
      email: "jordan@example.com",
      guests: "2",
      additionalGuests: [{ name: "Sam Hale", email: "sam@example.com", phone: "555-0100" }],
    });
    assert.equal(paidParty.ok, true);
    if (paidParty.ok) {
      assert.equal(paidParty.value.guests, "2");
      assert.equal(paidParty.value.additionalGuests[0].email, "sam@example.com");
    }

    const sponsorMissing = validateEventRegistrationInput({
      eventId: "tent-or-treat",
      path: "sponsor",
      name: "Jordan Hale",
      email: "jordan@example.com",
    });
    assert.equal(sponsorMissing.ok, false);

    const sponsor = validateEventRegistrationInput({
      eventId: "tent-or-treat",
      path: "sponsor",
      name: "Jordan Hale",
      email: "jordan@example.com",
      company: "Melissa Demo Partners",
    });
    assert.equal(sponsor.ok, true);
    if (sponsor.ok) assert.equal(sponsor.value.path, "sponsor");
  });

  it("keeps Lunch & Learn free and marks tent business forms as interest", () => {
    assert.deepEqual(allowedPathsForEvent("lunch-and-learn"), ["attendee"]);
    assert.equal(isPaidEventPath("lunch-and-learn", "attendee"), false);
    assert.equal(eventSignupKind("sponsor"), "business_interest");
    assert.equal(eventSignupKind("attendee"), "attendance");
    assert.match(eventConfirmationCopy("lunch-and-learn", "attendee"), /complimentary/i);
    const csv = eventRegistrationCsvRows([
      {
        id: 1,
        eventId: "oktoberfest",
        eventTitle: "Oktoberfest Networking Night",
        path: "guest",
        kind: "attendance",
        name: "Guest Tester",
        email: "guest@example.com",
        phone: "",
        company: "",
        guests: "1",
        additionalGuests: [],
        notes: "",
        membershipStatus: "non_member",
        pricing: "paid",
        amountCents: 2000,
        paymentStatus: "paid",
        stripeSessionId: "cs_test",
        createdAt: "2026-09-21T12:00:00.000Z",
      },
    ]);
    assert.equal(EVENT_REGISTRATION_CSV_HEADERS.includes("Stripe session"), true);
    assert.equal(csv[0][10], "20.00");
  });

  it("calculates live guest counts and creates individual check-in roster rows", () => {
    const sampleRows = [
      {
        id: 1,
        eventId: "oktoberfest",
        eventTitle: "Oktoberfest Networking Night",
        path: "member",
        kind: "attendance" as const,
        name: "Alice Member",
        email: "alice@example.com",
        phone: "555-1111",
        company: "Alice Corp",
        guests: "2",
        additionalGuests: [{ name: "Bob Guest", email: "bob@example.com", phone: "555-2222" }],
        notes: "Excited to come",
        membershipStatus: "member" as const,
        pricing: "free" as const,
        amountCents: 0,
        paymentStatus: "complimentary" as const,
        stripeSessionId: "",
        createdAt: "2026-10-01T12:00:00.000Z",
      },
      {
        id: 2,
        eventId: "oktoberfest",
        eventTitle: "Oktoberfest Networking Night",
        path: "guest",
        kind: "attendance" as const,
        name: "Charlie Nonmember",
        email: "charlie@example.com",
        phone: "555-3333",
        company: "Charlie LLC",
        guests: "3",
        additionalGuests: [
          { name: "Dave Guest", email: "dave@example.com", phone: "" },
          { name: "Eve Guest", email: "eve@example.com", phone: "" },
        ],
        notes: "",
        membershipStatus: "non_member" as const,
        pricing: "paid" as const,
        amountCents: 6000,
        paymentStatus: "paid" as const,
        stripeSessionId: "cs_123",
        createdAt: "2026-10-02T14:00:00.000Z",
      },
      {
        id: 3,
        eventId: "tent-or-treat",
        eventTitle: "Community Tent-or-Treat",
        path: "sponsor",
        kind: "business_interest" as const,
        name: "Fiona Vendor",
        email: "fiona@example.com",
        phone: "555-4444",
        company: "Fiona Treats",
        guests: "1",
        additionalGuests: [],
        notes: "Want a double tent",
        membershipStatus: "non_member" as const,
        pricing: "free" as const,
        amountCents: 0,
        paymentStatus: "complimentary" as const,
        stripeSessionId: "",
        createdAt: "2026-10-03T09:00:00.000Z",
      },
    ];

    const stats = calculateEventRegistrationsSummary(sampleRows);
    assert.equal(stats.totalSignups, 3);
    // 2 (Alice party) + 3 (Charlie party) + 1 (Fiona) = 6 total headcount
    assert.equal(stats.totalGuests, 6);
    assert.equal(stats.memberSignups, 1);
    assert.equal(stats.memberGuests, 2);
    assert.equal(stats.nonMemberSignups, 2);
    assert.equal(stats.nonMemberGuests, 4);
    assert.equal(stats.paidSignups, 1);
    assert.equal(stats.paidGuests, 3);
    assert.equal(stats.businessInterestSignups, 1);
    assert.equal(stats.totalAmountCents, 6000);

    const roster = eventCheckinRosterCsvRows(sampleRows);
    // Row 1 primary + 1 companion + Row 2 primary + 2 companions + Row 3 primary = 6 rows
    assert.equal(roster.length, 6);
    assert.equal(roster[0][2], "Alice Member");
    assert.equal(roster[0][5], "Primary Registrant");
    assert.equal(roster[1][2], "Bob Guest");
    assert.equal(roster[1][5], "Companion (Guest 2)");
    assert.equal(roster[2][2], "Charlie Nonmember");
    assert.equal(roster[3][2], "Dave Guest");
    assert.equal(roster[4][2], "Eve Guest");
    assert.equal(roster[5][2], "Fiona Vendor");
  });

  it("filters out past events and returns at most the next 3 upcoming events chronologically", () => {
    const items = siteEventsAsItems();
    // On Oct 20, 2026, Oct 12 Lunch & Learn is past; Oct 26 Oktoberfest and Oct 31 Tent-or-Treat remain
    const oct20 = new Date("2026-10-20T12:00:00-05:00");
    const nextOnOct20 = getNextUpcomingEvents(items, 3, oct20);
    assert.deepEqual(
      nextOnOct20.map((e) => e.id),
      ["evt-oktoberfest", "evt-tent-or-treat"],
    );

    // When a 3rd and 4th upcoming event exist, only the next 3 in chronological order are returned
    const withMore = [
      ...items,
      { ...items[0], id: "evt-dec", date: "2026-12-10", title: "December Mixer" },
      { ...items[0], id: "evt-nov", date: "2026-11-15", title: "November Mixer" },
    ];
    const nextThree = getNextUpcomingEvents(withMore, 3, oct20);
    assert.deepEqual(
      nextThree.map((e) => e.id),
      ["evt-oktoberfest", "evt-tent-or-treat", "evt-nov"],
    );
    assert.equal(getUpcomingEvents(withMore, oct20).length, 4);
    assert.equal(resolveSiteEventForItem(nextOnOct20[0])?.id, "oktoberfest");
    assert.equal(formatEventDateLabel("2026-10-26"), "Monday, October 26, 2026");
  });
});

