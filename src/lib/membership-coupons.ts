import Stripe from "stripe";

/** Staff-facing complimentary membership code. Do not advertise on the homepage. */
export const STAFF_COMP_PROMO_CODE = "CCMCommunityBuilder";

/** Stable Stripe Coupon id for the indefinite 100% membership discount. */
export const STAFF_COMP_COUPON_ID = "CCM_COMMUNITY_BUILDER_FOREVER";

/** Non-profit membership code: 20% off dues, including renewals. */
export const NONPROFIT_PROMO_CODE = "CCMNonprofits";

/** Stable Stripe Coupon id for the indefinite 20% non-profit discount. */
export const NONPROFIT_COUPON_ID = "CCM_NONPROFIT_20_FOREVER";

export const NONPROFIT_PERCENT_OFF = 20;

export type MembershipPromoKind = "none" | "staff_comp" | "nonprofit" | "invalid";

export function normalizePromoCode(raw: unknown): string {
  return String(raw ?? "").trim();
}

export function promoCodesMatch(a: unknown, b: unknown): boolean {
  return normalizePromoCode(a).toLowerCase() === normalizePromoCode(b).toLowerCase();
}

export function getConfiguredStaffCompCode(): string {
  const fromEnv = normalizePromoCode(process.env.STAFF_COMP_MEMBERSHIP_CODE);
  return fromEnv || STAFF_COMP_PROMO_CODE;
}

export function isStaffCompPromoCode(raw: unknown): boolean {
  const code = normalizePromoCode(raw);
  if (!code) return false;
  return (
    promoCodesMatch(code, STAFF_COMP_PROMO_CODE) ||
    promoCodesMatch(code, getConfiguredStaffCompCode())
  );
}

export function getConfiguredNonprofitCode(): string {
  const fromEnv = normalizePromoCode(process.env.NONPROFIT_MEMBERSHIP_CODE);
  return fromEnv || NONPROFIT_PROMO_CODE;
}

export function isNonprofitPromoCode(raw: unknown): boolean {
  const code = normalizePromoCode(raw);
  if (!code) return false;
  return (
    promoCodesMatch(code, NONPROFIT_PROMO_CODE) ||
    promoCodesMatch(code, getConfiguredNonprofitCode())
  );
}

export function classifyMembershipPromo(raw: unknown): MembershipPromoKind {
  if (!normalizePromoCode(raw)) return "none";
  if (isStaffCompPromoCode(raw)) return "staff_comp";
  if (isNonprofitPromoCode(raw)) return "nonprofit";
  return "invalid";
}

/**
 * True only for an ongoing 100% coupon (duration=forever).
 * Rejects once/repeating coupons, trials, and expired redeem windows.
 */
export function isIndefiniteHundredPercentCoupon(coupon: Stripe.Coupon): boolean {
  return isIndefinitePercentOffCoupon(coupon, 100);
}

/** True only for an ongoing percent-off coupon (duration=forever). */
export function isIndefinitePercentOffCoupon(
  coupon: Stripe.Coupon,
  percentOff: number
): boolean {
  if (coupon.deleted || !coupon.valid) return false;
  if (coupon.percent_off !== percentOff) return false;
  if (coupon.duration !== "forever") return false;
  if (coupon.redeem_by && coupon.redeem_by * 1000 <= Date.now()) return false;
  return true;
}

export function isIndefiniteNonprofitCoupon(coupon: Stripe.Coupon): boolean {
  return isIndefinitePercentOffCoupon(coupon, NONPROFIT_PERCENT_OFF);
}

export function isStripeCheckoutFulfilled(session: {
  payment_status?: string | null;
}): boolean {
  return (
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required"
  );
}

export const INVALID_MEMBERSHIP_CODE_MESSAGE =
  "That coupon code is not valid. Leave the field blank to continue at the standard first-year rate, or ask staff for a complimentary or non-profit code.";

export const STAFF_COMP_COUPON_MISSING_MESSAGE =
  "The complimentary coupon code could not be applied. Staff: in Stripe Dashboard create a 100% off coupon with Duration = Forever (not once, not repeating), then a Promotion code exactly CCMCommunityBuilder. The site will also try to create this automatically on the next signup if the Stripe key can write coupons.";

