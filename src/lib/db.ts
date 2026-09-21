import { Pool } from "pg";
import { mergeNewsletterRows, NEWSLETTER_FORM_TYPE, type NewsletterSubscriber } from "@/lib/newsletter";
import {
  applyPublicDirectoryVisibility,
  type DirectoryVisibility,
  type MemberProfileFields,
} from "@/lib/member-portal";
import {
  allowDevMemoryStore,
  getMemoryMemberByEmail,
  getMemoryMemberById,
  listMemoryEventRegistrations,
  listMemoryMembers,
  listMemoryMembersForAdmin,
  saveMemoryEventRegistration,
  setMemoryMemberPassword,
  updateMemoryProfile,
  updateMemoryVisibility,
} from "@/lib/member-memory";
import { memberHasPassword } from "@/lib/member-password";
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

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    });
  }

  return pool;
}

export async function saveContactToDb({
  email,
  formType = "Newsletter Subscription",
  source = "Footer Subscribe",
  details = {},
}: {
  email: string;
  formType?: string;
  source?: string;
  details?: Record<string, unknown>;
}) {
  const dbPool = getDbPool();
  if (!dbPool) {
    console.log("DATABASE_URL not set. Skipping Postgres database save.");
    return false;
  }

  try {
    // Extract first name and last name if present in details
    const firstName = details["First Name"] || details["firstName"] || null;
    const lastName = details["Last Name"] || details["lastName"] || null;

    await ensureWebsiteContactsTable(dbPool);

    // Insert record
    await dbPool.query(
      `
      INSERT INTO website_contacts (email, form_type, source, first_name, last_name, details)
      VALUES ($1, $2, $3, $4, $5, $6);
      `,
      [email, formType, source, firstName, lastName, JSON.stringify(details)]
    );

    console.log(`Successfully saved contact ${email} to Postgres database.`);
    return true;
  } catch (error) {
    console.error("Error saving contact to Postgres database:", error);
    return false;
  }
}

