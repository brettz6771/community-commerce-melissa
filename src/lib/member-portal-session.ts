import { NextResponse } from "next/server";
import {
  getDirectoryMemberByEmail,
  getDirectoryMemberById,
  isMemberDirectoryConfigured,
} from "@/lib/db";
import { toMemberPortalRecord, type MemberPortalRecord } from "@/lib/member-portal";
import {
  OTP_COOKIE,
  SESSION_COOKIE,
  cookieOptions,
  OTP_MAX_AGE_SEC,
  SESSION_MAX_AGE_SEC,
  readSessionFromCookieHeader,
} from "@/lib/member-portal-auth";

export type PortalAuthState =
  | { status: "unavailable" }
  | { status: "guest" }
  | { status: "membership_required"; email?: string }
  | { status: "ok"; member: MemberPortalRecord };

export async function resolvePortalAuth(request: Request): Promise<PortalAuthState> {
  if (!isMemberDirectoryConfigured()) {
    return { status: "unavailable" };
  }

  const session = readSessionFromCookieHeader(request.headers.get("cookie"));
  if (!session) {
    return { status: "guest" };
  }

  const row = (await getDirectoryMemberById(session.memberRowId)) || (await getDirectoryMemberByEmail(session.email));
  if (!row || row.isActive === false || !row.id) {
    return { status: "membership_required", email: session.email };
  }

  return { status: "ok", member: toMemberPortalRecord(row) };
}

export function withSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(SESSION_COOKIE, token, cookieOptions(SESSION_MAX_AGE_SEC));
  response.cookies.set(OTP_COOKIE, "", cookieOptions(0));
  return response;
}

export function withOtpCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(OTP_COOKIE, token, cookieOptions(OTP_MAX_AGE_SEC));
  return response;
}

export function clearPortalCookies(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  response.cookies.set(OTP_COOKIE, "", cookieOptions(0));
  return response;
}

export function memberJson(member: MemberPortalRecord) {
  return {
    id: member.id,
    memberId: member.memberId,
    businessName: member.businessName,
    ownerName: member.ownerName,
    email: member.email,
    phone: member.phone,
    category: member.category,
    description: member.description,
    website: member.website,
    city: member.city,
    state: member.state,
    tier: member.tier,
    badge: member.badge,
    createdAt: member.createdAt,
    listingVisible: member.listingVisible,
    showPhone: member.showPhone,
    showWebsite: member.showWebsite,
    showDescription: member.showDescription,
    showLocation: member.showLocation,
    showEmail: member.showEmail,
    hasPassword: Boolean(member.hasPassword),
  };
}
