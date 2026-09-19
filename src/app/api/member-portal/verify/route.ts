import { NextResponse } from "next/server";
import { getDirectoryMemberByEmail, isMemberDirectoryConfigured } from "@/lib/db";
import { isValidEmail } from "@/lib/html";
import {
  bumpOtpAttempts,
  createSessionToken,
  normalizeMemberEmail,
  readOtpFromCookieHeader,
  verifyOtpAttempt,
} from "@/lib/member-portal-auth";
import { memberJson, withOtpCookie, withSessionCookie } from "@/lib/member-portal-session";
import { toMemberPortalRecord } from "@/lib/member-portal";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isMemberDirectoryConfigured()) {
      return NextResponse.json(
        { status: "unavailable", error: "Member portal storage is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = normalizeMemberEmail(body?.email);
    const code = String(body?.code || "").trim();

    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Enter your email and the 6-digit sign-in code." }, { status: 400 });
    }

    const otp = readOtpFromCookieHeader(request.headers.get("cookie"));
    if (!otp) {
      return NextResponse.json({ error: "Your sign-in code expired. Request a new code." }, { status: 401 });
    }

    const attempt = verifyOtpAttempt(otp, email, code);
    if (!attempt.ok) {
      if (attempt.reason === "too_many") {
        return NextResponse.json({ error: "Too many incorrect codes. Request a new sign-in code." }, { status: 401 });
      }
      const response = NextResponse.json({ error: "That sign-in code is incorrect." }, { status: 401 });
      return withOtpCookie(response, bumpOtpAttempts(otp));
    }

    const row = await getDirectoryMemberByEmail(email);
    if (!row || row.isActive === false || !row.id) {
      return NextResponse.json({
        status: "membership_required",
        message: "An active Community Commerce Melissa membership is required to use this portal.",
      });
    }

    const member = toMemberPortalRecord(row);
    const response = NextResponse.json({
      status: "logged_in",
      member: memberJson(member),
    });
    return withSessionCookie(response, createSessionToken(member.email, Number(member.id)));
  } catch (error) {
    console.error("Member portal verify error:", error);
    return NextResponse.json({ error: "Could not verify sign-in code." }, { status: 500 });
  }
}
