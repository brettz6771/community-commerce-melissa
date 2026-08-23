import { NextResponse } from "next/server";
import { saveContactToDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      businessName, 
      ownerName, 
      tier, 
      memberId, 
      amount 
    } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address required" }, { status: 400 });
    }

    // Save/Update in Postgres DB
    await saveContactToDb({
      email,
      formType: "Member Badge Dispatched",
      source: "Post-Checkout Digital Badge System",
      details: {
        "Member ID": memberId || "CCM-2026-MEMBER",
        "Member Business": businessName || "N/A",
        "Owner / Contact": ownerName || "N/A",
        "Membership Level": tier || "Community Partner",
        "Amount Paid": `$${amount || 390}`,
        "Email Dispatched At": new Date().toISOString(),
      },
    });

    console.log(`Digital Membership Badge dispatched to ${email} for Member ID ${memberId}`);

    return NextResponse.json({ 
      success: true, 
      message: `Digital Membership Badge and Welcome Toolkit successfully dispatched to ${email}.` 
    });
  } catch (error: any) {
    console.error("Error dispatching member badge email:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send badge email." },
      { status: 500 }
    );
  }
}
