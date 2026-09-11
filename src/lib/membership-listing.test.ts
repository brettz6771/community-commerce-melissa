import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  defaultMembershipExpiresAt,
  isPublicDirectoryListing,
  listingStatus,
  shouldRestoreAfterDispute,
  subscriptionPeriodEndUnix,
  unixSecondsToDate,
} from "./membership-listing.ts";

describe("directory listing visibility", () => {
  it("hides inactive or expired listings and keeps unsuspended listings without an expiration date", () => {
    const now = new Date("2026-09-01T12:00:00.000Z");
    assert.equal(isPublicDirectoryListing({ isActive: true, membershipExpiresAt: null, now }), true);
    assert.equal(isPublicDirectoryListing({ isActive: false, membershipExpiresAt: null, now }), false);
    assert.equal(
      isPublicDirectoryListing({
        isActive: true,
        membershipExpiresAt: "2026-08-01T00:00:00.000Z",
        now,
      }),
      false
    );
    assert.equal(
      isPublicDirectoryListing({
        isActive: true,
        membershipExpiresAt: "2027-09-01T00:00:00.000Z",
        now,
      }),
      true
    );
    assert.equal(listingStatus({ isActive: false, now }), "suspended");
    assert.equal(
      listingStatus({ isActive: true, membershipExpiresAt: "2026-08-01T00:00:00.000Z", now }),
      "expired"
    );
  });

  it("computes a 12-month term and reads Stripe period end from subscription items", () => {
    const started = new Date("2026-09-01T00:00:00.000Z");
    const expires = defaultMembershipExpiresAt(started, 12);
    assert.equal(expires.toISOString(), "2027-09-01T00:00:00.000Z");

    assert.equal(
      subscriptionPeriodEndUnix({
        items: { data: [{ current_period_end: 1_800_000_000 }] },
      }),
      1_800_000_000
    );
    assert.equal(unixSecondsToDate(1_800_000_000)?.toISOString(), "2027-01-15T08:00:00.000Z");
    assert.equal(shouldRestoreAfterDispute("won"), true);
    assert.equal(shouldRestoreAfterDispute("lost"), false);
  });
});
