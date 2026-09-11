import Stripe from "stripe";

/** Staff-facing complimentary membership code. Do not advertise on the homepage. */
export const STAFF_COMP_PROMO_CODE = "CCMCommunityBuilder";

/** Stable Stripe Coupon id for the indefinite 100% membership discount. */
export const STAFF_COMP_COUPON_ID = "CCM_COMMUNITY_BUILDER_FOREVER";

export type MembershipPromoKind = "none" | "staff_comp" | "invalid";

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

export function classifyMembershipPromo(raw: unknown): MembershipPromoKind {
  if (!normalizePromoCode(raw)) return "none";
  return isStaffCompPromoCode(raw) ? "staff_comp" : "invalid";
}

/**
 * True only for an ongoing 100% coupon (duration=forever).
 * Rejects once/repeating coupons, trials, and expired redeem windows.
 */
export function isIndefiniteHundredPercentCoupon(coupon: Stripe.Coupon): boolean {
  if (coupon.deleted || !coupon.valid) return false;
  if (coupon.percent_off !== 100) return false;
  if (coupon.duration !== "forever") return false;
  if (coupon.redeem_by && coupon.redeem_by * 1000 <= Date.now()) return false;
  return true;
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
  "That membership code is not valid. Leave the field blank to continue at the standard first-year rate, or ask staff for a complimentary code.";

export const STAFF_COMP_COUPON_MISSING_MESSAGE =
  "The complimentary membership code could not be applied. Staff: in Stripe Dashboard create a 100% off coupon with Duration = Forever (not once, not repeating), then a Promotion code exactly CCMCommunityBuilder. The site will also try to create this automatically on the next signup if the Stripe key can write coupons.";

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

async function ensurePromotionCode(stripe: Stripe, couponId: string): Promise<void> {
  try {
    const existing = await stripe.promotionCodes.list({
      code: STAFF_COMP_PROMO_CODE,
      limit: 10,
    });
    const usable = existing.data.find((promo) => promo.active);
    if (usable) {
      return;
    }
    await stripe.promotionCodes.create({
      promotion: { type: "coupon", coupon: couponId },
      code: STAFF_COMP_PROMO_CODE,
      active: true,
    });
  } catch (err) {
    console.warn("Unable to ensure CCMCommunityBuilder promotion code:", err);
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
      await ensurePromotionCode(stripe, existing.id);
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
      await ensurePromotionCode(stripe, match.id);
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
      await ensurePromotionCode(stripe, created.id);
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
      await ensurePromotionCode(stripe, created.id);
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
  await ensurePromotionCode(stripe, created.id);
  return created.id;
}
