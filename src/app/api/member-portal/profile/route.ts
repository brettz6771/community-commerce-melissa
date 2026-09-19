import { NextResponse } from "next/server";
import { updateDirectoryMemberProfile } from "@/lib/db";
import { toMemberPortalRecord, validateMemberProfile } from "@/lib/member-portal";
import { createSessionToken } from "@/lib/member-portal-auth";
import { memberJson, resolvePortalAuth, withSessionCookie } from "@/lib/member-portal-session";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const auth = await resolvePortalAuth(request);
  if (auth.status === "guest") {
    return NextResponse.json({ status: "guest", error: "Sign in to edit your profile." }, { status: 401 });
  }
  if (auth.status === "membership_required") {
    return NextResponse.json({
      status: "membership_required",
      error: "An active membership is required to edit this profile.",
    }, { status: 403 });
  }
  if (auth.status !== "ok") {
    return NextResponse.json({ error: "Member portal is unavailable." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = validateMemberProfile(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Please correct the highlighted fields.", errors: parsed.errors }, { status: 400 });
  }

  try {
    const updated = await updateDirectoryMemberProfile(Number(auth.member.id), parsed.value);
    if (!updated) {
      return NextResponse.json({ error: "Could not save your profile. Try again." }, { status: 500 });
    }

    const member = toMemberPortalRecord(updated);
    const response = NextResponse.json({
      status: "ok",
      message: "Profile saved.",
      member: memberJson(member),
    });

    if (member.email !== auth.member.email) {
      return withSessionCookie(response, createSessionToken(member.email, Number(member.id)));
    }
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_IN_USE") {
      return NextResponse.json(
        { error: "That email is already used by another member listing.", errors: { email: "Email is already in use." } },
        { status: 409 }
      );
    }
    console.error("Member portal profile error:", error);
    return NextResponse.json({ error: "Could not save your profile." }, { status: 500 });
  }
}
