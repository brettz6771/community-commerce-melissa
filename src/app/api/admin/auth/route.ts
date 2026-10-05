import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isInternalAuthorized, verifyAdminSecret } from "@/lib/internal-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = String(body.secret || "").trim();

    if (!verifyAdminSecret(secret)) {
      return NextResponse.json(
        { ok: false, error: secret ? "Incorrect admin password." : "Admin password is required." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      devMode: !(process.env.INTERNAL_API_SECRET || "").trim(),
    });

    // Set secure admin session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: secret,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Admin auth login error:", error);
    return NextResponse.json({ ok: false, error: "Authentication failed." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authorized = isInternalAuthorized(request);
  if (!authorized) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    devMode: !(process.env.INTERNAL_API_SECRET || "").trim(),
  });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
