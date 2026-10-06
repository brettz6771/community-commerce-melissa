import { NextResponse } from "next/server";
import { toCsv } from "@/lib/csv";
import { deleteEventRegistration, listEventRegistrations } from "@/lib/db";
import { isInternalAuthorized } from "@/lib/internal-auth";
import {
  EVENT_CHECKIN_ROSTER_CSV_HEADERS,
  EVENT_REGISTRATION_CSV_HEADERS,
  SITE_EVENTS,
  calculateEventRegistrationsSummary,
  eventCheckinRosterCsvRows,
  eventRegistrationCsvRows,
  getSiteEvent,
  isPastEvent,
} from "@/lib/site-events";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isInternalAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const eventId = url.searchParams.get("eventId") || "";
  const registrations = await listEventRegistrations(eventId || undefined);

  // If a specific eventId was requested but no site event matches AND no registrations exist for it
  if (eventId && !getSiteEvent(eventId) && registrations.length === 0) {
    return NextResponse.json({ error: "Unknown event." }, { status: 404 });
  }

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

  if (format === "roster-csv" || format === "checkin-csv") {
    const csv = toCsv(EVENT_CHECKIN_ROSTER_CSV_HEADERS, eventCheckinRosterCsvRows(registrations));
    const slug = eventId || "all-events";
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}-checkin-roster.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  // Build full event list including site events and any extra events found in registrations
  const siteEventList = SITE_EVENTS.map((event) => ({
    id: event.id,
    slug: event.slug,
    title: event.title,
    kicker: event.kicker,
    date: event.date,
    dateLabel: event.dateLabel,
    time: event.time,
    location: event.location,
    address: event.address || "",
    category: event.category,
    isPast: isPastEvent(event),
    href: event.href,
  }));

  const knownIds = new Set(siteEventList.map((e) => e.id));
  const extraEvents: typeof siteEventList = [];

  for (const reg of registrations) {
    if (reg.eventId && !knownIds.has(reg.eventId as any)) {
      knownIds.add(reg.eventId as any);
      extraEvents.push({
        id: reg.eventId as any,
        slug: reg.eventId as any,
        title: reg.eventTitle || reg.eventId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        kicker: "Archived event",
        date: reg.createdAt.split("T")[0] || "",
        dateLabel: reg.createdAt.split("T")[0] || "",
        time: "",
        location: "",
        address: "",
        category: "Past Events",
        isPast: true,
        href: "",
      });
    }
  }

  const allEvents = [...siteEventList, ...extraEvents];
  const summary = calculateEventRegistrationsSummary(registrations);

  return NextResponse.json({
    events: allEvents,
    eventId: eventId || null,
    count: registrations.length,
    totalGuests: summary.totalGuests,
    summary,
    registrations,
  });
}

export async function DELETE(request: Request) {
  if (!isInternalAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const idStr = url.searchParams.get("id");
  const id = parseInt(idStr || "", 10);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Valid registration ID is required." }, { status: 400 });
  }

  const success = await deleteEventRegistration(id);
  if (!success) {
    return NextResponse.json({ error: "Registration not found or could not be removed." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deletedId: id });
}

