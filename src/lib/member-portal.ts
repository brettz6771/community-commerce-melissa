import { isValidEmail, sanitizeHttpUrl } from "./html";
import { resolveMemberId } from "./member-badge";
import { memberHasPassword } from "./member-password";
import { normalizeMemberEmail } from "./member-portal-auth";
import type { DirectoryMemberRecord } from "./db";

export type DirectoryVisibility = {
  listingVisible: boolean;
  showPhone: boolean;
  showWebsite: boolean;
  showDescription: boolean;
  showLocation: boolean;
  showEmail: boolean;
};

export type MemberProfileFields = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  website: string;
  city: string;
  state: string;
};

export type MemberPortalRecord = DirectoryMemberRecord &
  DirectoryVisibility & {
    id: number;
    memberId: string;
    email: string;
    businessName: string;
    hasPassword: boolean;
    passwordHash?: never;
  };

export const DEFAULT_VISIBILITY: DirectoryVisibility = {
  listingVisible: true,
  showPhone: true,
  showWebsite: true,
  showDescription: true,
  showLocation: true,
  showEmail: false,
};

export function asBoolean(value: unknown, fallback: boolean): boolean {
  if (value === true || value === "true" || value === 1 || value === "1") return true;
  if (value === false || value === "false" || value === 0 || value === "0") return false;
  return fallback;
}

export function normalizeWebsite(raw: unknown): string {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function parseVisibility(input: unknown): { ok: true; value: DirectoryVisibility } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Visibility settings are required." };
  }
  const body = input as Record<string, unknown>;
  return {
    ok: true,
    value: {
      listingVisible: asBoolean(body.listingVisible, DEFAULT_VISIBILITY.listingVisible),
      showPhone: asBoolean(body.showPhone, DEFAULT_VISIBILITY.showPhone),
      showWebsite: asBoolean(body.showWebsite, DEFAULT_VISIBILITY.showWebsite),
      showDescription: asBoolean(body.showDescription, DEFAULT_VISIBILITY.showDescription),
      showLocation: asBoolean(body.showLocation, DEFAULT_VISIBILITY.showLocation),
      showEmail: asBoolean(body.showEmail, DEFAULT_VISIBILITY.showEmail),
    },
  };
}

export function validateMemberProfile(
  input: unknown
): { ok: true; value: MemberProfileFields } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const body = input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  const businessName = String(body.businessName ?? "").trim();
  const ownerName = String(body.ownerName ?? "").trim();
  const email = normalizeMemberEmail(body.email);
  const phone = String(body.phone ?? "").trim();
  const category = String(body.category ?? "").trim();
  const description = String(body.description ?? "").trim().slice(0, 250);
  const websiteRaw = normalizeWebsite(body.website);
  const city = String(body.city ?? "").trim() || "Melissa";
  const state = String(body.state ?? "").trim() || "TX";

  if (!businessName) errors.businessName = "Business name is required.";
  else if (businessName.length > 255) errors.businessName = "Business name must be 255 characters or fewer.";

  if (!ownerName) errors.ownerName = "Contact name is required.";
  else if (ownerName.length > 255) errors.ownerName = "Contact name must be 255 characters or fewer.";

  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";

  if (!phone) errors.phone = "Phone number is required.";
  else if (phone.length > 50) errors.phone = "Phone number is too long.";

  if (!category) errors.category = "Business category is required.";
  else if (category.length > 100) errors.category = "Category must be 100 characters or fewer.";

  if (!description) errors.description = "Directory bio is required.";
  else if (description.length > 250) errors.description = "Directory bio must be 250 characters or fewer.";

  if (websiteRaw) {
    const safe = sanitizeHttpUrl(websiteRaw);
    if (!safe) errors.website = "Enter a valid website URL (https://…).";
  }

  if (!city) errors.city = "City is required.";
  if (!state) errors.state = "State is required.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      businessName,
      ownerName,
      email,
      phone,
      category,
      description,
      website: websiteRaw ? sanitizeHttpUrl(websiteRaw) : "",
      city,
      state,
    },
  };
}

export function visibilityFromRecord(member: Partial<DirectoryVisibility> | null | undefined): DirectoryVisibility {
  return {
    listingVisible: asBoolean(member?.listingVisible, true),
    showPhone: asBoolean(member?.showPhone, true),
    showWebsite: asBoolean(member?.showWebsite, true),
    showDescription: asBoolean(member?.showDescription, true),
    showLocation: asBoolean(member?.showLocation, true),
    showEmail: asBoolean(member?.showEmail, false),
  };
}

export function applyPublicDirectoryVisibility(
  member: DirectoryMemberRecord & Partial<DirectoryVisibility>
): DirectoryMemberRecord | null {
  if (member.isActive === false) return null;
  const visibility = visibilityFromRecord(member);
  if (!visibility.listingVisible) return null;

  return {
    ...member,
    phone: visibility.showPhone ? member.phone || "" : "",
    website: visibility.showWebsite ? member.website || "" : "",
    description: visibility.showDescription ? member.description || "" : "",
    city: visibility.showLocation ? member.city || "" : "",
    state: visibility.showLocation ? member.state || "" : "",
    email: visibility.showEmail ? member.email || "" : "",
    ownerName: "",
  };
}

export function toMemberPortalRecord(row: DirectoryMemberRecord & Partial<DirectoryVisibility>): MemberPortalRecord {
  const visibility = visibilityFromRecord(row);
  const { passwordHash: _ignoredHash, ...safeRow } = row;
  void _ignoredHash;
  return {
    ...safeRow,
    ...visibility,
    id: Number(row.id),
    memberId: resolveMemberId(row),
    email: normalizeMemberEmail(row.email),
    businessName: row.businessName || "",
    ownerName: row.ownerName || "",
    phone: row.phone || "",
    category: row.category || "General Business / Other",
    description: row.description || "",
    website: row.website || "",
    city: row.city || "Melissa",
    state: row.state || "TX",
    tier: row.tier || row.badge || "Community Partner",
    badge: row.badge || row.tier || "Community Partner",
    isActive: row.isActive !== false,
    hasPassword: memberHasPassword(row),
  };
}

