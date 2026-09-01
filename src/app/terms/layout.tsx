import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Community Commerce Melissa, including membership, donations, website use, and our no-refund policy.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
