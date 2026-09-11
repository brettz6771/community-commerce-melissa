export const LEGAL_EFFECTIVE_DATE = "September 1, 2026";
export const CONTACT_EMAIL = "info@communitycommercemelissa.org";
export const ORG_NAME = "Community Commerce Melissa";
export const ORG_LOCATION = "Melissa, Texas 75454";

export const PARTNER_INTRO_USD = 390;
export const PARTNER_RENEWAL_USD = 490;
export const PARTNER_RENEWAL_CENTS = 49000;
export const PARTNER_INTRO_OFF_CENTS = 10000;
export const MEMBERSHIP_TERM_MONTHS = 12;

export const MEMBERSHIP_TERM_SENTENCE =
  "A membership term begins on the date payment is processed and continues for 12 months unless otherwise stated at checkout.";

export const MEMBERSHIP_NOT_VOTING_MEMBER =
  "Community Partner participation is a program benefit and does not make the participant a voting or statutory member of the nonprofit corporation unless expressly provided in Community Commerce Melissa’s governing documents.";

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function membershipPricingLines(): { firstYear: string; renewal: string } {
  return {
    firstYear: `First year: ${formatUsd(PARTNER_INTRO_USD)}`,
    renewal: `Current annual rate after first year: ${formatUsd(PARTNER_RENEWAL_USD)}`,
  };
}

export function membershipAutoRenewDisclosure(): string {
  return `${formatUsd(PARTNER_INTRO_USD)} first year. Automatically renews annually at the then-current membership rate (currently ${formatUsd(PARTNER_RENEWAL_USD)} per year) until canceled. Cancel before your renewal date to prevent the next charge.`;
}

export function membershipAutoRenewCheckboxLabel(): string {
  return `I understand this Community Partner membership is ${formatUsd(PARTNER_INTRO_USD)} for the first year and automatically renews annually at the then-current rate (currently ${formatUsd(PARTNER_RENEWAL_USD)}/year) until I cancel. I can cancel before the renewal date to prevent the next charge.`;
}

export const STRIPE_MEMBERSHIP_PRODUCT_DESCRIPTION =
  `First year ${formatUsd(PARTNER_INTRO_USD)}; then ${formatUsd(PARTNER_RENEWAL_USD)}/year until canceled. 12-month term from payment. Program dues, not a charitable contribution unless CCM’s acknowledgment says otherwise. Non-refundable except corrections or as required by law.`;

export const STRIPE_MEMBERSHIP_SUBMIT_MESSAGE =
  `First year ${formatUsd(PARTNER_INTRO_USD)}. Renews at ${formatUsd(PARTNER_RENEWAL_USD)}/year until canceled. 12-month term from payment. Dues may not be tax-deductible.`;

export const STRIPE_DONATION_PRODUCT_DESCRIPTION =
  "Voluntary charitable contribution to Community Commerce Melissa (501(c)(3)). Deductibility depends on tax law and the donor’s circumstances. CCM provides a written acknowledgment where required. Unrestricted unless CCM expressly accepts a restricted purpose. Non-refundable except corrections or as required by law.";

export const STRIPE_DONATION_SUBMIT_MESSAGE =
  "Unrestricted charitable gift unless CCM expressly accepts a restricted purpose. Deductibility depends on tax law and your circumstances. Written acknowledgment provided where required.";

export const TAX_TREATMENT_SHORT =
  "Membership dues, sponsorships, event fees, purchases, and charitable donations may receive different tax treatment. Community Commerce Melissa will provide required written acknowledgments where applicable. We do not provide tax advice; consult your own advisor about deductibility.";

export const DONATION_UNRESTRICTED_NOTE =
  "Gifts submitted through this form are unrestricted contributions to Community Commerce Melissa unless we have expressly solicited and accepted the gift as restricted to a particular charitable purpose. Honor, memory, or program notes are preferences, not restricted-fund designations, unless we confirm otherwise in writing.";

export const DIRECTORY_NON_ENDORSEMENT =
  "A directory listing is not an endorsement. Community Commerce Melissa does not guarantee or verify a listed business’s licensing, insurance, qualifications, products, services, financial condition, safety, or business practices.";

export const DIRECTORY_NOT_A_PARTY =
  "Community Commerce Melissa is not a party to transactions between directory users and listed businesses.";

export const DIRECTORY_EXPIRATION_NOTE =
  "Directory listings and membership badges automatically end when the applicable membership expires or is terminated.";

export const EVENTS_NOTICE =
  "By attending, you assume ordinary risks of community events. CCM may modify, reschedule, relocate, or cancel events, and may remove disruptive, unsafe, threatening, or harassing attendees. Minors must be accompanied by a parent or guardian unless an event states otherwise. Higher-risk activities may require a separate waiver.";

export const PHOTOGRAPHY_POLICY =
  "CCM may photograph or record public community events for informational, archival, and promotional purposes. Attendees who do not wish to be photographed should notify event staff. Separate consent may be requested for identifiable minors, testimonials, or featured promotional content.";

export const REFUND_POLICY_SHORT =
  "Payments are non-refundable. We may still correct duplicate charges, processing errors, unauthorized transactions, or issue a refund where legally required.";

export const BADGE_RULES_SHORT =
  "The Community Partner badge is revocable, non-transferable, and may be used only while membership is active. Do not alter it in a misleading way or use it to imply that CCM guarantees or endorses your business.";
