export const ADMIN_COOKIE_NAME = "ccm_admin_secret";

function parseCookieValue(cookieHeader: string, name: string): string {
  const prefix = `${name}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length)).trim();
    }
  }
  return "";
}

function readPresentedSecret(request: Request): string {
  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  const custom = (request.headers.get("x-internal-api-secret") || "").trim();
  if (custom) {
    return custom;
  }
  const cookieHeader = request.headers.get("cookie") || "";
  return parseCookieValue(cookieHeader, ADMIN_COOKIE_NAME);
}

export function secretsMatch(presented: string, expected: string): boolean {
  if (!presented || presented.length !== expected.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= presented.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Protects internal admin/export routes.
 * Production always requires INTERNAL_API_SECRET.
 * Local/dev allows unauthenticated access only when that secret is unset.
 */
export function isInternalAuthorized(request: Request): boolean {
  const expected = (process.env.INTERNAL_API_SECRET || "").trim();

  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }

  return secretsMatch(readPresentedSecret(request), expected);
}

export function verifyAdminSecret(secret: string): boolean {
  const expected = (process.env.INTERNAL_API_SECRET || "").trim();
  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }
  return secretsMatch(secret.trim(), expected);
}