export const NONPROFIT_COUPON_MISSING_MESSAGE =
  "The non-profit coupon code could not be applied. Staff: in Stripe Dashboard create a 20% off coupon with Duration = Forever (not once, not repeating), then a Promotion code exactly CCMNonprofits. The site will also try to create this automatically on the next signup if the Stripe key can write coupons.";

function couponFromPromo(promo: Stripe.PromotionCode): Stripe.Coupon | string | null {
  return promo.promotion?.coupon ?? null;
}

async function retrieveCoupon(
  stripe: Stripe,
  couponRef: Stripe.Coupon | string | null
): Promise<Stripe.Coupon | null> {
  if (!couponRef) return null;
  if (typeof couponRef !== "string") {
    return couponRef;
  }
  try {
    return await stripe.coupons.retrieve(couponRef);
  } catch {
    return null;
  }
}

async function ensurePromotionCode(
  stripe: Stripe,
  couponId: string,
  promoCode: string
): Promise<void> {
  try {
    const existing = await stripe.promotionCodes.list({
      code: promoCode,
      limit: 10,
    });
    const usable = existing.data.find((promo) => promo.active);
    if (usable) {
      return;
    }
    await stripe.promotionCodes.create({
      promotion: { type: "coupon", coupon: couponId },
      code: promoCode,
      active: true,
    });
  } catch (err) {
    console.warn(`Unable to ensure ${promoCode} promotion code:`, err);
  }
}

/**
 * Resolve a duration=forever 100% coupon and the CCMCommunityBuilder promo code.
 * Never returns a once/repeating/trial coupon — those would later bill the member.
 */
export async function resolveStaffCompCoupon(stripe: Stripe): Promise<string | null> {
  try {
    const promos = await stripe.promotionCodes.list({
      code: STAFF_COMP_PROMO_CODE,
      limit: 10,
    });
    for (const promo of promos.data) {
      const coupon = await retrieveCoupon(stripe, couponFromPromo(promo));
      if (coupon && isIndefiniteHundredPercentCoupon(coupon)) {
        return coupon.id;
      }
      if (coupon) {
        console.error(
          "Promotion code CCMCommunityBuilder is attached to a coupon that is not indefinite 100% off (duration must be forever). Refusing to apply it so the member is not billed later.",
          { couponId: coupon.id, duration: coupon.duration, percent_off: coupon.percent_off }
        );
      }
    }
  } catch {
    // List permission may be restricted
  }

  try {
    const existing = await stripe.coupons.retrieve(STAFF_COMP_COUPON_ID);
    if (isIndefiniteHundredPercentCoupon(existing)) {
      await ensurePromotionCode(stripe, existing.id, STAFF_COMP_PROMO_CODE);
      return existing.id;
    }
  } catch {
    // Not found
  }

  try {
    const list = await stripe.coupons.list({ limit: 100 });
    const match = list.data.find(
      (coupon) =>
        isIndefiniteHundredPercentCoupon(coupon) &&
        coupon.metadata?.purpose === "staff_complimentary_membership"
    );
    if (match) {
      await ensurePromotionCode(stripe, match.id, STAFF_COMP_PROMO_CODE);
      return match.id;
    }
  } catch {
    // List permission may be restricted
  }

  try {
    const created = await stripe.coupons.create({
      id: STAFF_COMP_COUPON_ID,
      percent_off: 100,
      duration: "forever",
      metadata: {
        purpose: "staff_complimentary_membership",
        promo_code: STAFF_COMP_PROMO_CODE,
      },
    });
    if (created?.id) {
      await ensurePromotionCode(stripe, created.id, STAFF_COMP_PROMO_CODE);
      return created.id;
    }
  } catch {
    // ID might already exist in a deleted/invalid state
  }

  try {
    const created = await stripe.coupons.create({
      percent_off: 100,
      duration: "forever",
      metadata: {
        purpose: "staff_complimentary_membership",
        promo_code: STAFF_COMP_PROMO_CODE,
      },
    });
    if (created?.id) {
      await ensurePromotionCode(stripe, created.id, STAFF_COMP_PROMO_CODE);
      return created.id;
    }
  } catch (err) {
    console.error("Unable to create indefinite CCMCommunityBuilder 100% coupon:", err);
  }

  return null;
}

