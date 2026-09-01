import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Community Commerce Melissa, including the information we collect, how it is used, third-party providers, and how to make a privacy request.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
