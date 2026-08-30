import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  mapNewsletterRow,
  mergeNewsletterRows,
  NEWSLETTER_CSV_HEADERS,
  newsletterSubscriberCsvRows,
} from "./newsletter.ts";
import { toCsv } from "./csv.ts";

describe("mapNewsletterRow", () => {
  it("pulls company and names from details when columns are empty", () => {
    const mapped = mapNewsletterRow({
      email: "  Jane@Example.com ",
      firstName: null,
      lastName: "N/A",
      source: "Footer Subscribe",
      createdAt: "2026-08-30T18:00:00.000Z",
      details: {
        "First Name": "Jane",
        "Last Name": "Doe",
        "Business Name": "Melissa Family Dental",
      },
    });

    assert.ok(mapped);
    assert.equal(mapped.email, "jane@example.com");
    assert.equal(mapped.firstName, "Jane");
    assert.equal(mapped.lastName, "Doe");
    assert.equal(mapped.company, "Melissa Family Dental");
    assert.equal(mapped.source, "Footer Subscribe");
    assert.match(mapped.signedUpAt, /2026/);
  });

  it("drops rows without an email and treats N/A company as empty", () => {
    assert.equal(mapNewsletterRow({ email: "", details: { "Business Name": "N/A" } }), null);
    const mapped = mapNewsletterRow({
      email: "a@b.com",
      details: { "Business Name": "N/A" },
    });
    assert.equal(mapped?.company, "");
  });
});

describe("mergeNewsletterRows", () => {
  it("dedupes by email, keeps the newest row, and backfills missing fields", () => {
    const merged = mergeNewsletterRows([
      {
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "",
        source: "Newsletter Subscription",
        createdAt: "2026-08-30T12:00:00.000Z",
        details: { "Business Name": "Acme" },
      },
      {
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Doe",
        source: "Footer Subscribe",
        createdAt: "2026-07-01T12:00:00.000Z",
        details: {},
      },
    ]);

    assert.equal(merged.length, 1);
    assert.equal(merged[0].lastName, "Doe");
    assert.equal(merged[0].company, "Acme");
    assert.equal(merged[0].signupCount, 2);
    assert.equal(merged[0].source, "Newsletter Subscription");
  });
});

describe("newsletterSubscriberCsvRows", () => {
  it("writes the export headers and subscriber fields", () => {
    const csv = toCsv(
      NEWSLETTER_CSV_HEADERS,
      newsletterSubscriberCsvRows([
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          company: "Acme, Inc.",
          source: "Newsletter Subscription",
          signedUpAt: "8/30/2026, 1:00:00 PM",
          signupCount: 1,
        },
      ])
    );

    assert.match(csv, /First Name,Last Name,Email,Company,Source,Signed Up At,Signups/);
    assert.match(csv, /Jane,Doe,jane@example.com,"Acme, Inc.",Newsletter Subscription/);
  });
});
