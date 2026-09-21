import { NextResponse } from "next/server";
import { getDirectoryMemberByEmail, isMemberDirectoryConfigured, setDirectoryMemberPassword } from "@/lib/db";
import { hashMemberPassword, validateMemberPassword } from "@/lib/member-password";
import { createSessionToken, normalizeMemberEmail, readInviteToken } from "@/lib/member-portal-auth";
import { toMemberPortalRecord } from "@/lib/member-portal";
import { memberJson, withSessionCookie } from "@/lib/member-portal-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isMemberDirectoryConfigured()) {
      return NextResponse.json({ error: "Member portal storage is not configured." }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const invite = readInviteToken(String(body?.token || ""));
    if (!invite) {
      return NextResponse.json({ error: "This invite link is invalid or has expired." }, { status: 401 });
    }

    const passwordError = validateMemberPassword(body?.password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const confirm = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";
    if (confirm && confirm !== body.password) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const row = await getDirectoryMemberByEmail(invite.email);
    if (!row || row.isActive === false || !row.id) {
      return NextResponse.json({
        status: "membership_required",
        error: "An active membership is required to create this account.",
      }, { status: 403 });
    }

    const passwordHash = await hashMemberPassword(String(body.password));
    const updated = await setDirectoryMemberPassword(Number(row.id), passwordHash);
    const member = toMemberPortalRecord(updated || row);
    const response = NextResponse.json({
      status: "logged_in",
      message: "Account created. Your member badge is ready.",
      member: memberJson(member),
    });
    return withSessionCookie(
      response,
      createSessionToken(normalizeMemberEmail(member.email), Number(member.id))
    );
  } catch (error) {
    console.error("Member invite accept error:", error);
    return NextResponse.json({ error: "Could not create the portal account." }, { status: 500 });
  }
}
