"use client";

import Link from "next/link";

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
  const linkClass =
    variant === "dark"
      ? "text-red-400 hover:text-red-300"
      : "text-red-700 hover:text-red-800";

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
        <Link
          href="/terms"
          target="_blank"
          rel="noreferrer"
          className={`${linkClass} font-bold underline underline-offset-2`}
        >
          Terms of Service
        </Link>
        {includeRefund ? ", including that all payments are non-refundable" : ""}
        .
      </span>
    </label>
  );
}
