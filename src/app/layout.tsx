import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://communitycommercemelissa.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Community Commerce Melissa | Local Business & Stewardship",
    template: "%s | Community Commerce Melissa"
  },
  description: "Connecting, promoting, and empowering local Melissa businesses, entrepreneurs, and community leaders. Fostering growth, servant leadership, and non-profit stewardship in Melissa, Texas.",
  keywords: ["Melissa TX", "Melissa Texas", "Local Business", "Community Commerce", "Networking Melissa", "Small Business Support", "Non-profit stewardship", "Collin County Business"],
  authors: [{ name: "Community Commerce Melissa" }],
  creator: "Community Commerce Melissa",
  publisher: "Community Commerce Melissa",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  icons: {
    icon: "/cardinal.png",
    shortcut: "/cardinal.png",
    apple: "/cardinal.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Community Commerce Melissa | Local Business & Stewardship",
    description: "Connecting, promoting, and empowering local Melissa businesses, entrepreneurs, and community leaders. Fostering economic momentum and non-profit stewardship in Collin County.",
    url: siteUrl,
    siteName: "Community Commerce Melissa",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/hero-networking.jpg",
        width: 1200,
        height: 630,
        alt: "Community Commerce Melissa Networking Event",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Commerce Melissa",
    description: "Connecting, promoting, and empowering local Melissa businesses, entrepreneurs, and community leaders.",
    images: ["/hero-networking.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
