"use client";

import Link from "next/link";

interface LegalPolicyLinksProps {
  variant?: "dark" | "light";
}

export function legalLinkClass(variant: "dark" | "light" = "dark"): string {
  return variant === "dark"
    ? "text-red-400 hover:text-red-300"
    : "text-red-700 hover:text-red-800";
}

export default function LegalPolicyLinks({ variant = "dark" }: LegalPolicyLinksProps) {
  const linkClass = `${legalLinkClass(variant)} font-bold underline underline-offset-2`;

  return (
    <>
      <Link href="/terms" target="_blank" rel="noreferrer" className={linkClass}>
        Terms of Service
      </Link>
      {" and "}
      <Link href="/privacy" target="_blank" rel="noreferrer" className={linkClass}>
        Privacy Policy
      </Link>
    </>
  );
}
