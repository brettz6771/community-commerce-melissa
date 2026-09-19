"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Smartphone } from "lucide-react";
import { toBadgeRenderData } from "@/lib/member-badge";
import { renderBadgePngDataUrl } from "@/lib/member-badge-canvas";

export default function SaveBadgePage() {
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/member-portal/me", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (data?.status !== "ok" || !data.member) {
          if (!cancelled) {
            setError(data?.status === "membership_required" ? "membership_required" : "guest");
            setLoading(false);
          }
          return;
        }
        const url = renderBadgePngDataUrl(toBadgeRenderData(data.member));
        if (!cancelled) {
          setImageUrl(url);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("failed");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error === "guest" || error === "membership_required") {
    return (
      <div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="font-outfit font-extrabold text-xl uppercase">Sign in required</h1>
          <p className="text-sm text-slate-600">
            {error === "membership_required"
              ? "An active membership is required to save a badge."
              : "Open the member portal and sign in first."}
          </p>
          <Link href="/member-portal" className="inline-block btn-red px-5 py-2.5 rounded-xl text-xs font-bold uppercase">
            Go to member portal
          </Link>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="min-h-screen bg-[#E5E9EE] flex items-center justify-center p-6">
        <p className="text-sm text-slate-600">Could not prepare the badge image.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="screen-only max-w-3xl mx-auto px-4 py-4 space-y-3">
        <Link href="/member-portal" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <ArrowLeft className="w-4 h-4" />
          Back to portal
        </Link>
        <div className="flex items-start gap-2 text-sm text-slate-200">
          <Smartphone className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p>
            <strong>iPhone:</strong> touch and hold the badge, then tap <strong>Add to Photos</strong> or <strong>Save Image</strong>.
            {" "}
            <strong>Android:</strong> tap and hold, or use the browser download control.
          </p>
        </div>
        <a
          href={imageUrl}
          download="CCM-Official-Badge.png"
          className="inline-block bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold uppercase"
        >
          Download PNG
        </a>
      </div>
      <img
        src={imageUrl}
        alt="Official Community Commerce Melissa member badge"
        className="block w-full max-w-5xl mx-auto h-auto"
      />
    </div>
  );
}
