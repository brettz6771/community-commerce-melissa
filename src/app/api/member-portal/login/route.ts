import { NextResponse } from "next/server";
import { getDirectoryMemberByEmail, isMemberDirectoryConfigured } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { escapeHtml, isValidEmail } from "@/lib/html";
import { resolveMemberId } from "@/lib/member-badge";
import {
  createOtpToken,
  createSessionToken,
  generateOtpCode,
  memberIdsMatch,
  normalizeMemberEmail,
  normalizeMemberId,
} from "@/lib/member-portal-auth";
import { memberJson, withOtpCookie, withSessionCookie } from "@/lib/member-portal-session";
import { toMemberPortalRecord } from "@/lib/member-portal";
import { getConfiguredSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const otpRateLimit = new Map<string, number>();
const OTP_COOLDOWN_MS = 45_000;

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
    const memberId = normalizeMemberId(body?.memberId);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter the email address on your membership." }, { status: 400 });
    }

    const row = await getDirectoryMemberByEmail(email);
    if (!row || row.isActive === false || !row.id) {
      return NextResponse.json({
        status: "membership_required",
        message: "An active Community Commerce Melissa membership is required to use this portal.",
      });
    }

    const member = toMemberPortalRecord(row);
    const storedMemberId = resolveMemberId(member);

    if (memberId && memberIdsMatch(storedMemberId, memberId)) {
      const response = NextResponse.json({
        status: "logged_in",
        member: memberJson(member),
      });
      return withSessionCookie(response, createSessionToken(member.email, Number(member.id)));
    }

    if (memberId) {
      return NextResponse.json(
        { error: "That member ID does not match this email. Leave it blank to receive a sign-in code." },
        { status: 401 }
      );
    }

    const lastSent = otpRateLimit.get(email) || 0;
    if (Date.now() - lastSent < OTP_COOLDOWN_MS) {
      return NextResponse.json(
        { error: "A sign-in code was just sent. Wait a moment and try again." },
        { status: 429 }
      );
    }

    const code = generateOtpCode();
    const otpToken = createOtpToken(email, code);
    const siteUrl = getConfiguredSiteUrl();
    const portalUrl = `${siteUrl}/member-portal`;

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Community Commerce Melissa portal sign-in code",
      html: `
        <p>Hello ${escapeHtml(member.ownerName || member.businessName)},</p>
        <p>Use this one-time code to open your member portal:</p>
        <p style="font-size:28px;font-weight:800;letter-spacing:4px;font-family:monospace">${escapeHtml(code)}</p>
        <p>This code expires in 15 minutes. If you did not request it, you can ignore this email.</p>
        <p><a href="${escapeHtml(portalUrl)}">Return to the member portal</a></p>
      `,
      text: `Your Community Commerce Melissa portal sign-in code is ${code}. It expires in 15 minutes.`,
    });

    otpRateLimit.set(email, Date.now());

    const payload: Record<string, unknown> = {
      status: "code_sent",
      message: "If this email belongs to an active member, a sign-in code is on its way.",
    };

    if (process.env.NODE_ENV !== "production") {
      payload.debugCode = code;
      if (!emailResult.success) {
        payload.emailNotice = emailResult.error || "Email was not sent in this environment.";
      }
    } else if (!emailResult.success) {
      return NextResponse.json(
        { error: "We could not send a sign-in code. Try again, or sign in with your Member ID." },
        { status: 503 }
      );
    }

    return withOtpCookie(NextResponse.json(payload), otpToken);
  } catch (error) {
    console.error("Member portal login error:", error);
    return NextResponse.json({ error: "Could not start member sign-in." }, { status: 500 });
  }
}
