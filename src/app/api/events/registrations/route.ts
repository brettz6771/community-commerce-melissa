import { NextResponse } from "next/server";
import { toCsv } from "@/lib/csv";
import { listEventRegistrations } from "@/lib/db";
import { isInternalAuthorized } from "@/lib/internal-auth";
import {
  EVENT_REGISTRATION_CSV_HEADERS,
  SITE_EVENTS,
  eventRegistrationCsvRows,
  getSiteEvent,
} from "@/lib/site-events";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isInternalAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const eventId = url.searchParams.get("eventId") || "";
  if (eventId && !getSiteEvent(eventId)) {
    return NextResponse.json({ error: "Unknown event." }, { status: 404 });
  }

  const registrations = await listEventRegistrations(eventId || undefined);
  const format = (url.searchParams.get("format") || "json").toLowerCase();

  if (format === "csv") {
    const csv = toCsv(EVENT_REGISTRATION_CSV_HEADERS, eventRegistrationCsvRows(registrations));
    const slug = eventId || "all-events";
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}-registrations.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json({
    events: SITE_EVENTS.map((event) => ({ id: event.id, title: event.title, date: event.date })),
    eventId: eventId || null,
    count: registrations.length,
    registrations,
  });
}
