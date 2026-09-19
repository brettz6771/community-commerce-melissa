import { NextResponse } from "next/server";
import { memberJson, resolvePortalAuth } from "@/lib/member-portal-session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await resolvePortalAuth(request);

  if (auth.status === "unavailable") {
    return NextResponse.json(
      { status: "unavailable", error: "Member portal storage is not configured." },
      { status: 503 }
    );
  }

  if (auth.status === "ok") {
    return NextResponse.json({ status: "ok", member: memberJson(auth.member) });
  }

  if (auth.status === "membership_required") {
    return NextResponse.json({
      status: "membership_required",
      email: auth.email || "",
      message: "An active Community Commerce Melissa membership is required to use this portal.",
    });
  }

  return NextResponse.json({ status: "guest" });
}
