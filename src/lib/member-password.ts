import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 200;

export function validateMemberPassword(password: unknown): string | null {
  const value = typeof password === "string" ? password : "";
  if (!value) return "Enter a password.";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (value.length > MAX_PASSWORD_LENGTH) return "Password is too long.";
  if (!/\S/.test(value)) return "Enter a password.";
  return null;
}

export async function hashMemberPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("base64url")}`;
}

export async function verifyMemberPassword(password: string, stored: unknown): Promise<boolean> {
  const value = String(stored || "");
  const parts = value.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, encoded] = parts;
  if (!salt || !encoded) return false;

  try {
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    const expected = Buffer.from(encoded, "base64url");
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function memberHasPassword(row: { passwordHash?: string | null } | null | undefined): boolean {
  return Boolean(row?.passwordHash && String(row.passwordHash).startsWith("scrypt$"));
}
