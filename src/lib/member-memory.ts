import type { DirectoryMemberRecord } from "@/lib/db";
import { DEFAULT_VISIBILITY, type DirectoryVisibility, type MemberProfileFields } from "@/lib/member-portal";
import { normalizeMemberEmail } from "@/lib/member-portal-auth";
import {
  eventSignupKind,
  getSiteEvent,
  type EventMembershipStatus,
  type EventPaymentStatus,
  type EventPricing,
  type EventRegistrationPath,
  type EventRegistrationRecord,
  type EventSignupKind,
} from "@/lib/site-events";

export type MemoryMember = DirectoryMemberRecord & DirectoryVisibility & {
  memberId?: string;
  passwordHash?: string | null;
  passwordSetAt?: string | null;
};

type MemoryEventRegistration = EventRegistrationRecord;

const memoryEventRegistrations: MemoryEventRegistration[] = [];

const memoryMembers: MemoryMember[] = [];
let nextId = 1;
let seeded = false;

export function allowDevMemoryStore(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function resetMemberMemoryForTests(): void {
  memoryMembers.length = 0;
  memoryEventRegistrations.length = 0;
  nextId = 1;
  seeded = false;
}

function seedDevMemberIfNeeded(): void {
  if (seeded || process.env.NODE_ENV === "production") return;
  seeded = true;
  if (process.env.CCM_PORTAL_DEV_LOGIN !== "1") return;

  memoryMembers.push({
    id: nextId++,
    businessName: "Melissa Demo Partners",
    category: "Professional & Business Consulting",
    description: "Local consulting studio helping Melissa businesses grow through community partnerships.",
    website: "https://communitycommercemelissa.org",
    city: "Melissa",
    state: "TX",
    phone: "(972) 555-0148",
    email: "member@example.com",
    ownerName: "Jordan Hale",
    tier: "Community Partner",
    badge: "Community Partner",
    memberId: "CCM-2026-DEV001",
    isActive: true,
    isTest: true,
    createdAt: new Date().toISOString(),
    ...DEFAULT_VISIBILITY,
  });

  memoryMembers.push({
    id: nextId++,
    businessName: "Former Member LLC",
    category: "General Business / Other",
    description: "Inactive listing used to verify the membership-required portal state.",
    website: "",
    city: "Melissa",
    state: "TX",
    phone: "(972) 555-0199",
    email: "former@example.com",
    ownerName: "Alex Reed",
    tier: "Community Partner",
    badge: "Community Partner",
    memberId: "CCM-2026-FORMER",
    isActive: false,
    isTest: true,
    createdAt: new Date().toISOString(),
    ...DEFAULT_VISIBILITY,
    listingVisible: false,
  });
}

export function listMemoryMembers(): MemoryMember[] {
  seedDevMemberIfNeeded();
  return memoryMembers.map((row) => ({ ...row }));
}

export function getMemoryMemberByEmail(email: string): MemoryMember | null {
  seedDevMemberIfNeeded();
  const needle = normalizeMemberEmail(email);
  return memoryMembers.find((row) => normalizeMemberEmail(row.email) === needle) || null;
}

export function getMemoryMemberById(id: number): MemoryMember | null {
  seedDevMemberIfNeeded();
  return memoryMembers.find((row) => row.id === id) || null;
}

export function upsertMemoryMember(input: Partial<MemoryMember> & { email: string; businessName: string }): MemoryMember {
  seedDevMemberIfNeeded();
  const email = normalizeMemberEmail(input.email);
  const existing = memoryMembers.find((row) => normalizeMemberEmail(row.email) === email || row.id === input.id);
  if (existing) {
    Object.assign(existing, input, { email, id: existing.id });
    return { ...existing };
  }
  const created: MemoryMember = {
    ...DEFAULT_VISIBILITY,
    ...input,
    id: nextId++,
    businessName: input.businessName,
    category: input.category || "General Business / Other",
    description: input.description || "",
    website: input.website || "",
    city: input.city || "Melissa",
    state: input.state || "TX",
    phone: input.phone || "",
    email,
    ownerName: input.ownerName || "",
    tier: input.tier || "Community Partner",
    badge: input.badge || input.tier || "Community Partner",
    memberId: input.memberId,
    isActive: input.isActive !== false,
    isTest: Boolean(input.isTest),
    createdAt: new Date().toISOString(),
  };
  memoryMembers.push(created);
  return { ...created };
}

export function updateMemoryProfile(id: number, fields: MemberProfileFields): MemoryMember | null {
  const existing = getMemoryMemberById(id);
  if (!existing) return null;
  const emailTaken = memoryMembers.some(
    (row) => row.id !== id && normalizeMemberEmail(row.email) === normalizeMemberEmail(fields.email)
  );
  if (emailTaken) {
    throw new Error("EMAIL_IN_USE");
  }
  Object.assign(existing, fields, { email: normalizeMemberEmail(fields.email) });
  return { ...existing };
}

export function updateMemoryVisibility(id: number, visibility: DirectoryVisibility): MemoryMember | null {
  const existing = getMemoryMemberById(id);
  if (!existing) return null;
  Object.assign(existing, visibility);
  return { ...existing };
}

export function memoryEmailInUse(email: string, exceptId?: number): boolean {
  seedDevMemberIfNeeded();
  const needle = normalizeMemberEmail(email);
  return memoryMembers.some((row) => row.id !== exceptId && normalizeMemberEmail(row.email) === needle);
}

export function listMemoryMembersForAdmin(): MemoryMember[] {
  return listMemoryMembers();
}

export function setMemoryMemberPassword(id: number, passwordHash: string): MemoryMember | null {
  const existing = getMemoryMemberById(id);
  if (!existing) return null;
  const stored = memoryMembers.find((row) => row.id === id);
  if (!stored) return null;
  stored.passwordHash = passwordHash;
  stored.passwordSetAt = new Date().toISOString();
  return { ...stored };
}

export function saveMemoryEventRegistration(input: {
  eventId: string;
  path: string;
  kind?: EventSignupKind;
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  guests?: string;
  notes?: string;
  membershipStatus?: EventMembershipStatus;
  pricing?: EventPricing;
  amountCents?: number;
  paymentStatus?: EventPaymentStatus;
  details?: Record<string, unknown>;
  stripeSessionId?: string;
}): boolean {
  const path = input.path as EventRegistrationPath;
  const details = input.details || {};
  memoryEventRegistrations.push({
    id: memoryEventRegistrations.length + 1,
    eventId: input.eventId,
    eventTitle: getSiteEvent(input.eventId)?.title || input.eventId,
    path,
    kind: input.kind || eventSignupKind(path),
    email: normalizeMemberEmail(input.email),
    name: input.name || "",
    phone: input.phone || String(details.phone || ""),
    company: input.company || String(details.company || ""),
    guests: input.guests || String(details.guests || "1"),
    notes: input.notes || String(details.notes || ""),
    membershipStatus: input.membershipStatus || "non_member",
    pricing: input.pricing || "free",
    amountCents: input.amountCents || 0,
    paymentStatus: input.paymentStatus || "complimentary",
    stripeSessionId: input.stripeSessionId || "",
    createdAt: new Date().toISOString(),
  });
  return true;
}

export function listMemoryEventRegistrations(eventId?: string): EventRegistrationRecord[] {
  return memoryEventRegistrations
    .filter((row) => !eventId || row.eventId === eventId)
    .slice()
    .reverse()
    .map((row) => ({ ...row }));
}
