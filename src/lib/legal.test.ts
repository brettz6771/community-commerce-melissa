import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MEMBERSHIP_NOT_VOTING_MEMBER,
  MEMBERSHIP_TERM_SENTENCE,
  PARTNER_INTRO_USD,
  PARTNER_RENEWAL_USD,
  STRIPE_DONATION_PRODUCT_DESCRIPTION,
  STRIPE_MEMBERSHIP_PRODUCT_DESCRIPTION,
  STRIPE_MEMBERSHIP_SUBMIT_MESSAGE,
  membershipAutoRenewCheckboxLabel,
  membershipAutoRenewDisclosure,
  membershipPricingLines,
} from "./legal.ts";

describe("membership pricing copy", () => {
  it("uses $390 first year and $490 renewal, not sample $75/$150 figures", () => {
    assert.equal(PARTNER_INTRO_USD, 390);
    assert.equal(PARTNER_RENEWAL_USD, 490);
    const lines = membershipPricingLines();
    assert.equal(lines.firstYear, "First year: $390");
    assert.equal(lines.renewal, "Current annual rate after first year: $490");
    assert.doesNotMatch(membershipAutoRenewDisclosure(), /\$75|\$150/);
    assert.match(membershipAutoRenewDisclosure(), /\$390/);
    assert.match(membershipAutoRenewDisclosure(), /\$490/);
  });

  it("states a 12-month term from payment and auto-renewal until canceled", () => {
    assert.match(MEMBERSHIP_TERM_SENTENCE, /12 months/);
    assert.match(MEMBERSHIP_TERM_SENTENCE, /date payment is processed/i);
    assert.match(membershipAutoRenewDisclosure(), /Automatically renews annually/i);
    assert.match(membershipAutoRenewDisclosure(), /until canceled/i);
    assert.match(membershipAutoRenewCheckboxLabel(), /automatically renews annually/i);
    assert.doesNotMatch(membershipAutoRenewDisclosure(), /non-refundable/i);
    assert.doesNotMatch(membershipAutoRenewCheckboxLabel(), /non-refundable/i);
    assert.doesNotMatch(STRIPE_MEMBERSHIP_SUBMIT_MESSAGE, /non-refundable/i);
  });

  it("keeps Stripe receipt language from implying dues are charitable gifts", () => {
    assert.match(STRIPE_MEMBERSHIP_PRODUCT_DESCRIPTION, /Program dues/);
    assert.match(STRIPE_MEMBERSHIP_SUBMIT_MESSAGE, /may not be tax-deductible/i);
    assert.doesNotMatch(STRIPE_MEMBERSHIP_PRODUCT_DESCRIPTION, /fully tax-deductible/i);
    assert.match(STRIPE_DONATION_PRODUCT_DESCRIPTION, /Deductibility depends/i);
    assert.match(STRIPE_DONATION_PRODUCT_DESCRIPTION, /Unrestricted unless/i);
  });

  it("does not treat Community Partner as a statutory voting member", () => {
    assert.match(MEMBERSHIP_NOT_VOTING_MEMBER, /does not make the participant a voting or statutory member/i);
  });
});
