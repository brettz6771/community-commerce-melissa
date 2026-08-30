import { NextResponse } from "next/server";
import { saveDirectoryMember } from "@/lib/db";
import { sendMemberWelcomeAndAdminAlert } from "@/lib/email";
import { isInternalAuthorized } from "@/lib/internal-auth";

export async function POST(request: Request) {
  try {
    if (!isInternalAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      businessName = "Melissa Innovation Partners",
      ownerName = "Test Member",
      email,
      phone = "(972) 837-1234",
      category = "Real Estate",
      description = "Dedicated commercial development and investment firm serving Melissa, Texas.",
      website = "https://communitycommercemelissa.org",
      city = "Melissa",
      state = "TX",
    } = body;

    const targetEmail = email && email.includes("@") ? email : "info@communitycommercemelissa.org";
    const shortRandom = Math.random().toString(36).substring(2, 8).toUpperCase();
    const memberId = `CCM-2026-${shortRandom}`;
    const simSessionId = `cs_test_sim_${Date.now()}_${shortRandom}`;

    await saveDirectoryMember({
      businessName,
      category,
      description,
      website,
      city,
      state,
      phone,
      email: targetEmail,
      ownerName,
      tier: "Community Partner",
      isTest: true,
    }).catch((err) => console.warn("Directory save notice:", err));

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
  } catch (error) {
    console.error("Error in simulated member signup:", error);
    const message = error instanceof Error ? error.message : "Failed to simulate member signup.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
