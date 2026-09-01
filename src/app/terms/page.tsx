"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import PageTitle from "@/components/PageTitle";
import { Scale, ShieldAlert } from "lucide-react";

const SECTIONS = [
  { id: "agreement", title: "1. Agreement to These Terms" },
  { id: "who-we-are", title: "2. Who We Are" },
  { id: "eligibility", title: "3. Eligibility" },
  { id: "website-use", title: "4. Using This Website" },
  { id: "membership", title: "5. Membership" },
  { id: "refunds", title: "6. Refund Policy" },
  { id: "donations", title: "7. Donations" },
  { id: "events", title: "8. Events and RSVPs" },
  { id: "communications", title: "9. Communications" },
  { id: "user-content", title: "10. User Content and Directory Listings" },
  { id: "intellectual-property", title: "11. Intellectual Property" },
  { id: "third-parties", title: "12. Third-Party Services" },
  { id: "disclaimers", title: "13. Disclaimers" },
  { id: "liability", title: "14. Limitation of Liability" },
  { id: "indemnification", title: "15. Indemnification" },
  { id: "termination", title: "16. Suspension and Termination" },
  { id: "changes", title: "17. Changes to These Terms" },
  { id: "governing-law", title: "18. Governing Law" },
  { id: "contact", title: "19. Contact" },
];

