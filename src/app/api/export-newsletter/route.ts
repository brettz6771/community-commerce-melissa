import { NextResponse } from "next/server";
import { getNewsletterSubscribers } from "@/lib/db";
import { isInternalAuthorized } from "@/lib/internal-auth";
import { toCsv } from "@/lib/csv";
import { NEWSLETTER_CSV_HEADERS, newsletterSubscriberCsvRows } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isInternalAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { configured, subscribers } = await getNewsletterSubscribers();
    const format = new URL(request.url).searchParams.get("format") || "csv";

    if (!configured) {
      return NextResponse.json(
        {
          error: "DATABASE_URL is not configured, so newsletter signups are not stored for export.",
          configured: false,
          subscribers: [],
        },
        { status: 503 }
      );
    }

    if (format === "json") {
      return NextResponse.json({
        configured: true,
        count: subscribers.length,
        subscribers,
      });
    }

    const csv = toCsv(NEWSLETTER_CSV_HEADERS, newsletterSubscriberCsvRows(subscribers));
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="newsletter-subscribers-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error exporting newsletter subscribers:", error);
    return NextResponse.json(
      { error: "Could not export newsletter subscribers." },
      { status: 500 }
    );
  }
}
