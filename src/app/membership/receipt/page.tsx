"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  ArrowRight, 
  QrCode, 
  FileText, 
  Calendar,
  Building2,
  Lock,
  Loader2,
  ExternalLink,
  Smartphone,
  Copy,
  Check
} from "lucide-react";

function ReceiptBadgeContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const paramTier = searchParams.get("tier") || "";

  const [receiptData, setReceiptData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const badgeRef = useRef<HTMLDivElement>(null);

  const getValidThrough = (dateStr?: string) => {
    try {
      const baseDate = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(baseDate.getTime())) {
        const fallback = new Date();
        fallback.setFullYear(fallback.getFullYear() + 1);
        return fallback.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
      }
      const renewalDate = new Date(baseDate);
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
      return renewalDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
    } catch {
      return "AUGUST 2027";
    }
  };

  useEffect(() => {
    async function fetchReceipt() {
      // Handle instant simulated test mode without Stripe API roundtrip
      if (sessionId.startsWith("cs_test_sim_") || searchParams.get("simulated") === "true") {
        setReceiptData({
          id: sessionId || `cs_test_sim_${Date.now()}`,
          customerName: searchParams.get("owner_name") || "Valued Member",
          customerEmail: searchParams.get("email") || "member@example.com",
          businessName: searchParams.get("business_name") || "Melissa Business Leader",
          tier: searchParams.get("tier") || "Community Partner ($390 1st Yr • Renews $490/yr)",
          amount: parseFloat(searchParams.get("amount") || "390"),
          memberId: searchParams.get("member_id") || `CCM-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          isSubscription: true,
          status: "complete",
          isTest: true,
          city: searchParams.get("city") || "Melissa",
          state: searchParams.get("state") || "TX",
        });
        setLoading(false);
        setIsEmailSent(true);
        return;
      }

      if (!sessionId) {
        // Fallback default member data for demo/preview
        setReceiptData({
          id: "cs_live_sample_" + Math.random().toString(36).substring(2, 8),
          customerName: searchParams.get("owner_name") || "Valued Member",
          customerEmail: searchParams.get("email") || "member@example.com",
          businessName: searchParams.get("business_name") || "Melissa Business Leader",
          tier: paramTier || "Community Partner ($390 1st Yr • Renews $490/yr)",
          amount: 390,
          memberId: searchParams.get("member_id") || `CCM-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          isSubscription: true,
          status: "complete",
          isTest: true,
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/get-receipt-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (res.ok && data) {
          setReceiptData(data);
          // Email was already dispatched upon Stripe payment completion
          setIsEmailSent(true);
        }
      } catch (err) {
        console.error("Error fetching receipt session:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [sessionId, paramTier]);

  const handleManualEmailSend = async () => {
    if (!receiptData?.customerEmail) return;
    setIsSendingEmail(true);
    try {
      await fetch("/api/send-badge-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: receiptData.customerEmail,
          businessName: receiptData.businessName,
          ownerName: receiptData.customerName,
          tier: receiptData.tier,
          memberId: receiptData.memberId,
          amount: receiptData.amount,
          city: receiptData.city,
          state: receiptData.state,
          phone: receiptData.phone,
          category: receiptData.category,
          website: receiptData.website,
          sessionId: receiptData.id,
        }),
      });
      setIsEmailSent(true);
    } catch (err) {
      console.error("Error sending badge email:", err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemberId = () => {
    if (receiptData?.memberId) {
      navigator.clipboard.writeText(receiptData.memberId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // High-Resolution Client-side PNG Badge Generator via HTML5 Canvas
  const handleDownloadBadge = () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const cleanTier = receiptData?.tier?.toLowerCase().includes("partner") || receiptData?.isTest
        ? "COMMUNITY PARTNER"
        : receiptData?.tier?.toLowerCase().includes("member")
        ? "COMMUNITY MEMBER"
        : "OFFICIAL CONTRIBUTOR";

      const businessName = (receiptData?.businessName || "MELISSA COMMUNITY MEMBER").toUpperCase();
      const memberId = receiptData?.memberId || "CCM-2026-MEMBER";

      // 1. Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
      bgGrad.addColorStop(0, "#0B0E14");
      bgGrad.addColorStop(0.5, "#151922");
      bgGrad.addColorStop(1, "#0B0E14");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 800);

      // 2. Decorative Outer Border
      ctx.strokeStyle = "#A81C24";
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(46, 46, 1108, 708);

      // 3. Top Ribbon Banner
      const ribbonGrad = ctx.createLinearGradient(0, 70, 0, 150);
      ribbonGrad.addColorStop(0, "#7A141A");
      ribbonGrad.addColorStop(1, "#A81C24");
      ctx.fillStyle = ribbonGrad;
      ctx.fillRect(50, 70, 1100, 90);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("COMMUNITY COMMERCE MELISSA, TX", 600, 125);

      // 4. Subtitle / 501(c)(3)
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("OFFICIAL 501(c)(3) NON-PROFIT BUSINESS MEMBER", 600, 205);

      // 5. Tier Name Banner
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 48px sans-serif";
      ctx.fillText(`2026 ${cleanTier}`, 600, 275);

      // 6. Gold Separator Line
      const lineGrad = ctx.createLinearGradient(300, 0, 900, 0);
      lineGrad.addColorStop(0, "rgba(220, 38, 38, 0)");
      lineGrad.addColorStop(0.5, "rgba(220, 38, 38, 1)");
      lineGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(300, 310);
      ctx.lineTo(900, 310);
      ctx.stroke();

      // 7. Business Name Box
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(150, 350, 900, 140);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.strokeRect(150, 350, 900, 140);

      ctx.fillStyle = "#EF4444";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("OFFICIALLY ISSUED TO:", 600, 385);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(businessName, 600, 445);

      // 8. Footer Info Blocks (Member ID & Valid Thru)
      ctx.fillStyle = "rgba(168, 28, 36, 0.15)";
      ctx.fillRect(150, 530, 420, 160);
      ctx.strokeStyle = "rgba(168, 28, 36, 0.4)";
      ctx.strokeRect(150, 530, 420, 160);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("MEMBER ID NUMBER", 180, 570);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 32px monospace";
      ctx.fillText(memberId, 180, 620);
      ctx.fillStyle = "#22C55E";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("✓ VERIFIED ACTIVE", 180, 660);

      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(630, 530, 420, 160);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.strokeRect(630, 530, 420, 160);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("MEMBERSHIP TERM", 660, 570);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 32px sans-serif";
      ctx.fillText("2026 – 2027", 660, 620);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("Melissa, Collin County, TX", 660, 660);

      // 9. Trigger file download
      const imageUri = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `CCM-Official-Badge-${memberId}.png`;
      downloadLink.href = imageUri;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error("Error exporting badge image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-red-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-800">Generating Your Verified Member Receipt & Badge...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cleanTierDisplay = receiptData?.tier?.includes("Partner") || receiptData?.isTest
    ? "Community Partner"
    : receiptData?.tier?.includes("Member")
    ? "Community Member"
    : "Community Contributor";

  return (
    <div className="min-h-screen bg-[#E5E9EE] flex flex-col font-sans">
      <PageTitle title={`Receipt & Official Member Badge — ${receiptData?.businessName || "Community Commerce Melissa"}`} />

      {/* Print CSS Stylesheet for Dedicated Landscape Certificate */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: letter landscape;
            margin: 0.2in !important;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 8in !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .screen-only {
            display: none !important;
          }
          #printable-certificate {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 10.4in !important;
            max-height: 7.7in !important;
            margin: 0 auto !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            break-before: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      {/* Screen Wrapper (Hidden during Print) */}
      <div className="screen-only flex flex-col min-h-screen">
        <Navbar />

        {/* Top Banner */}
        <section className="bg-[#0B0E14] text-white py-12 border-b border-white/10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              PAYMENT CONFIRMED & VERIFIED
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit uppercase tracking-tight text-white">
              WELCOME TO <span className="text-red-500">COMMUNITY COMMERCE</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Thank you for investing in Melissa. Your digital membership badge and official payment receipt are generated below.
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="py-12 bg-[#E5E9EE] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-300 shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-outfit font-extrabold text-sm sm:text-base text-slate-900 uppercase">
                  Digital Member Toolkit & Badge
                </h3>
                <p className="text-xs text-slate-500">
                  Member ID: <strong className="text-slate-800 font-mono">{receiptData?.memberId}</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleDownloadBadge}
                disabled={isDownloading}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition hover:scale-105"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-slate-300" />}
                <span>Download Badge (PNG)</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Certificate</span>
              </button>

              <button
                onClick={handleManualEmailSend}
                disabled={isSendingEmail}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
                  isEmailSent 
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                    : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs"
                }`}
              >
                {isSendingEmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEmailSent ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Mail className="w-4 h-4 text-slate-600" />
                )}
                <span>{isEmailSent ? "Badge Emailed" : "Email Badge"}</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Badge (Left) & Receipt (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 7 COLS: HIGH-RES DIGITAL BADGE CARD */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge Preview Box */}
              <div 
                ref={badgeRef}
                className="bg-[#0B0E14] text-white rounded-3xl p-6 sm:p-8 border-4 border-[#A81C24] shadow-2xl relative overflow-hidden ring-4 ring-black/20"
              >
                {/* Background Cardinal Watermark Accent */}
                <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Badge Top Header */}
                <div className="border-b border-white/10 pb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/ccm-logo-transparent.png"
                      alt="CCM Logo"
                      className="h-12 w-auto object-contain drop-shadow"
                    />
                    <div>
                      <div className="font-outfit font-extrabold text-sm sm:text-base tracking-wider uppercase text-white">
                        COMMUNITY COMMERCE MELISSA
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span>MELISSA, TEXAS</span>
                        <span className="w-1 h-1 rounded-full bg-red-500" />
                        <span className="text-red-400">501(c)(3) MEMBER</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-950 via-[#A81C24] to-red-900 border border-red-500/50 rounded-xl px-3 py-1.5 text-center shadow">
                    <div className="text-[9px] font-black text-slate-200 uppercase tracking-wider">OFFICIAL</div>
                    <div className="text-xs font-black text-white uppercase tracking-tight">2026–2027</div>
                  </div>
                </div>

                {/* Main Badge Body */}
                <div className="py-8 text-center space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    CERTIFIED BUSINESS MEMBER
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      MEMBERSHIP LEVEL
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-outfit uppercase tracking-tight text-white">
                      {cleanTierDisplay}
                    </h2>
                  </div>

                  {/* Business Name Display */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-lg mx-auto shadow-inner">
                    <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                      PROUDLY ISSUED TO:
                    </div>
                    <div className="text-xl sm:text-2xl font-black font-outfit text-white uppercase mt-0.5">
                      {receiptData?.businessName || "Melissa Business Member"}
                    </div>
                    {receiptData?.customerName && (
                      <div className="text-xs text-slate-300 mt-1 font-medium">
                        Representative: {receiptData.customerName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge Bottom Footer */}
                <div className="border-t border-white/10 pt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">MEMBER ID</div>
                    <div className="font-mono font-bold text-white text-sm mt-0.5">{receiptData?.memberId}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">VALID THROUGH</div>
                    <div className="font-bold text-white text-sm mt-0.5">{getValidThrough(receiptData?.date)}</div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end gap-2 text-emerald-400 font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] uppercase tracking-wider">Active Verified</span>
                  </div>
                </div>
              </div>

              {/* Digital Badge Usage Instructions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm space-y-3 print:hidden">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-red-600" />
                  HOW TO DISPLAY YOUR DIGITAL BADGE:
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                  <li><strong>Website Footer & Header:</strong> Place your official 2026 member badge PNG on your website to build trust with local customers.</li>
                  <li><strong>Email Signatures:</strong> Add your Member ID and badge to your business email signature.</li>
                  <li><strong>Storefront Decal / Frame:</strong> Print the certificate to display at your physical retail counter or office reception desk.</li>
                  <li><strong>Social Media:</strong> Announce your Community Commerce Melissa membership on LinkedIn, Facebook, and Instagram.</li>
                </ul>
              </div>

            </div>

            {/* RIGHT 5 COLS: OFFICIAL PAYMENT RECEIPT & DETAILS */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Receipt Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-lg space-y-6">
                
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                  <div>
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase px-2.5 py-1 rounded">
                      OFFICIAL RECEIPT
                    </span>
                    <h3 className="font-outfit font-extrabold text-xl text-slate-900 uppercase mt-1">
                      PAYMENT SUMMARY
                    </h3>
                  </div>
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Billed To:</span>
                    <span className="font-bold text-slate-900 text-right">{receiptData?.businessName}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Contact Name:</span>
                    <span className="font-bold text-slate-900">{receiptData?.customerName}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Email Address:</span>
                    <span className="font-bold text-slate-900">{receiptData?.customerEmail}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Date Paid:</span>
                    <span className="font-bold text-slate-900">{receiptData?.date}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Membership Level:</span>
                    <span className="font-bold text-red-700">{cleanTierDisplay}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Billing Term:</span>
                    <span className="font-bold text-slate-900">
                      {receiptData?.isSubscription ? "Annual Auto-Renewing" : "One-Time Contribution"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Payment Processor:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      Stripe 256-Bit SSL
                    </span>
                  </div>

                  {/* Total Paid Highlight */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between mt-4">
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase">AMOUNT PAID TODAY</div>
                      <div className="text-xs text-slate-600">Tax-Deductible 501(c)(3)</div>
                    </div>
                    <div className="text-2xl font-black font-outfit text-slate-900">
                      ${receiptData?.amount?.toFixed(2) || "390.00"}
                    </div>
                  </div>
                </div>

                {/* Member ID Copy Box */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">MEMBER VERIFICATION NUMBER</div>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 flex-1">
                      {receiptData?.memberId}
                    </div>
                    <button
                      onClick={handleCopyMemberId}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Next Steps Card */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2 text-xs text-red-950">
                  <div className="font-bold flex items-center gap-1.5 uppercase text-[11px] text-red-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    NEXT STEPS & MEMBER WELCOME:
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Your membership details and business information are securely saved in our database. Check your email for your digital badge confirmation and calendar invites for upcoming member networking events.
                  </p>
                </div>

                {/* Quick Link Navigation */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <Link
                    href="/directory"
                    className="w-full sm:w-auto btn-red px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
                  >
                    <span>View Business Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/events"
                    className="w-full sm:w-auto text-xs font-bold text-slate-700 hover:text-slate-900 py-2 text-center"
                  >
                    Explore Events Calendar →
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>

    {/* EXCLUSIVE PRINTABLE CERTIFICATE (ONLY VISIBLE ON PAPER / PRINT PREVIEW) */}
    <div id="printable-certificate" className="hidden">
      <div
        style={{
          width: "100%",
          maxWidth: "10.2in",
          margin: "0 auto",
          padding: "20px 30px",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          fontFamily: "'Outfit', 'Georgia', serif",
          boxSizing: "border-box",
          position: "relative",
          border: "8px solid #A81C24",
          outline: "2.5px solid #D97706",
          outlineOffset: "-6px",
        }}
      >
        <div
          style={{
            border: "1px solid #B45309",
            padding: "16px 24px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Header & Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              marginBottom: "8px",
            }}
          >
            <img
              src="/ccm-logo-transparent.png"
              alt="CCM Logo"
              style={{ height: "48px", width: "auto" }}
            />
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "900",
                  letterSpacing: "1.5px",
                  color: "#A81C24",
                  textTransform: "uppercase",
                }}
              >
                Community Commerce Melissa
              </div>
              <div
                style={{
                  fontSize: "9.5px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#475569",
                  textTransform: "uppercase",
                }}
              >
                Melissa, Collin County, Texas • 501(c)(3) Non-Profit Organization
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div style={{ margin: "10px 0 8px 0" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "3px",
                color: "#D97706",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              ★ OFFICIAL MEMBERSHIP CREDENTIAL ★
            </div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "900",
                letterSpacing: "1.5px",
                color: "#0f172a",
                textTransform: "uppercase",
                margin: 0,
                fontFamily: "'Georgia', serif",
              }}
            >
              Certificate of Membership
            </h1>
          </div>

          {/* Recipient Presentation */}
          <p
            style={{
              fontSize: "13px",
              fontStyle: "italic",
              color: "#64748b",
              margin: "8px 0 4px 0",
            }}
          >
            This official certificate is proudly presented to
          </p>

          <div
            style={{
              fontSize: "26px",
              fontWeight: "900",
              color: "#A81C24",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "6px 0",
              borderBottom: "2px solid #CBD5E1",
              paddingBottom: "4px",
              display: "inline-block",
              minWidth: "60%",
            }}
          >
            {receiptData?.businessName || "Melissa Business Member"}
          </div>

          <p
            style={{
              fontSize: "13px",
              color: "#334155",
              maxWidth: "640px",
              margin: "8px auto",
              lineHeight: "1.4",
            }}
          >
            in recognition of active investment and certified standing in{" "}
            <strong>Community Commerce Melissa</strong> at the official membership level of
          </p>

          <div
            style={{
              display: "inline-block",
              backgroundColor: "#FEF2F2",
              border: "1.5px solid #F87171",
              borderRadius: "9999px",
              padding: "4px 20px",
              margin: "4px 0 10px 0",
            }}
          >
            <span
              style={{
                fontSize: "15px",
                fontWeight: "900",
                color: "#991B1B",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              {cleanTierDisplay}
            </span>
          </div>

          <p
            style={{
              fontSize: "11px",
              color: "#64748b",
              maxWidth: "580px",
              margin: "0 auto 12px auto",
              fontStyle: "italic",
            }}
          >
            Dedicated to promoting local commerce, economic development, community collaboration, and sustainable civic leadership in Melissa, Texas.
          </p>

          {/* Footer Credentials & Signatures */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              borderTop: "1px solid #E2E8F0",
              paddingTop: "12px",
              marginTop: "8px",
              fontSize: "10.5px",
            }}
          >
            <div style={{ textAlign: "left", width: "30%" }}>
              <div
                style={{
                  fontWeight: "bold",
                  color: "#64748b",
                  fontSize: "8.5px",
                  textTransform: "uppercase",
                }}
              >
                MEMBER ID NUMBER
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  fontSize: "13px",
                  color: "#0f172a",
                  marginTop: "1px",
                }}
              >
                {receiptData?.memberId}
              </div>
              <div
                style={{
                  color: "#16A34A",
                  fontWeight: "bold",
                  fontSize: "9.5px",
                  marginTop: "1px",
                }}
              >
                ✓ VERIFIED ACTIVE MEMBER
              </div>
            </div>

            {/* Seal */}
            <div style={{ textAlign: "center", width: "35%" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  border: "2px dashed #D97706",
                  backgroundColor: "#FFFBEB",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#B45309",
                  fontWeight: "900",
                  fontSize: "8.5px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  lineHeight: "1.1",
                  margin: "0 auto",
                }}
              >
                OFFICIAL<br />SEAL
              </div>
              <div
                style={{
                  fontSize: "8.5px",
                  color: "#64748b",
                  marginTop: "2px",
                  fontWeight: "bold",
                }}
              >
                TERM: 2026 – 2027
              </div>
            </div>

            <div style={{ textAlign: "right", width: "30%" }}>
              <div
                style={{
                  borderBottom: "1px solid #0f172a",
                  width: "140px",
                  marginLeft: "auto",
                  marginBottom: "3px",
                  height: "16px",
                }}
              />
              <div
                style={{
                  fontWeight: "bold",
                  color: "#0f172a",
                  fontSize: "9.5px",
                }}
              >
                Executive Board
              </div>
              <div style={{ color: "#64748b", fontSize: "8.5px" }}>
                Community Commerce Melissa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default function MembershipReceiptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>}>
      <ReceiptBadgeContent />
    </Suspense>
  );
}
