import { NextResponse } from "next/server";
import {
  getDirectoryMemberByEmail,
  isMemberDirectoryConfigured,
  saveDirectoryMember,
} from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { escapeHtml, isValidEmail } from "@/lib/html";
import { createInviteToken } from "@/lib/member-portal-auth";
import { isInternalAuthorized } from "@/lib/internal-auth";
import { getConfiguredSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const inviteRateLimit = new Map<string, number>();
const INVITE_COOLDOWN_MS = 20_000;

export async function POST(request: Request) {
  try {
    if (!isInternalAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isMemberDirectoryConfigured()) {
      return NextResponse.json(
        { error: "Member portal storage is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const businessName = String(body?.businessName || "").trim();
    const ownerName = String(body?.ownerName || "").trim();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter the member email to invite." }, { status: 400 });
    }

    let row = await getDirectoryMemberByEmail(email);
    if ((!row || !row.id) && businessName) {
      await saveDirectoryMember({
        businessName,
        ownerName,
        email,
        category: String(body?.category || "General Business / Other"),
        phone: String(body?.phone || ""),
        website: String(body?.website || ""),
        city: String(body?.city || "Melissa"),
        state: String(body?.state || "TX"),
        description: String(body?.description || "Community Commerce Melissa member."),
      });
      row = await getDirectoryMemberByEmail(email);
    }

    if (!row || row.isActive === false || !row.id) {
      return NextResponse.json(
        {
          error:
            "No active membership found for that email. Add the business name to create their portal record, then send the invite.",
        },
        { status: 404 }
      );
    }

    const lastSent = inviteRateLimit.get(email) || 0;
    if (Date.now() - lastSent < INVITE_COOLDOWN_MS) {
      return NextResponse.json({ error: "An invite was just sent. Wait a moment and try again." }, { status: 429 });
    }

    const token = createInviteToken(email);
    const siteUrl = getConfiguredSiteUrl();
    const acceptUrl = `${siteUrl}/member-portal/accept?token=${encodeURIComponent(token)}`;
    const greeting = escapeHtml(row.ownerName || row.businessName || "there");

    const emailResult = await sendEmail({
      to: email,
      subject: "Create your Community Commerce Melissa member account",
      html: `
        <p>Hello ${greeting},</p>
        <p>Your Community Commerce Melissa membership is ready for a portal account. Use the link below to set a password. Your official member badge is already linked to this email.</p>
        <p><a href="${escapeHtml(acceptUrl)}">Set your password and open the member portal</a></p>
        <p>This invite expires in 14 days. If you did not expect it, you can ignore this email.</p>
      `,
      text: `Create your Community Commerce Melissa portal account: ${acceptUrl}`,
    });

    inviteRateLimit.set(email, Date.now());

    const payload: Record<string, unknown> = {
      status: "invited",
      email,
      businessName: row.businessName,
      message: "Invite sent. The member can set a password and the badge will appear automatically.",
    };

    if (process.env.NODE_ENV !== "production") {
      payload.inviteUrl = `/member-portal/accept?token=${encodeURIComponent(token)}`;
      if (!emailResult.success) {
        payload.emailNotice = emailResult.error || "Email was not sent in this environment.";
      }
    } else if (!emailResult.success) {
      return NextResponse.json(
        { error: "The invite could not be emailed. Try again or share the portal link after email is configured." },
        { status: 503 }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Member invite error:", error);
    return NextResponse.json({ error: "Could not send the member invite." }, { status: 500 });
  }
}
