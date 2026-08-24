import { NextResponse } from "next/server";
import { saveDirectoryMember } from "@/lib/db";
import { sendMemberWelcomeAndAdminAlert } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessName = "Melissa Innovation Partners",
      ownerName = "Test Member",
      email,
      phone = "(972) 837-1234",
      category = "Real Estate",
      website = "https://communitycommercemelissa.org",
      city = "Melissa",
      state = "TX",
      tier = "Community Partner ($390 1st Yr • Renews $490/yr)",
    } = body;

    const targetEmail = email && email.includes("@") ? email : "info@communitycommercemelissa.org";
    const shortRandom = Math.random().toString(36).substring(2, 8).toUpperCase();
    const memberId = `CCM-2026-${shortRandom}`;
    const simSessionId = `cs_test_sim_${Date.now()}_${shortRandom}`;

    // 1. Auto-Add Business to Directory
    await saveDirectoryMember({
      businessName,
      category,
      website,
      city,
      state,
      phone,
      email: targetEmail,
      ownerName,
      tier: "Community Partner",
      isTest: true,
    }).catch((err) => console.warn("Directory save notice:", err));

    // 2. Dispatch Both SendGrid Emails (To Member & To info@communitycommercemelissa.org)
    const emailResults = await sendMemberWelcomeAndAdminAlert({
      memberEmail: targetEmail,
      businessName,
      ownerName,
      tier: "Community Partner",
      memberId,
      amount: "0.00 (Simulated Test Mode)",
      city,
      state,
      phone,
      category,
      website,
      sessionId: simSessionId,
    });

    console.log("Simulated test signup completed successfully:", {
      memberId,
      targetEmail,
      businessName,
      emailResults,
    });

    return NextResponse.json({
      success: true,
      memberId,
      simSessionId,
      businessName,
      ownerName,
      email: targetEmail,
      city,
      state,
      tier: "Community Partner",
      receiptUrl: `/membership/receipt?session_id=${simSessionId}&member_id=${memberId}&business_name=${encodeURIComponent(
        businessName
      )}&owner_name=${encodeURIComponent(ownerName)}&email=${encodeURIComponent(
        targetEmail
      )}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&tier=${encodeURIComponent(
        "Community Partner"
      )}&amount=390&simulated=true`,
    });
  } catch (error: any) {
    console.error("Error in simulated member signup:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to simulate member signup." },
      { status: 500 }
    );
  }
}
