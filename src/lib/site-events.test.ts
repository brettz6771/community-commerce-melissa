import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EVENT_REGISTRATION_CSV_HEADERS,
  OKTOBERFEST_PRICE_CENTS,
  allowedPathsForEvent,
  chicagoCalendarDate,
  eventCheckoutAmountCents,
  eventConfirmationCopy,
  eventRegistrationCsvRows,
  eventSignupKind,
  getSiteEvent,
  isPaidEventPath,
  isPastEvent,
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
    assert.equal(OKTOBERFEST_PRICE_CENTS, 2000);
  });

  it("keeps Tent or Treat paths off Stripe", () => {
    assert.deepEqual(allowedPathsForEvent("tent-or-treat"), ["attendee", "sponsor"]);
    assert.equal(isPaidEventPath("tent-or-treat", "attendee"), false);
    assert.equal(isPaidEventPath("tent-or-treat", "sponsor"), false);
    assert.equal(eventCheckoutAmountCents("tent-or-treat", "sponsor"), 0);
    assert.match(eventConfirmationCopy("tent-or-treat", "sponsor"), /No payment/i);
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
    assert.equal(csv[0][9], "20.00");
  });
});