async function ensureWebsiteContactsTable(dbPool: Pool) {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS website_contacts (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      form_type VARCHAR(100) DEFAULT 'Newsletter Subscription',
      source VARCHAR(100) DEFAULT 'Footer Subscribe',
      details JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await dbPool.query(`
    ALTER TABLE website_contacts ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
  `);
  await dbPool.query(`
    ALTER TABLE website_contacts ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
  `);
}

export async function getNewsletterSubscribers(): Promise<{
  configured: boolean;
  subscribers: NewsletterSubscriber[];
}> {
  const dbPool = getDbPool();
  if (!dbPool) {
    return { configured: false, subscribers: [] };
  }

  await ensureWebsiteContactsTable(dbPool);

  const res = await dbPool.query(`
    SELECT
      email,
      first_name AS "firstName",
      last_name AS "lastName",
      source,
      details,
      created_at AS "createdAt"
    FROM website_contacts
    WHERE form_type = $1
    ORDER BY created_at DESC;
  `, [NEWSLETTER_FORM_TYPE]);

  return {
    configured: true,
    subscribers: mergeNewsletterRows(res.rows),
  };
}

export interface DirectoryMemberRecord {
  id?: number;
  businessName: string;
  category: string;
  description?: string;
  website?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  ownerName?: string;
  tier?: string;
  badge?: string;
  memberId?: string;
  isActive?: boolean;
  isTest?: boolean;
  createdAt?: string;
  listingVisible?: boolean;
  showPhone?: boolean;
  showWebsite?: boolean;
  showDescription?: boolean;
  showLocation?: boolean;
  showEmail?: boolean;
  passwordHash?: string | null;
  passwordSetAt?: string | null;
}

export type AdminDirectoryMember = Omit<DirectoryMemberRecord, "passwordHash"> & {
  id: number;
  hasPassword: boolean;
};

const DIRECTORY_MEMBER_SELECT = `
  id,
  business_name AS "businessName",
  category,
  description,
  website,
  city,
  state,
  phone,
  email,
  owner_name AS "ownerName",
  tier,
  badge,
  member_id AS "memberId",
  is_active AS "isActive",
  is_test AS "isTest",
  created_at AS "createdAt",
  listing_visible AS "listingVisible",
  show_phone AS "showPhone",
  show_website AS "showWebsite",
  show_description AS "showDescription",
  show_location AS "showLocation",
  show_email AS "showEmail",
  password_hash AS "passwordHash",
  password_set_at AS "passwordSetAt"
`;

async function ensureDirectoryMembersTable(dbPool: Pool) {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS directory_members (
      id SERIAL PRIMARY KEY,
      business_name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      website VARCHAR(500),
      city VARCHAR(100) DEFAULT 'Melissa',
      state VARCHAR(50) DEFAULT 'TX',
      phone VARCHAR(50),
      email VARCHAR(255),
      owner_name VARCHAR(255),
      tier VARCHAR(100) DEFAULT 'Community Partner',
      badge VARCHAR(100) DEFAULT 'Community Partner',
      is_active BOOLEAN DEFAULT true,
      is_test BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS description TEXT;`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS member_id VARCHAR(50);`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS listing_visible BOOLEAN DEFAULT true;`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT true;`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS show_website BOOLEAN DEFAULT true;`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS show_description BOOLEAN DEFAULT true;`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS show_location BOOLEAN DEFAULT true;`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT false;`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS password_hash TEXT;`);
  await dbPool.query(`ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS password_set_at TIMESTAMP WITH TIME ZONE;`);
}

export async function saveDirectoryMember({
  businessName,
  category = "General Business",
  description = "",
  website = "",
  city = "Melissa",
  state = "TX",
  phone = "",
  email = "",
  ownerName = "",
  tier = "Community Partner",
  memberId = "",
  isTest = false,
}: {
  businessName: string;
  category?: string;
  description?: string;
  website?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  ownerName?: string;
  tier?: string;
  memberId?: string;
  isTest?: boolean;
}) {
  const dbPool = getDbPool();
  if (!dbPool) {
    console.log("DATABASE_URL not set. Skipping directory member DB save.");
    return false;
  }

  if (!businessName || businessName.trim() === "") {
    return false;
  }

  try {
    await ensureDirectoryMembersTable(dbPool);

    // Determine badge name
    const badge = tier.toLowerCase().includes("corporate") || tier.toLowerCase().includes("sponsorship")
      ? "Corporate Partner"
      : "Community Partner";

    // Check if business already exists by name or email to prevent duplicates
    const cleanBizName = businessName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMemberId = memberId.trim().toUpperCase();

    const existingCheck = await dbPool.query(
      `
      SELECT id FROM directory_members 
      WHERE LOWER(TRIM(business_name)) = LOWER($1) 
         OR ($2 != '' AND LOWER(TRIM(email)) = $2)
      LIMIT 1;
      `,
      [cleanBizName, cleanEmail]
    );

    if (existingCheck.rowCount && existingCheck.rowCount > 0) {
      const existingId = existingCheck.rows[0].id;
      await dbPool.query(
        `
        UPDATE directory_members 
        SET 
          business_name = $1,
          category = $2,
          description = COALESCE(NULLIF($3, ''), description),
          website = COALESCE(NULLIF($4, ''), website),
          city = $5,
          state = $6,
          phone = COALESCE(NULLIF($7, ''), phone),
          email = COALESCE(NULLIF($8, ''), email),
          owner_name = COALESCE(NULLIF($9, ''), owner_name),
          tier = $10,
          badge = $11,
          member_id = COALESCE(NULLIF($12, ''), member_id),
          is_active = true,
          is_test = $13
        WHERE id = $14;
        `,
        [
          cleanBizName,
          category.trim(),
          description.trim().slice(0, 250),
          website.trim(),
          city.trim() || "Melissa",
          state.trim() || "TX",
          phone.trim(),
          cleanEmail,
          ownerName.trim(),
          tier,
          badge,
          cleanMemberId,
          isTest,
          existingId,
        ]
      );
      console.log(`Successfully updated existing directory member ${cleanBizName} (ID: ${existingId}).`);
    } else {
      await dbPool.query(
        `
        INSERT INTO directory_members (
          business_name, category, description, website, city, state, phone, email, owner_name, tier, badge, member_id, is_active, is_test,
          listing_visible, show_phone, show_website, show_description, show_location, show_email
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NULLIF($12, ''), true, $13, true, true, true, true, true, false);
        `,
        [
          cleanBizName,
          category.trim(),
          description.trim().slice(0, 250),
          website.trim(),
          city.trim() || "Melissa",
          state.trim() || "TX",
          phone.trim(),
          cleanEmail,
          ownerName.trim(),
          tier,
          badge,
          cleanMemberId,
          isTest,
        ]
      );
      console.log(`Successfully added new directory member ${cleanBizName}.`);
    }

    return true;
  } catch (error) {
    console.error("Error saving directory member to Postgres:", error);
    return false;
  }
}

function dedupeDirectoryMembers(rows: DirectoryMemberRecord[]): DirectoryMemberRecord[] {
  const seenNames = new Set<string>();
  const uniqueMembers: DirectoryMemberRecord[] = [];

  for (const row of rows) {
    const publicRow = applyPublicDirectoryVisibility(row);
    if (!publicRow) continue;
    const key = (publicRow.businessName || "").toLowerCase().trim();
    if (!key || seenNames.has(key)) continue;
    seenNames.add(key);
    uniqueMembers.push(publicRow);
  }

  return uniqueMembers;
}

export async function getDirectoryMembers(): Promise<DirectoryMemberRecord[]> {
  const dbPool = getDbPool();
  if (!dbPool) {
    if (allowDevMemoryStore()) {
      return dedupeDirectoryMembers(listMemoryMembers());
    }
    return [];
  }

  try {
    await ensureDirectoryMembersTable(dbPool);

    // Clean up any historical duplicate entries in the database
    await dbPool.query(`
      DELETE FROM directory_members a USING directory_members b
      WHERE a.id < b.id AND LOWER(TRIM(a.business_name)) = LOWER(TRIM(b.business_name));
    `).catch(() => {});

    const res = await dbPool.query(`
      SELECT ${DIRECTORY_MEMBER_SELECT}
      FROM directory_members
      WHERE is_active = true
        AND COALESCE(listing_visible, true) = true
      ORDER BY 
        CASE WHEN badge = 'Community Partner' THEN 1 WHEN badge = 'Founding Member' THEN 2 ELSE 3 END,
        created_at DESC;
    `);

    return dedupeDirectoryMembers(res.rows);
  } catch (error) {
    console.error("Error fetching directory members from Postgres:", error);
    return [];
  }
}

export function isMemberDirectoryConfigured(): boolean {
  return Boolean(getDbPool()) || allowDevMemoryStore();
}

export async function getDirectoryMemberByEmail(email: string): Promise<DirectoryMemberRecord | null> {
  const needle = normalizeMemberEmail(email);
  if (!needle) return null;

  const dbPool = getDbPool();
  if (!dbPool) {
    return allowDevMemoryStore() ? getMemoryMemberByEmail(needle) : null;
  }

  try {
    await ensureDirectoryMembersTable(dbPool);
    const res = await dbPool.query(
      `
      SELECT ${DIRECTORY_MEMBER_SELECT}
      FROM directory_members
      WHERE LOWER(TRIM(email)) = $1
      ORDER BY is_active DESC, id DESC
      LIMIT 1;
      `,
      [needle]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.error("Error looking up directory member by email:", error);
    return null;
  }
}

export async function getDirectoryMemberById(id: number): Promise<DirectoryMemberRecord | null> {
  if (!Number.isFinite(id)) return null;

  const dbPool = getDbPool();
  if (!dbPool) {
    return allowDevMemoryStore() ? getMemoryMemberById(id) : null;
  }

  try {
    await ensureDirectoryMembersTable(dbPool);
    const res = await dbPool.query(
      `
      SELECT ${DIRECTORY_MEMBER_SELECT}
      FROM directory_members
      WHERE id = $1
      LIMIT 1;
      `,
      [id]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.error("Error looking up directory member by id:", error);
    return null;
  }
}

export async function updateDirectoryMemberProfile(
  id: number,
  fields: MemberProfileFields
): Promise<DirectoryMemberRecord | null> {
  const dbPool = getDbPool();
  if (!dbPool) {
    if (!allowDevMemoryStore()) return null;
    try {
      return updateMemoryProfile(id, fields);
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_IN_USE") {
        throw error;
      }
      return null;
    }
  }

  try {
    await ensureDirectoryMembersTable(dbPool);
    const emailTaken = await dbPool.query(
      `
      SELECT id FROM directory_members
      WHERE LOWER(TRIM(email)) = $1 AND id <> $2
      LIMIT 1;
      `,
      [normalizeMemberEmail(fields.email), id]
    );
    if ((emailTaken.rowCount || 0) > 0) {
      throw new Error("EMAIL_IN_USE");
    }

    const res = await dbPool.query(
      `
      UPDATE directory_members
      SET
        business_name = $1,
        owner_name = $2,
        email = $3,
        phone = $4,
        category = $5,
        description = $6,
        website = $7,
        city = $8,
        state = $9
      WHERE id = $10
      RETURNING ${DIRECTORY_MEMBER_SELECT};
      `,
      [
        fields.businessName,
        fields.ownerName,
        normalizeMemberEmail(fields.email),
        fields.phone,
        fields.category,
        fields.description.slice(0, 250),
        fields.website,
        fields.city,
        fields.state,
        id,
      ]
    );
    return res.rows[0] || null;
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_IN_USE") {
      throw error;
    }
    console.error("Error updating directory member profile:", error);
    return null;
  }
}

export async function updateDirectoryMemberVisibility(
  id: number,
  visibility: DirectoryVisibility
): Promise<DirectoryMemberRecord | null> {
  const dbPool = getDbPool();
  if (!dbPool) {
    return allowDevMemoryStore() ? updateMemoryVisibility(id, visibility) : null;
  }

  try {
    await ensureDirectoryMembersTable(dbPool);
    const res = await dbPool.query(
      `
      UPDATE directory_members
      SET
        listing_visible = $1,
        show_phone = $2,
        show_website = $3,
        show_description = $4,
        show_location = $5,
        show_email = $6
      WHERE id = $7
      RETURNING ${DIRECTORY_MEMBER_SELECT};
      `,
      [
        visibility.listingVisible,
        visibility.showPhone,
        visibility.showWebsite,
        visibility.showDescription,
        visibility.showLocation,
        visibility.showEmail,
        id,
      ]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.error("Error updating directory member visibility:", error);
    return null;
  }
}

function toAdminDirectoryMember(row: DirectoryMemberRecord): AdminDirectoryMember {
  const { passwordHash: _ignoredHash, ...safe } = row;
  void _ignoredHash;
  return {
    ...safe,
    id: Number(row.id),
    hasPassword: memberHasPassword(row),
  };
}

export async function listDirectoryMembersForAdmin(): Promise<{
  configured: boolean;
  members: AdminDirectoryMember[];
}> {
  const dbPool = getDbPool();
  if (!dbPool) {
    if (!allowDevMemoryStore()) return { configured: false, members: [] };
    return {
      configured: true,
      members: listMemoryMembersForAdmin().map(toAdminDirectoryMember),
    };
  }

  try {
    await ensureDirectoryMembersTable(dbPool);
    const res = await dbPool.query(`
      SELECT ${DIRECTORY_MEMBER_SELECT}
      FROM directory_members
      ORDER BY is_active DESC, created_at DESC, id DESC;
    `);
    return {
      configured: true,
      members: res.rows.map((row: DirectoryMemberRecord) => toAdminDirectoryMember(row)),
    };
  } catch (error) {
    console.error("Error listing directory members for admin:", error);
    return { configured: true, members: [] };
  }
}

export async function setDirectoryMemberPassword(
  id: number,
  passwordHash: string
): Promise<DirectoryMemberRecord | null> {
  const dbPool = getDbPool();
  if (!dbPool) {
    return allowDevMemoryStore() ? setMemoryMemberPassword(id, passwordHash) : null;
  }

  try {
    await ensureDirectoryMembersTable(dbPool);
    const res = await dbPool.query(
      `
      UPDATE directory_members
      SET password_hash = $1, password_set_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING ${DIRECTORY_MEMBER_SELECT};
      `,
      [passwordHash, id]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.error("Error setting directory member password:", error);
    return null;
  }
}

export async function isActiveDirectoryMemberEmail(email: string): Promise<boolean> {
  const row = await getDirectoryMemberByEmail(email);
  return Boolean(row && row.isActive !== false && row.id);
}

async function ensureEventRegistrationsTable(dbPool: Pool) {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id SERIAL PRIMARY KEY,
      event_id VARCHAR(80) NOT NULL,
      path VARCHAR(40) NOT NULL,
      kind VARCHAR(40) NOT NULL DEFAULT 'attendance',
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      phone VARCHAR(80),
      company VARCHAR(255),
      guests VARCHAR(20),
      notes TEXT,
      membership_status VARCHAR(40) NOT NULL DEFAULT 'non_member',
      pricing VARCHAR(20) NOT NULL DEFAULT 'free',
      amount_cents INTEGER NOT NULL DEFAULT 0,
      payment_status VARCHAR(40) NOT NULL DEFAULT 'complimentary',
      details JSONB,
      stripe_session_id VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS kind VARCHAR(40) NOT NULL DEFAULT 'attendance'`);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS phone VARCHAR(80)`);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS company VARCHAR(255)`);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS guests VARCHAR(20)`);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS notes TEXT`);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS membership_status VARCHAR(40) NOT NULL DEFAULT 'non_member'`);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS pricing VARCHAR(20) NOT NULL DEFAULT 'free'`);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS amount_cents INTEGER NOT NULL DEFAULT 0`);
  await dbPool.query(`ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(40) NOT NULL DEFAULT 'complimentary'`);
}

function mapEventRegistrationRow(row: {
  id: number;
  event_id: string;
  path: string;
  kind?: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  company?: string | null;
  guests?: string | null;
  notes?: string | null;
  membership_status?: string;
  pricing?: string;
  amount_cents?: number;
  payment_status?: string;
  stripe_session_id?: string | null;
  details?: Record<string, unknown> | null;
  created_at?: string | Date;
}): EventRegistrationRecord {
  const details = row.details && typeof row.details === "object" ? row.details : {};
  const path = String(row.path || "attendee") as EventRegistrationPath;
  return {
    id: row.id,
    eventId: row.event_id,
    eventTitle: getSiteEvent(row.event_id)?.title || row.event_id,
    path,
    kind: (row.kind || eventSignupKind(path)) as EventSignupKind,
    name: row.name || String(details.name || ""),
    email: row.email,
    phone: row.phone || String(details.phone || ""),
    company: row.company || String(details.company || ""),
    guests: row.guests || String(details.guests || "1"),
    notes: row.notes || String(details.notes || ""),
    membershipStatus: (row.membership_status || "non_member") as EventMembershipStatus,
    pricing: (row.pricing || "free") as EventPricing,
    amountCents: Number(row.amount_cents || 0),
    paymentStatus: (row.payment_status || "complimentary") as EventPaymentStatus,
    stripeSessionId: row.stripe_session_id || "",
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : "",
  };
}

export async function saveEventRegistration({
  eventId,
  path,
  email,
  name = "",
  phone = "",
  company = "",
  guests = "1",
  notes = "",
  membershipStatus = "non_member",
  pricing = "free",
  amountCents = 0,
  paymentStatus = "complimentary",
  details = {},
  stripeSessionId = "",
}: {
  eventId: string;
  path: string;
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
}): Promise<boolean> {
  const kind = eventSignupKind(path as EventRegistrationPath);
  const payload = {
    eventId,
    path,
    kind,
    email: normalizeMemberEmail(email),
    name: name.trim(),
    phone: phone.trim(),
    company: company.trim(),
    guests: guests.trim() || "1",
    notes: notes.trim(),
    membershipStatus,
    pricing,
    amountCents,
    paymentStatus,
    details,
    stripeSessionId,
  };

  const dbPool = getDbPool();
  if (!dbPool) {
    return allowDevMemoryStore() ? saveMemoryEventRegistration(payload) : false;
  }

  try {
    await ensureEventRegistrationsTable(dbPool);
    await dbPool.query(
      `
      INSERT INTO event_registrations (
        event_id, path, kind, email, name, phone, company, guests, notes,
        membership_status, pricing, amount_cents, payment_status, details, stripe_session_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NULLIF($15, ''));
      `,
      [
        payload.eventId,
        payload.path,
        payload.kind,
        payload.email,
        payload.name,
        payload.phone,
        payload.company,
        payload.guests,
        payload.notes,
        payload.membershipStatus,
        payload.pricing,
        payload.amountCents,
        payload.paymentStatus,
        JSON.stringify({ ...details, phone: payload.phone, company: payload.company, guests: payload.guests, notes: payload.notes }),
        payload.stripeSessionId,
      ]
    );
    return true;
  } catch (error) {
    console.error("Error saving event registration:", error);
    return false;
  }
}

export async function listEventRegistrations(eventId?: string): Promise<EventRegistrationRecord[]> {
  const dbPool = getDbPool();
  if (!dbPool) {
    return allowDevMemoryStore() ? listMemoryEventRegistrations(eventId) : [];
  }

  try {
    await ensureEventRegistrationsTable(dbPool);
    const res = eventId
      ? await dbPool.query(
          `
          SELECT id, event_id, path, kind, email, name, phone, company, guests, notes,
                 membership_status, pricing, amount_cents, payment_status, details, stripe_session_id, created_at
          FROM event_registrations
          WHERE event_id = $1
          ORDER BY created_at DESC, id DESC;
          `,
          [eventId]
        )
      : await dbPool.query(
          `
          SELECT id, event_id, path, kind, email, name, phone, company, guests, notes,
                 membership_status, pricing, amount_cents, payment_status, details, stripe_session_id, created_at
          FROM event_registrations
          ORDER BY created_at DESC, id DESC;
          `
        );
    return res.rows.map(mapEventRegistrationRow);
  } catch (error) {
    console.error("Error listing event registrations:", error);
    return [];
  }
}

export async function hasDispatchedEmailForSession(sessionId: string): Promise<boolean> {
  if (!sessionId || sessionId.startsWith("cs_test_sim_")) return false;
  const dbPool = getDbPool();
  if (!dbPool) return false;

  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS email_dispatches (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const res = await dbPool.query(
      `SELECT id FROM email_dispatches WHERE session_id = $1 LIMIT 1;`,
      [sessionId]
    );

    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Error checking email dispatch status:", error);
    return false;
  }
}

export async function markEmailDispatchedForSession(sessionId: string, email: string): Promise<boolean> {
  if (!sessionId || sessionId.startsWith("cs_test_sim_")) return true;
  const dbPool = getDbPool();
  if (!dbPool) return false;

  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS email_dispatches (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(
      `
      INSERT INTO email_dispatches (session_id, email)
      VALUES ($1, $2)
      ON CONFLICT (session_id) DO NOTHING;
      `,
      [sessionId, email]
    );

    return true;
  } catch (error) {
    console.error("Error recording email dispatch status:", error);
    return false;
  }
}

