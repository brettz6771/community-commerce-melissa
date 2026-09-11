"use client";

import {
  membershipAutoRenewDisclosure,
  membershipPricingLines,
  MEMBERSHIP_TERM_SENTENCE,
  TAX_TREATMENT_SHORT,
} from "@/lib/legal";

export default function MembershipCheckoutNotice({ compact = false }: { compact?: boolean }) {
  const pricing = membershipPricingLines();

  return (
    <div className="bg-white/5 border border-white/15 rounded-xl p-3.5 space-y-2 text-[11px] text-slate-300 leading-relaxed">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-bold text-white text-xs">
        <div>{pricing.firstYear}</div>
        <div>{pricing.renewal}</div>
      </div>
      <p>{membershipAutoRenewDisclosure()}</p>
      {!compact && (
        <>
          <p>{MEMBERSHIP_TERM_SENTENCE}</p>
          <p className="text-slate-400">{TAX_TREATMENT_SHORT}</p>
        </>
      )}
    </div>
  );
}
