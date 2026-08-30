function readPresentedSecret(request: Request): string {
  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  return (request.headers.get("x-internal-api-secret") || "").trim();
}

function secretsMatch(presented: string, expected: string): boolean {
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
