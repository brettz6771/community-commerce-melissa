import { NextResponse } from "next/server";
import { getDirectoryMembers } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbMembers = await getDirectoryMembers();
    return NextResponse.json({ members: dbMembers });
  } catch (error: any) {
    console.error("Error retrieving directory members:", error);
    return NextResponse.json({ members: [], error: error?.message }, { status: 500 });
  }
}
