import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  OTP_COOKIE,
  SESSION_COOKIE,
  bumpOtpAttempts,
  createInviteToken,
  createOtpToken,
  createSessionToken,
  readInviteToken,
  generateOtpCode,
  hashOtpCode,
  memberIdsMatch,
  parseNamedCookie,
  readOtpFromCookieHeader,
  readSessionFromCookieHeader,
  signPayload,
  verifyOtpAttempt,
  verifyPayload,
} from "./member-portal-auth.ts";

const originalSecret = process.env.MEMBER_PORTAL_SECRET;

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.MEMBER_PORTAL_SECRET;
  } else {
    process.env.MEMBER_PORTAL_SECRET = originalSecret;
  }
});

describe("member portal sessions", () => {
  it("signs and verifies a session token from a cookie header", () => {
    process.env.MEMBER_PORTAL_SECRET = "portal-test-secret";
    const token = createSessionToken("Jane@Example.com", 42);
    const header = `${SESSION_COOKIE}=${encodeURIComponent(token)}; other=1`;
    const session = readSessionFromCookieHeader(header);
    assert.ok(session);
    assert.equal(session?.email, "jane@example.com");
    assert.equal(session?.memberRowId, 42);
  });

  it("rejects tampered or expired tokens", () => {
    process.env.MEMBER_PORTAL_SECRET = "portal-test-secret";
    const token = signPayload({ email: "a@b.com", memberRowId: 1, exp: Date.now() - 1000 });
    assert.equal(verifyPayload(token), null);

    const valid = createSessionToken("a@b.com", 1);
    assert.equal(verifyPayload(`${valid}x`), null);
    assert.equal(readSessionFromCookieHeader(`${SESSION_COOKIE}=not-a-token`), null);
  });
});

describe("member portal OTP", () => {
  it("generates a 6-digit code and accepts the matching attempt", () => {
    process.env.MEMBER_PORTAL_SECRET = "portal-test-secret";
    const code = generateOtpCode();
    assert.match(code, /^\d{6}$/);
    const token = createOtpToken("member@example.com", code);
    const header = `${OTP_COOKIE}=${encodeURIComponent(token)}`;
    const otp = readOtpFromCookieHeader(header);
    assert.ok(otp);
    assert.equal(verifyOtpAttempt(otp!, "member@example.com", code).ok, true);
    assert.equal(verifyOtpAttempt(otp!, "member@example.com", "000000").ok, false);
    assert.equal(hashOtpCode("member@example.com", code), otp?.hash);
  });

  it("locks out after too many attempts", () => {
    process.env.MEMBER_PORTAL_SECRET = "portal-test-secret";
    const token = createOtpToken("member@example.com", "123456");
    const otp = verifyPayload<{ email: string; hash: string; exp: number; attempts: number }>(token);
    assert.ok(otp);
    otp!.attempts = 5;
    assert.deepEqual(verifyOtpAttempt(otp!, "member@example.com", "123456"), { ok: false, reason: "too_many" });
    const bumped = bumpOtpAttempts({ ...otp!, attempts: 1 });
    assert.ok(bumped);
  });
});

describe("member invite tokens", () => {
  it("creates a time-limited invite for an existing member email", () => {
    process.env.MEMBER_PORTAL_SECRET = "portal-test-secret";
    const token = createInviteToken("Jane@Example.com");
    const invite = readInviteToken(token);
    assert.ok(invite);
    assert.equal(invite?.email, "jane@example.com");
    assert.equal(invite?.purpose, "invite");
    assert.equal(readInviteToken("not-valid"), null);
  });
});

describe("cookie and member id helpers", () => {
  it("parses a named cookie and matches member IDs case-insensitively", () => {
    assert.equal(parseNamedCookie("a=1; ccm_member_session=abc%201", "ccm_member_session"), "abc 1");
    assert.equal(memberIdsMatch("ccm-2026-dev001", "CCM-2026-DEV001"), true);
    assert.equal(memberIdsMatch("CCM-2026-DEV001", "CCM-2026-OTHER"), false);
  });
});
