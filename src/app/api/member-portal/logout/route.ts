import { NextResponse } from "next/server";
import { clearPortalCookies } from "@/lib/member-portal-session";

export const dynamic = "force-dynamic";

export async function POST() {
  return clearPortalCookies(NextResponse.json({ status: "logged_out" }));
}
