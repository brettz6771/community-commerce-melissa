"use client";

import LegalPolicyLinks from "@/components/LegalPolicyLinks";

interface TermsAgreementProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "dark" | "light";
  id?: string;
  includeRefund?: boolean;
}

export default function TermsAgreement({
  checked,
  onChange,
  variant = "dark",
  id = "agree-terms",
  includeRefund = false,
}: TermsAgreementProps) {
  const textClass = variant === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <label htmlFor={id} className={`flex items-start gap-2.5 text-xs ${textClass} cursor-pointer leading-relaxed`}>
      <input
        id={id}
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#A81C24]"
      />
      <span>
        I agree to the{" "}
        <LegalPolicyLinks variant={variant} />
        {includeRefund
          ? ", including that payments are non-refundable except as described in the Terms"
          : ""}
        .
      </span>
    </label>
  );
}

interface AutoRenewAcknowledgmentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  variant?: "dark" | "light";
  id?: string;
}

export function AutoRenewAcknowledgment({
  checked,
  onChange,
  label,
  variant = "dark",
  id = "agree-autorenew",
}: AutoRenewAcknowledgmentProps) {
  const textClass = variant === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <label htmlFor={id} className={`flex items-start gap-2.5 text-xs ${textClass} cursor-pointer leading-relaxed`}>
      <input
        id={id}
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#A81C24]"
      />
      <span>{label}</span>
    </label>
  );
}