export async function createFreshStaffCompCoupon(stripe: Stripe): Promise<string> {
  const created = await stripe.coupons.create({
    percent_off: 100,
    duration: "forever",
    metadata: {
      purpose: "staff_complimentary_membership",
      promo_code: STAFF_COMP_PROMO_CODE,
    },
  });
  if (!created?.id) {
    throw new Error("Stripe did not return a complimentary coupon id.");
  }
  await ensurePromotionCode(stripe, created.id, STAFF_COMP_PROMO_CODE);
  return created.id;
}

/**
 * Resolve a duration=forever 20% coupon and the CCMNonprofits promo code.
 * Renewals stay 20% off — never a once-only first-year coupon.
 */
export async function resolveNonprofitCoupon(stripe: Stripe): Promise<string | null> {
  try {
    const promos = await stripe.promotionCodes.list({
      code: NONPROFIT_PROMO_CODE,
      limit: 10,
    });
    for (const promo of promos.data) {
      const coupon = await retrieveCoupon(stripe, couponFromPromo(promo));
      if (coupon && isIndefiniteNonprofitCoupon(coupon)) {
        return coupon.id;
      }
      if (coupon) {
        console.error(
          "Promotion code CCMNonprofits is attached to a coupon that is not indefinite 20% off (duration must be forever). Refusing to apply it so renewals are not billed at full dues.",
          { couponId: coupon.id, duration: coupon.duration, percent_off: coupon.percent_off }
        );
      }
    }
  } catch {
    // List permission may be restricted
  }

  try {
    const existing = await stripe.coupons.retrieve(NONPROFIT_COUPON_ID);
    if (isIndefiniteNonprofitCoupon(existing)) {
      await ensurePromotionCode(stripe, existing.id, NONPROFIT_PROMO_CODE);
      return existing.id;
    }
  } catch {
    // Not found
  }

  try {
    const list = await stripe.coupons.list({ limit: 100 });
    const match = list.data.find(
      (coupon) =>
        isIndefiniteNonprofitCoupon(coupon) &&
        coupon.metadata?.purpose === "nonprofit_membership"
    );
    if (match) {
      await ensurePromotionCode(stripe, match.id, NONPROFIT_PROMO_CODE);
      return match.id;
    }
  } catch {
    // List permission may be restricted
  }

  try {
    const created = await stripe.coupons.create({
      id: NONPROFIT_COUPON_ID,
      percent_off: NONPROFIT_PERCENT_OFF,
      duration: "forever",
      metadata: {
        purpose: "nonprofit_membership",
        promo_code: NONPROFIT_PROMO_CODE,
      },
    });
    if (created?.id) {
      await ensurePromotionCode(stripe, created.id, NONPROFIT_PROMO_CODE);
      return created.id;
    }
  } catch {
    // ID might already exist in a deleted/invalid state
  }

  try {
    const created = await stripe.coupons.create({
      percent_off: NONPROFIT_PERCENT_OFF,
      duration: "forever",
      metadata: {
        purpose: "nonprofit_membership",
        promo_code: NONPROFIT_PROMO_CODE,
      },
    });
    if (created?.id) {
      await ensurePromotionCode(stripe, created.id, NONPROFIT_PROMO_CODE);
      return created.id;
    }
  } catch (err) {
    console.error("Unable to create indefinite CCMNonprofits 20% coupon:", err);
  }

  return null;
}

export async function createFreshNonprofitCoupon(stripe: Stripe): Promise<string> {
  const created = await stripe.coupons.create({
    percent_off: NONPROFIT_PERCENT_OFF,
    duration: "forever",
    metadata: {
      purpose: "nonprofit_membership",
      promo_code: NONPROFIT_PROMO_CODE,
    },
  });
  if (!created?.id) {
    throw new Error("Stripe did not return a non-profit coupon id.");
  }
  await ensurePromotionCode(stripe, created.id, NONPROFIT_PROMO_CODE);
  return created.id;
}
