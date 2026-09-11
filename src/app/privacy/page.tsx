"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import LaunchBanner from "@/components/LaunchBanner";
import PageTitle from "@/components/PageTitle";
import { CONTACT_EMAIL, LEGAL_EFFECTIVE_DATE, ORG_LOCATION } from "@/lib/legal";
import { Shield } from "lucide-react";

const SECTIONS = [
  { id: "who-we-are", title: "1. Who We Are" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Information" },
  { id: "third-parties", title: "4. Third-Party Providers" },
  { id: "payments", title: "5. Payments" },
  { id: "directory", title: "6. Public Directory Information" },
  { id: "cookies", title: "7. Cookies and Analytics" },
  { id: "retention", title: "8. Retention" },
  { id: "sharing", title: "9. Sharing" },
  { id: "requests", title: "10. Privacy Requests" },
  { id: "children", title: "11. Children" },
  { id: "security", title: "12. Security" },
  { id: "changes", title: "13. Changes" },
  { id: "contact", title: "14. Contact" },
];

export default function PrivacyPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title="Privacy Policy" />
      <LaunchBanner onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <section className="bg-[#0B0E14] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/10 border border-slate-300/30 text-slate-200 font-bold text-xs uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              Privacy
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight">
              Privacy <span className="text-slate-200">Policy</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              This policy explains what Community Commerce Melissa collects through this website, how we use it, who we share it with, and how you can make a request.
            </p>
            <p className="text-xs text-slate-400">Effective date: {LEGAL_EFFECTIVE_DATE}</p>
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
            <section id="who-we-are" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">1. Who We Are</h2>
              <p>
                Community Commerce Melissa (&ldquo;CCM,&rdquo; &ldquo;we,&rdquo; or &ldquo;us&rdquo;) is a Texas 501(c)(3) non-profit organization serving Melissa, Texas. This Privacy Policy applies to communitycommercemelissa.org and related forms, checkout pages, emails, and member tools.
              </p>
              <p>
                This policy is a general description of our current website practices. It is not legal advice. If our practices change, we will update this page.
              </p>
            </section>

            <section id="information-we-collect" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">2. Information We Collect</h2>
              <p>Depending on how you use the Site, we may collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Contact and identity information:</strong> first and last name, email address, phone number, and company or organization name.
                </li>
                <li>
                  <strong>Business and directory information:</strong> business name, category, description, website, city, state, owner or contact name, and related listing details.
                </li>
                <li>
                  <strong>Membership and program information:</strong> selected membership tier, application notes, and membership status.
                </li>
                <li>
                  <strong>Event RSVPs:</strong> attendee name, email, phone, company, guest count, and the event you selected.
                </li>
                <li>
                  <strong>Donor information:</strong> name, email, optional company or family fund, optional dedication or program note, and donation amount.
                </li>
                <li>
                  <strong>Newsletter subscriptions:</strong> name, email, and, when provided, business name.
                </li>
                <li>
                  <strong>Volunteer, sponsorship, contact, and feedback submissions:</strong> the fields you enter on those forms.
                </li>
                <li>
                  <strong>Payment information:</strong> Stripe processes card and payment details. We receive confirmation data such as email, amount, payment status, and Stripe identifiers. We do not store full card numbers on our servers.
                </li>
                <li>
                  <strong>Technical information:</strong> basic server logs that may include IP address, browser type, and pages requested, generated in the ordinary operation of hosting this website.
                </li>
              </ul>
            </section>

            <section id="how-we-use" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">3. How We Use Information</h2>
              <p>We use this information to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Respond to inquiries and administer membership, donations, events, volunteering, and sponsorships</li>
                <li>Process payments and send receipts, acknowledgments, and operational emails</li>
                <li>Publish and maintain directory listings and membership badges while a membership is active</li>
                <li>Send newsletters and community updates you requested, and allow you to unsubscribe from marketing emails</li>
                <li>Improve the Site, prevent abuse, and keep records needed for nonprofit, tax, and legal purposes</li>
              </ul>
            </section>

            <section id="third-parties" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">4. Third-Party Providers</h2>
              <p>We use service providers to operate the Site, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Stripe</strong> for membership subscriptions, donations, and related payment processing
                </li>
                <li>
                  <strong>Resend and/or SendGrid</strong> to send operational and newsletter emails
                </li>
                <li>
                  Website hosting, database, and related infrastructure providers that store form submissions and member records
                </li>
              </ul>
              <p>
                Those providers process information on our behalf or as independent controllers under their own terms and privacy policies. We do not control Stripe&apos;s or an email provider&apos;s independent practices.
              </p>
            </section>

            <section id="payments" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">5. Payments</h2>
              <p>
                When you pay through Stripe Checkout, Stripe collects the payment details needed to complete the charge. We receive limited payment metadata so we can record the transaction, activate membership benefits, and issue acknowledgments. Tax treatment of a payment is described in our{" "}
                <Link href="/terms#tax" className="text-red-700 font-semibold hover:underline">
                  Terms of Service
                </Link>
                ; this Privacy Policy does not determine deductibility.
              </p>
            </section>

            <section id="directory" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">6. Public Directory Information</h2>
              <p>
                If you join as a Community Partner, business listing fields (such as business name, category, description, city, state, website, and phone) may be published in the public directory while membership is active. Directory listings and badges end when membership expires or is terminated. Do not submit information you do not want displayed publicly as part of a listing.
              </p>
            </section>

            <section id="cookies" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">7. Cookies and Analytics</h2>
              <p>
                The Site uses cookies and similar technologies that are needed to operate the website and payment checkout, including cookies set by Stripe during checkout. We do not currently operate a separate advertising or analytics cookie program (such as Google Analytics) on this Site. If we add analytics or marketing cookies later, we will update this policy.
              </p>
            </section>

            <section id="retention" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">8. Retention</h2>
              <p>
                We keep contact, membership, donation, RSVP, and payment records for as long as needed to operate our programs, maintain financial and tax records, resolve disputes, and meet legal obligations. Newsletter records are kept until you unsubscribe or we delete them in response to a valid request, unless we must retain a copy for legal or operational reasons. Public directory listings are removed from the public directory when membership is no longer active.
              </p>
            </section>

            <section id="sharing" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">9. Sharing</h2>
              <p>
                We do not sell your personal information. We share information with service providers who help us operate the Site, with the public when you ask us to publish a directory listing, and when required by law, to protect CCM or others, or in connection with an organizational transition. Volunteer board members and authorized staff may access records as needed to run the organization.
              </p>
            </section>

            <section id="requests" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">10. Privacy Requests</h2>
              <p>
                To ask what information we hold about you, request a correction, request deletion, or unsubscribe from marketing emails, contact{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-red-700 font-semibold">
                  {CONTACT_EMAIL}
                </a>
                . We may need to verify your request. We may decline or limit a request where we must keep records for membership administration, donations, tax, security, or other legal reasons. You may also unsubscribe from newsletter emails using the unsubscribe method in those messages.
              </p>
            </section>

            <section id="children" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">11. Children</h2>
              <p>
                The Site is intended for adults. You must be at least 18 years old to join as a member, donate, or submit website forms. We do not knowingly collect personal information from children through membership, donation, or newsletter forms. Event photography involving identifiable minors is addressed in our Terms and may require separate consent.
              </p>
            </section>

            <section id="security" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">12. Security</h2>
              <p>
                We use reasonable administrative and technical measures to protect information, including HTTPS and Stripe-hosted checkout for payments. No method of transmission or storage is completely secure.
              </p>
            </section>

            <section id="changes" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">13. Changes</h2>
              <p>
                We may update this Privacy Policy from time to time. The revised policy will be posted on this page with an updated effective date.
              </p>
            </section>

            <section id="contact" className="scroll-mt-28 space-y-3">
              <h2 className="text-xl font-extrabold font-outfit uppercase text-slate-900">14. Contact</h2>
              <p>
                Privacy questions and requests:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-red-700 font-semibold">
                  {CONTACT_EMAIL}
                </a>
                . Community Commerce Melissa, {ORG_LOCATION}.
              </p>
              <p>
                Related:{" "}
                <Link href="/terms" className="text-red-700 font-semibold hover:underline">
                  Terms of Service
                </Link>
                {" · "}
                <Link href="/contact" className="text-red-700 font-semibold hover:underline">
                  Contact page
                </Link>
                .
              </p>
            </section>
          </article>
        </div>
      </section>

      <Footer />

      <MemberModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
    </div>
  );
}
