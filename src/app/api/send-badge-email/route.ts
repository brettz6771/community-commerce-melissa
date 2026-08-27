import { NextResponse } from "next/server";
import { sendMemberBadgeOnlyEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      businessName, 
      ownerName, 
      tier, 
      memberId, 
      amount,
      city,
      state,
      phone,
      category,
      description,
      website,
      sessionId
    } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address required" }, { status: 400 });
    }

    // Dispatch badge copy directly to the member
    await sendMemberBadgeOnlyEmail({
      memberEmail: email,
      businessName: businessName || "Melissa Community Partner",
      ownerName: ownerName || "",
      tier: tier || "Community Partner",
      memberId: memberId || `CCM-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      amount: amount || 390,
      city: city || "Melissa",
      state: state || "TX",
      phone: phone || "",
      category: category || "General Business",
      website: website || "",
      sessionId: sessionId || "",
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