export default function TermsPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="Terms of Service" />
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Scale className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              Terms of <span className="text-slate-200">Service</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Please read these terms before using this website, joining as a member, donating, volunteering, or signing up for updates. By using the site or completing a signup, you agree to them.
            </p>
            <p className="text-xs text-slate-400">Effective date: September 1, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Contents</h2>
              <nav className="space-y-1.5">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-xs text-slate-700 hover:text-red-700 transition"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="lg:col-span-8 space-y-10 text-sm text-slate-700 leading-relaxed">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="font-extrabold font-outfit uppercase text-slate-900">No refunds</h2>
                <p>
                  Community Commerce Melissa does not offer refunds. Membership dues, donations, sponsorship payments, event fees, and other amounts paid through this website are final once processed.
                </p>
              </div>
            </div>

            <section id="agreement" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">1. Agreement to These Terms</h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of communitycommercemelissa.org and related forms, checkout pages, emails, and member tools (the &ldquo;Site&rdquo;).
              </p>
              <p>
                By visiting the Site, creating a listing, joining as a member, making a donation, RSVPing to an event, volunteering, subscribing to our newsletter, or submitting any form, you agree to these Terms. If you do not agree, do not use the Site or complete a signup.
              </p>
              <p>
                If you use the Site on behalf of a business or organization, you represent that you have authority to bind that business or organization to these Terms.
              </p>
            </section>

            <section id="who-we-are" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">2. Who We Are</h2>
              <p>
                Community Commerce Melissa is a Texas 501(c)(3) non-profit organization serving Melissa, Texas. We connect, promote, and support local businesses and community programs. These Terms are a general website and participation policy for our organization. They are not legal, tax, or accounting advice.
              </p>
            </section>

            <section id="eligibility" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">3. Eligibility</h2>
              <p>
                You must be at least 18 years old to create an account, join as a member, donate, or submit forms on the Site. You agree that information you provide is accurate and complete, and that you will keep it current.
              </p>
            </section>

            <section id="website-use" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">4. Using This Website</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use the Site for any unlawful, harmful, fraudulent, or misleading purpose</li>
                <li>Interfere with the Site, other users, or our systems, including scraping, hacking, or overloading the service</li>
                <li>Impersonate another person or misrepresent your affiliation with a business</li>
                <li>Post content that is defamatory, infringing, discriminatory, or otherwise inappropriate</li>
                <li>Attempt to access non-public areas, including admin tools or other users&apos; data</li>
              </ul>
              <p>
                We may refuse, limit, or discontinue access to the Site at any time if we believe these Terms have been violated or if needed to protect the organization, members, or the public.
              </p>
            </section>

            <section id="membership" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">5. Membership</h2>
              <p>
                Community Partner membership is an annual, auto-renewing subscription. Promotional first-year pricing, if offered, applies only to the first billing period and then renews at the then-current annual rate unless canceled.
              </p>
              <p>
                Membership benefits—such as directory listing, digital badge, event access, and promotional features—are offered as available. We may modify, pause, or discontinue a benefit as programs change. Membership does not create an employment, partnership, or agency relationship, and does not guarantee business results, leads, or referrals.
              </p>
              <p>
                You may cancel future renewals by emailing{" "}
                <a href="mailto:info@communitycommercemelissa.org" className="text-red-700 font-semibold">
                  info@communitycommercemelissa.org
                </a>{" "}
                before the next billing date. Cancellation stops future charges; it does not refund amounts already paid for the current term.
              </p>
            </section>

            <section id="refunds" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">6. Refund Policy</h2>
              <p className="font-semibold text-slate-900">
                We do not offer refunds.
              </p>
              <p>
                All payments made to Community Commerce Melissa are final and non-refundable, including without limitation:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Membership dues and renewal charges</li>
                <li>Donations and contributions</li>
                <li>Sponsorship or partnership payments</li>
                <li>Event tickets or related fees, if charged</li>
              </ul>
              <p>
                This no-refund policy applies even if you change your mind, close your business, do not use a benefit, miss an event, or cancel mid-term. If a payment processor reverses a charge, we may suspend membership, remove a directory listing, and recover unpaid amounts.
              </p>
              <p>
                If we cancel a paid program entirely and do not provide a substitute, we may, at our sole discretion, issue a credit or refund. We are not required to do so except where law requires otherwise.
              </p>
            </section>

            <section id="donations" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">7. Donations</h2>
              <p>
                Donations are voluntary gifts to support our charitable and community purposes. Unless we state otherwise at checkout, donations are not payment for goods or services. We may issue a written acknowledgment for tax purposes; you are responsible for determining deductibility with your own tax advisor.
              </p>
              <p>
                Designations or notes (for example, youth scholarships) are suggestions. We may apply gifts where they are most needed, consistent with our mission and applicable law.
              </p>
            </section>

            <section id="events" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">8. Events and RSVPs</h2>
              <p>
                Event details may change. We may reschedule, relocate, or cancel events. RSVPs do not guarantee admission if capacity is limited. By attending, you grant us permission to photograph or record the event and to use those materials for community and organizational purposes, unless you make a reasonable request otherwise in writing.
              </p>
            </section>

            <section id="communications" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">9. Communications</h2>
              <p>
                If you subscribe to our newsletter or provide your email through a form or checkout, you agree we may send operational messages (receipts, membership, event updates) and, where permitted, community news. You may unsubscribe from marketing emails at any time. We still may send messages needed to administer membership, donations, or legal notices.
              </p>
            </section>

            <section id="user-content" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">10. User Content and Directory Listings</h2>
              <p>
                You retain ownership of content you submit (such as business name, description, logo, website, and contact details). You grant Community Commerce Melissa a non-exclusive, royalty-free license to use, display, and distribute that content in the directory, newsletters, event materials, and related community communications.
              </p>
              <p>
                You are responsible for the accuracy of your listing and for having rights to any material you submit. We may edit, refuse, or remove content that is inaccurate, outdated, misleading, infringing, or inconsistent with our mission. Listing a business is not an endorsement of its products or services.
              </p>
            </section>

            <section id="intellectual-property" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">11. Intellectual Property</h2>
              <p>
                The Site, including our name, logos, badge designs, layout, and original content, is owned by Community Commerce Melissa or its licensors. You may not copy, sell, or exploit the Site or our marks without prior written permission, except for reasonable personal or member use of an official badge we provide to you.
              </p>
            </section>

            <section id="third-parties" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">12. Third-Party Services</h2>
              <p>
                Payments are processed by Stripe or similar providers. Email and other tools may be provided by third parties. Those services have their own terms and privacy practices. We are not responsible for third-party websites linked from the Site, including member websites in the directory.
              </p>
            </section>

            <section id="disclaimers" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">13. Disclaimers</h2>
              <p>
                The Site and all programs are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the fullest extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, title, and non-infringement. We do not warrant that the Site will be uninterrupted, error-free, or secure, or that directory or event information is complete or current.
              </p>
            </section>

            <section id="liability" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">14. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Community Commerce Melissa and its directors, officers, volunteers, and agents will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost data, or loss of goodwill, arising from your use of the Site, membership, events, or donations.
              </p>
              <p>
                Our total liability for any claim relating to the Site or these Terms will not exceed the greater of (a) the amount you paid us in the twelve months before the claim or (b) fifty U.S. dollars ($50), except where law does not allow this limit.
              </p>
            </section>

            <section id="indemnification" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">15. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Community Commerce Melissa and its directors, officers, volunteers, and agents from claims, damages, losses, and expenses (including reasonable attorneys&apos; fees) arising out of your use of the Site, your content, your business activities, or your violation of these Terms or applicable law.
              </p>
            </section>

            <section id="termination" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">16. Suspension and Termination</h2>
              <p>
                We may suspend or end membership, remove a listing, or block Site access if you violate these Terms, engage in conduct that harms the organization or community, fail to pay amounts due, or if we discontinue a program. Sections that by their nature should survive (including refunds, licenses already granted, disclaimers, liability limits, and indemnification) remain in effect.
              </p>
            </section>

            <section id="changes" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">17. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. The revised Terms will be posted on this page with an updated effective date. Continued use of the Site or renewal of membership after a change constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section id="governing-law" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">18. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Texas, without regard to conflict-of-law rules. You agree that courts located in Collin County, Texas are the exclusive venue for disputes that cannot be resolved informally, except where applicable law requires otherwise.
              </p>
            </section>

            <section id="contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">19. Contact</h2>
              <p>
                Questions about these Terms may be sent to{" "}
                <a href="mailto:info@communitycommercemelissa.org" className="text-red-700 font-semibold">
                  info@communitycommercemelissa.org
                </a>
                . Community Commerce Melissa, Melissa, Texas 75454.
              </p>
              <p>
                <Link href="/contact" className="text-red-700 font-semibold hover:underline">
                  Visit our contact page
                </Link>
                .
              </p>
            </section>
          </article>
        </div>
      </section>

      <Footer />

      <MemberModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
