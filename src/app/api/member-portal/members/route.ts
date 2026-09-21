import { NextResponse } from "next/server";
import { listDirectoryMembersForAdmin } from "@/lib/db";
import { isInternalAuthorized } from "@/lib/internal-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isInternalAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { configured, members } = await listDirectoryMembersForAdmin();
  if (!configured) {
    return NextResponse.json(
      {
        error: "Member storage is not configured.",
        configured: false,
        members: [],
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    configured: true,
    count: members.length,
    members: members.map((member) => ({
      id: member.id,
      email: member.email || "",
      businessName: member.businessName,
      ownerName: member.ownerName || "",
      memberId: member.memberId || "",
      isActive: member.isActive !== false,
      hasPassword: member.hasPassword,
      createdAt: member.createdAt || "",
    })),
  });
}
