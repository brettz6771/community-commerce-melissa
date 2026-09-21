import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "ccm_member_session";
export const OTP_COOKIE = "ccm_member_otp";

export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;
export const OTP_MAX_AGE_SEC = 60 * 15;
export const OTP_MAX_ATTEMPTS = 5;

export type MemberSessionPayload = {
  email: string;
  memberRowId: number;
  exp: number;
};

export type MemberOtpPayload = {
  email: string;
  hash: string;
  exp: number;
  attempts: number;
};

export function getMemberPortalSecret(): string {
  const explicit = (process.env.MEMBER_PORTAL_SECRET || process.env.INTERNAL_API_SECRET || "").trim();
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production") {
    throw new Error("MEMBER_PORTAL_SECRET or INTERNAL_API_SECRET is required in production.");
  }
  return "ccm-dev-member-portal-secret";
}

export function cookieOptions(maxAgeSec: number) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export function parseNamedCookie(cookieHeader: string | null | undefined, name: string): string {
  if (!cookieHeader) return "";
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) !== name) continue;
    try {
      return decodeURIComponent(trimmed.slice(eq + 1));
    } catch {
      return trimmed.slice(eq + 1);
    }
  }
  return "";
}

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function signaturesMatch(presented: string, expected: string): boolean {
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function signPayload(payload: object, secret = getMemberPortalSecret()): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${signBody(body, secret)}`;
}

export function verifyPayload<T>(token: string | undefined | null, secret = getMemberPortalSecret()): T | null {
  if (!token || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!body || !sig) return null;
  if (!signaturesMatch(sig, signBody(body, secret))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & { exp?: number };
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createSessionToken(email: string, memberRowId: number, now = Date.now()): string {
  const payload: MemberSessionPayload = {
    email: normalizeMemberEmail(email),
    memberRowId,
    exp: now + SESSION_MAX_AGE_SEC * 1000,
  };
  return signPayload(payload);
}

export function readSessionFromCookieHeader(cookieHeader: string | null | undefined): MemberSessionPayload | null {
  const token = parseNamedCookie(cookieHeader, SESSION_COOKIE);
  const session = verifyPayload<MemberSessionPayload>(token);
  if (!session?.email || !Number.isFinite(session.memberRowId)) return null;
  return session;
}

export function generateOtpCode(): string {
  return String(100000 + (randomBytes(4).readUInt32BE(0) % 900000));
}

export function hashOtpCode(email: string, code: string, secret = getMemberPortalSecret()): string {
  return createHmac("sha256", secret)
    .update(`${normalizeMemberEmail(email)}:${String(code).trim()}`)
    .digest("hex");
}

export function createOtpToken(email: string, code: string, now = Date.now()): string {
  const payload: MemberOtpPayload = {
    email: normalizeMemberEmail(email),
    hash: hashOtpCode(email, code),
    exp: now + OTP_MAX_AGE_SEC * 1000,
    attempts: 0,
  };
  return signPayload(payload);
}

export function readOtpFromCookieHeader(cookieHeader: string | null | undefined): MemberOtpPayload | null {
  const token = parseNamedCookie(cookieHeader, OTP_COOKIE);
  const otp = verifyPayload<MemberOtpPayload>(token);
  if (!otp?.email || !otp.hash) return null;
  return otp;
}

export function verifyOtpAttempt(
  otp: MemberOtpPayload,
  email: string,
  code: string
): { ok: true } | { ok: false; reason: "mismatch" | "too_many" | "email" } {
  if (normalizeMemberEmail(otp.email) !== normalizeMemberEmail(email)) {
    return { ok: false, reason: "email" };
  }
  if ((otp.attempts || 0) >= OTP_MAX_ATTEMPTS) {
    return { ok: false, reason: "too_many" };
  }
  const presented = hashOtpCode(email, code);
  const expected = otp.hash;
  if (!signaturesMatch(presented, expected)) {
    return { ok: false, reason: "mismatch" };
  }
  return { ok: true };
}

export function bumpOtpAttempts(otp: MemberOtpPayload): string {
  return signPayload({
    ...otp,
    attempts: (otp.attempts || 0) + 1,
  });
}

export function normalizeMemberEmail(email: unknown): string {
  return String(email || "").trim().toLowerCase();
}

export const INVITE_MAX_AGE_SEC = 60 * 60 * 24 * 14;

export type MemberInvitePayload = {
  email: string;
  purpose: "invite";
  exp: number;
};

export function createInviteToken(email: string, now = Date.now()): string {
  const payload: MemberInvitePayload = {
    email: normalizeMemberEmail(email),
    purpose: "invite",
    exp: now + INVITE_MAX_AGE_SEC * 1000,
  };
  return signPayload(payload);
}

export function readInviteToken(token: string | undefined | null): MemberInvitePayload | null {
  const invite = verifyPayload<MemberInvitePayload>(token);
  if (!invite?.email || invite.purpose !== "invite") return null;
  return invite;
}

export function normalizeMemberId(memberId: unknown): string {
  return String(memberId || "").trim().toUpperCase();
}

export function memberIdsMatch(stored: unknown, presented: unknown): boolean {
  const a = normalizeMemberId(stored);
  const b = normalizeMemberId(presented);
  return Boolean(a && b && a === b);
}
