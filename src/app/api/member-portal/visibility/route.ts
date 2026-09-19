import { NextResponse } from "next/server";
import { updateDirectoryMemberVisibility } from "@/lib/db";
import { parseVisibility, toMemberPortalRecord } from "@/lib/member-portal";
import { memberJson, resolvePortalAuth } from "@/lib/member-portal-session";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const auth = await resolvePortalAuth(request);
  if (auth.status === "guest") {
    return NextResponse.json({ status: "guest", error: "Sign in to update directory visibility." }, { status: 401 });
  }
  if (auth.status === "membership_required") {
    return NextResponse.json({
      status: "membership_required",
      error: "An active membership is required to update directory visibility.",
    }, { status: 403 });
  }
  if (auth.status !== "ok") {
    return NextResponse.json({ error: "Member portal is unavailable." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = parseVisibility(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = await updateDirectoryMemberVisibility(Number(auth.member.id), parsed.value);
  if (!updated) {
    return NextResponse.json({ error: "Could not save directory visibility. Try again." }, { status: 500 });
  }

  return NextResponse.json({
    status: "ok",
    message: "Directory visibility saved.",
    member: memberJson(toMemberPortalRecord(updated)),
  });
}
