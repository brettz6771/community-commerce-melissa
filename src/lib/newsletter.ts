export const NEWSLETTER_FORM_TYPE = "Newsletter Subscription";

export interface NewsletterContactRow {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  source?: string | null;
  details?: unknown;
  createdAt?: string | Date | null;
}

export interface NewsletterSubscriber {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  source: string;
  signedUpAt: string;
  signupCount: number;
}

const COMPANY_KEYS = ["Business Name", "businessName", "Company", "company", "Organization"];
const FIRST_NAME_KEYS = ["First Name", "firstName"];
const LAST_NAME_KEYS = ["Last Name", "lastName"];

function asDetailsRecord(details: unknown): Record<string, unknown> {
  if (details && typeof details === "object" && !Array.isArray(details)) {
    return details as Record<string, unknown>;
  }
  return {};
}

function readDetail(details: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = details[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed && trimmed.toUpperCase() !== "N/A") {
      return trimmed;
    }
  }
  return "";
}

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed.toUpperCase() === "N/A") return "";
  return trimmed;
}

export function formatSignedUpAt(value: string | Date | null | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", { timeZone: "America/Chicago" });
}

export function mapNewsletterRow(row: NewsletterContactRow): NewsletterSubscriber | null {
  const details = asDetailsRecord(row.details);
  const email = cleanText(row.email).toLowerCase();
  if (!email) return null;

  return {
    firstName: cleanText(row.firstName) || readDetail(details, FIRST_NAME_KEYS),
    lastName: cleanText(row.lastName) || readDetail(details, LAST_NAME_KEYS),
    email,
    company: readDetail(details, COMPANY_KEYS),
    source: cleanText(row.source),
    signedUpAt: formatSignedUpAt(row.createdAt),
    signupCount: 1,
  };
}

function preferFilled(current: string, incoming: string): string {
  return current || incoming;
}

/**
 * Newest rows should be passed first. Keeps the latest email record and
 * backfills missing name/company from older signups for the same address.
 */
export function mergeNewsletterRows(rows: NewsletterContactRow[]): NewsletterSubscriber[] {
  const byEmail = new Map<string, NewsletterSubscriber>();

  for (const row of rows) {
    const mapped = mapNewsletterRow(row);
    if (!mapped) continue;

    const existing = byEmail.get(mapped.email);
    if (!existing) {
      byEmail.set(mapped.email, mapped);
      continue;
    }

    existing.signupCount += 1;
    existing.firstName = preferFilled(existing.firstName, mapped.firstName);
    existing.lastName = preferFilled(existing.lastName, mapped.lastName);
    existing.company = preferFilled(existing.company, mapped.company);
    existing.source = preferFilled(existing.source, mapped.source);
  }

  return Array.from(byEmail.values());
}

export const NEWSLETTER_CSV_HEADERS = [
  "First Name",
  "Last Name",
  "Email",
  "Company",
  "Source",
  "Signed Up At",
  "Signups",
];

export function newsletterSubscriberCsvRows(subscribers: NewsletterSubscriber[]): Array<Array<string | number>> {
  return subscribers.map((subscriber) => [
    subscriber.firstName,
    subscriber.lastName,
    subscriber.email,
    subscriber.company,
    subscriber.source,
    subscriber.signedUpAt,
    subscriber.signupCount,
  ]);
}
