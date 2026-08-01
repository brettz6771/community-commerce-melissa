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
  details?: Record<string, any>;
}) {
  const dbPool = getDbPool();
  if (!dbPool) {
    console.log("DATABASE_URL not set. Skipping Postgres database save.");
    return false;
  }

  try {
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

    // Insert record
    await dbPool.query(
      `
      INSERT INTO website_contacts (email, form_type, source, details)
      VALUES ($1, $2, $3, $4);
      `,
      [email, formType, source, JSON.stringify(details)]
    );

    console.log(`Successfully saved contact ${email} to Postgres database.`);
    return true;
  } catch (error) {
    console.error("Error saving contact to Postgres database:", error);
    return false;
  }
}
