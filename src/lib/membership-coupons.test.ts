import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import type Stripe from "stripe";
import {
  STAFF_COMP_PROMO_CODE,
  classifyMembershipPromo,
  getConfiguredStaffCompCode,
  isIndefiniteHundredPercentCoupon,
  isStaffCompPromoCode,
  isStripeCheckoutFulfilled,
  normalizePromoCode,
  promoCodesMatch,
} from "./membership-coupons.ts";

const originalEnvCode = process.env.STAFF_COMP_MEMBERSHIP_CODE;

afterEach(() => {
  if (originalEnvCode === undefined) {
    delete process.env.STAFF_COMP_MEMBERSHIP_CODE;
  } else {
    process.env.STAFF_COMP_MEMBERSHIP_CODE = originalEnvCode;
  }
});

describe("CCMCommunityBuilder promo matching", () => {
  it("uses the exact staff-facing code string", () => {
    assert.equal(STAFF_COMP_PROMO_CODE, "CCMCommunityBuilder");
    assert.equal(getConfiguredStaffCompCode(), "CCMCommunityBuilder");
  });

  it("normalizes whitespace but keeps the official casing on the constant", () => {
    assert.equal(normalizePromoCode("  CCMCommunityBuilder  "), "CCMCommunityBuilder");
    assert.equal(promoCodesMatch("ccmcommunitybuilder", STAFF_COMP_PROMO_CODE), true);
  });

  it("accepts the official code case-insensitively and rejects other codes", () => {
    assert.equal(isStaffCompPromoCode("CCMCommunityBuilder"), true);
    assert.equal(isStaffCompPromoCode("ccmcommunitybuilder"), true);
    assert.equal(isStaffCompPromoCode("CCMCOMMUNITYBUILDER"), true);
    assert.equal(isStaffCompPromoCode("COMPMEMBER"), false);
    assert.equal(isStaffCompPromoCode("FREEMEMBER"), false);
    assert.equal(isStaffCompPromoCode(""), false);
    assert.equal(isStaffCompPromoCode("   "), false);
  });

  it("classifies blank, valid, and invalid promo input", () => {
    assert.equal(classifyMembershipPromo(""), "none");
    assert.equal(classifyMembershipPromo("   "), "none");
    assert.equal(classifyMembershipPromo("CCMCommunityBuilder"), "staff_comp");
    assert.equal(classifyMembershipPromo("SAVE100"), "invalid");
  });
});

describe("isIndefiniteHundredPercentCoupon", () => {
  function coupon(overrides: Partial<Stripe.Coupon>): Stripe.Coupon {
    return {
      id: "c1",
      object: "coupon",
      valid: true,
      deleted: undefined,
      percent_off: 100,
      duration: "forever",
      ...overrides,
    } as Stripe.Coupon;
  }

  it("accepts only duration=forever 100% coupons", () => {
    assert.equal(isIndefiniteHundredPercentCoupon(coupon({})), true);
  });

  it("rejects once, repeating, amount-off, and invalid coupons", () => {
    assert.equal(isIndefiniteHundredPercentCoupon(coupon({ duration: "once" })), false);
    assert.equal(isIndefiniteHundredPercentCoupon(coupon({ duration: "repeating", duration_in_months: 12 })), false);
    assert.equal(isIndefiniteHundredPercentCoupon(coupon({ percent_off: 50 })), false);
    assert.equal(isIndefiniteHundredPercentCoupon(coupon({ valid: false })), false);
    assert.equal(
      isIndefiniteHundredPercentCoupon(
        coupon({ percent_off: null, amount_off: 49000, currency: "usd" } as Partial<Stripe.Coupon>)
      ),
      false
    );
  });

  it("rejects coupons whose redeem window has already closed", () => {
    assert.equal(
      isIndefiniteHundredPercentCoupon(coupon({ redeem_by: Math.floor(Date.now() / 1000) - 60 })),
      false
    );
  });
});

describe("isStripeCheckoutFulfilled", () => {
  it("treats $0 complimentary checkouts as fulfilled", () => {
    assert.equal(isStripeCheckoutFulfilled({ payment_status: "paid" }), true);
    assert.equal(isStripeCheckoutFulfilled({ payment_status: "no_payment_required" }), true);
    assert.equal(isStripeCheckoutFulfilled({ payment_status: "unpaid" }), false);
  });
});
