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
