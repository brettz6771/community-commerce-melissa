import { NextResponse } from "next/server";

export async function GET() {
  // A real .pkpass must be cryptographically signed with an Apple Pass Type ID
  // certificate. Serving unsigned JSON as application/vnd.apple.pkpass causes
  // Wallet to reject the file. This endpoint is disabled until signed passes
  // are implemented.
  return NextResponse.json(
    {
      error: "Apple Wallet passes are not available yet.",
    },
    { status: 501 }
  );
}
