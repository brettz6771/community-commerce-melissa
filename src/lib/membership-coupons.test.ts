import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import type Stripe from "stripe";
import {
  STAFF_COMP_PROMO_CODE,
  NONPROFIT_PROMO_CODE,
  NONPROFIT_YEAR1_CENTS,
  NONPROFIT_RENEWAL_CENTS,
  NONPROFIT_YEAR1_EXTRA_OFF_CENTS,
  classifyMembershipPromo,
  getConfiguredNonprofitCode,
  getConfiguredStaffCompCode,
  isIndefiniteHundredPercentCoupon,
  isIndefiniteNonprofitCoupon,
  isOnceNonprofitYear1ExtraCoupon,
  isNonprofitPromoCode,
  isStaffCompPromoCode,
  isStripeCheckoutFulfilled,
  normalizePromoCode,
  promoCodesMatch,
} from "./membership-coupons.ts";

const originalEnvCode = process.env.STAFF_COMP_MEMBERSHIP_CODE;
const originalNonprofitEnvCode = process.env.NONPROFIT_MEMBERSHIP_CODE;

afterEach(() => {
  if (originalEnvCode === undefined) {
    delete process.env.STAFF_COMP_MEMBERSHIP_CODE;
  } else {
    process.env.STAFF_COMP_MEMBERSHIP_CODE = originalEnvCode;
  }
  if (originalNonprofitEnvCode === undefined) {
    delete process.env.NONPROFIT_MEMBERSHIP_CODE;
  } else {
    process.env.NONPROFIT_MEMBERSHIP_CODE = originalNonprofitEnvCode;
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
    assert.equal(classifyMembershipPromo("CCMNonprofits"), "nonprofit");
    assert.equal(classifyMembershipPromo("SAVE100"), "invalid");
  });
});

describe("CCMNonprofits promo matching", () => {
  it("uses the exact non-profit code string", () => {
    assert.equal(NONPROFIT_PROMO_CODE, "CCMNonprofits");
    assert.equal(getConfiguredNonprofitCode(), "CCMNonprofits");
  });

  it("accepts the official code case-insensitively and rejects other codes", () => {
    assert.equal(isNonprofitPromoCode("CCMNonprofits"), true);
    assert.equal(isNonprofitPromoCode("ccmnonprofits"), true);
    assert.equal(isNonprofitPromoCode("CCMNONPROFITS"), true);
    assert.equal(isNonprofitPromoCode("CCMCommunityBuilder"), false);
    assert.equal(isNonprofitPromoCode("SAVE20"), false);
    assert.equal(isNonprofitPromoCode(""), false);
  });

  it("honors NONPROFIT_MEMBERSHIP_CODE when set", () => {
    process.env.NONPROFIT_MEMBERSHIP_CODE = "CustomNonprofit";
    assert.equal(isNonprofitPromoCode("CustomNonprofit"), true);
    assert.equal(isNonprofitPromoCode("CCMNonprofits"), true);
    assert.equal(classifyMembershipPromo("CustomNonprofit"), "nonprofit");
  });

  it("is 20% off $390 year 1 and 20% off $490 on renewals", () => {
    assert.equal(NONPROFIT_YEAR1_CENTS, 31200);
    assert.equal(NONPROFIT_RENEWAL_CENTS, 39200);
    assert.equal(NONPROFIT_YEAR1_EXTRA_OFF_CENTS, 8000);
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

describe("isIndefiniteNonprofitCoupon", () => {
  function coupon(overrides: Partial<Stripe.Coupon>): Stripe.Coupon {
    return {
      id: "np1",
      object: "coupon",
      valid: true,
      deleted: undefined,
      percent_off: 20,
      duration: "forever",
      ...overrides,
    } as Stripe.Coupon;
  }

  it("accepts only duration=forever 20% coupons", () => {
    assert.equal(isIndefiniteNonprofitCoupon(coupon({})), true);
    assert.equal(isIndefiniteNonprofitCoupon(coupon({ duration: "once" })), false);
    assert.equal(isIndefiniteNonprofitCoupon(coupon({ percent_off: 100 })), false);
    assert.equal(isIndefiniteNonprofitCoupon(coupon({ percent_off: 10 })), false);
  });
});

describe("isOnceNonprofitYear1ExtraCoupon", () => {
  function coupon(overrides: Partial<Stripe.Coupon>): Stripe.Coupon {
    return {
      id: "np-y1",
      object: "coupon",
      valid: true,
      deleted: undefined,
      amount_off: 8000,
      currency: "usd",
      duration: "once",
      ...overrides,
    } as Stripe.Coupon;
  }

  it("accepts only a once $80-off coupon", () => {
    assert.equal(isOnceNonprofitYear1ExtraCoupon(coupon({})), true);
    assert.equal(isOnceNonprofitYear1ExtraCoupon(coupon({ duration: "forever" })), false);
    assert.equal(isOnceNonprofitYear1ExtraCoupon(coupon({ amount_off: 10000 })), false);
    assert.equal(isOnceNonprofitYear1ExtraCoupon(coupon({ valid: false })), false);
  });
});

describe("isStripeCheckoutFulfilled", () => {
  it("treats $0 complimentary checkouts as fulfilled", () => {
    assert.equal(isStripeCheckoutFulfilled({ payment_status: "paid" }), true);
    assert.equal(isStripeCheckoutFulfilled({ payment_status: "no_payment_required" }), true);
    assert.equal(isStripeCheckoutFulfilled({ payment_status: "unpaid" }), false);
  });
});
