import { NextResponse } from "next/server";
import { badgePngFilename, renderMemberBadgeSvg, toBadgeRenderData } from "@/lib/member-badge";
import { resolvePortalAuth } from "@/lib/member-portal-session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await resolvePortalAuth(request);
  if (auth.status === "guest") {
    return NextResponse.json({ error: "Sign in to view your badge." }, { status: 401 });
  }
  if (auth.status === "membership_required") {
    return NextResponse.json({ error: "An active membership is required to view this badge." }, { status: 403 });
  }
  if (auth.status !== "ok") {
    return NextResponse.json({ error: "Member portal is unavailable." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const asDownload = searchParams.get("download") === "1" || searchParams.get("download") === "true";
  const svg = renderMemberBadgeSvg(toBadgeRenderData(auth.member));
  const filename = badgePngFilename(auth.member.memberId).replace(/\.png$/i, ".svg");

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `${asDownload ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
