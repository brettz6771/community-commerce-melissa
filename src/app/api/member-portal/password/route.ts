import { NextResponse } from "next/server";
import { getDirectoryMemberById, setDirectoryMemberPassword } from "@/lib/db";
import { hashMemberPassword, memberHasPassword, validateMemberPassword, verifyMemberPassword } from "@/lib/member-password";
import { toMemberPortalRecord } from "@/lib/member-portal";
import { memberJson, resolvePortalAuth } from "@/lib/member-portal-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await resolvePortalAuth(request);
  if (auth.status === "guest") {
    return NextResponse.json({ status: "guest", error: "Sign in to set a password." }, { status: 401 });
  }
  if (auth.status === "membership_required") {
    return NextResponse.json({
      status: "membership_required",
      error: "An active membership is required.",
    }, { status: 403 });
  }
  if (auth.status !== "ok") {
    return NextResponse.json({ error: "Member portal is unavailable." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const passwordError = validateMemberPassword(body?.password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  const confirm = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";
  if (confirm && confirm !== body.password) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const current = await getDirectoryMemberById(Number(auth.member.id));
  if (memberHasPassword(current)) {
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const matches = await verifyMemberPassword(currentPassword, current?.passwordHash);
    if (!matches) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
  }

  const passwordHash = await hashMemberPassword(String(body.password));
  const updated = await setDirectoryMemberPassword(Number(auth.member.id), passwordHash);
  if (!updated) {
    return NextResponse.json({ error: "Could not save the password." }, { status: 500 });
  }

  return NextResponse.json({
    status: "ok",
    message: memberHasPassword(current) ? "Password updated." : "Password saved. You can use it the next time you sign in.",
    member: memberJson(toMemberPortalRecord(updated)),
  });
}
