import { Pool } from "pg";

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

    // Ensure table exists
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

    // Ensure columns exist (for backwards compatibility if table already exists)
    await dbPool.query(`
      ALTER TABLE website_contacts ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
    `);
    await dbPool.query(`
      ALTER TABLE website_contacts ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
    `);

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
  isActive?: boolean;
  isTest?: boolean;
  createdAt?: string;
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
    // Ensure table exists
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
      ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS description TEXT;
    `);

    // Determine badge name
    const badge = tier.toLowerCase().includes("partner")
      ? "Community Partner"
      : tier.toLowerCase().includes("member")
      ? "Community Member"
      : "Community Supporter";

    // Check if business already exists by name or email to prevent duplicates
    const cleanBizName = businessName.trim();
    const cleanEmail = email.trim().toLowerCase();

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
          is_active = true,
          is_test = $12
        WHERE id = $13;
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
          isTest,
          existingId,
        ]
      );
      console.log(`Successfully updated existing directory member ${cleanBizName} (ID: ${existingId}).`);
    } else {
      await dbPool.query(
        `
        INSERT INTO directory_members (
          business_name, category, description, website, city, state, phone, email, owner_name, tier, badge, is_active, is_test
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, $12);
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

export async function getDirectoryMembers(): Promise<DirectoryMemberRecord[]> {
  const dbPool = getDbPool();
  if (!dbPool) {
    return [];
  }

  try {
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
      ALTER TABLE directory_members ADD COLUMN IF NOT EXISTS description TEXT;
    `);

    // Clean up any historical duplicate entries in the database
    await dbPool.query(`
      DELETE FROM directory_members a USING directory_members b
      WHERE a.id < b.id AND LOWER(TRIM(a.business_name)) = LOWER(TRIM(b.business_name));
    `).catch(() => {});

    const res = await dbPool.query(`
      SELECT 
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
        is_active AS "isActive", 
        is_test AS "isTest", 
        created_at AS "createdAt"
      FROM directory_members
      WHERE is_active = true
      ORDER BY 
        CASE WHEN badge = 'Community Partner' THEN 1 WHEN badge = 'Founding Member' THEN 2 ELSE 3 END,
        created_at DESC;
    `);

    // Guarantee unique businesses by lowercase name
    const seenNames = new Set<string>();
    const uniqueMembers: DirectoryMemberRecord[] = [];

    for (const row of res.rows) {
      const key = (row.businessName || "").toLowerCase().trim();
      if (!key || seenNames.has(key)) continue;
      seenNames.add(key);
      uniqueMembers.push(row);
    }

    return uniqueMembers;
  } catch (error) {
    console.error("Error fetching directory members from Postgres:", error);
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

