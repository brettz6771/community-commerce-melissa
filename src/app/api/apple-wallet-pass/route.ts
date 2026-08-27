import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId") || "CCM-2026-MEMBER";
    const tier = searchParams.get("tier") || "Community Partner";
    const businessName = searchParams.get("businessName") || "Melissa Community Partner";
    const ownerName = searchParams.get("name") || "Member";
    const download = searchParams.get("download") === "true";

    const cleanTier = tier.toLowerCase().includes("corporate") || tier.toLowerCase().includes("sponsorship")
      ? "CORPORATE PARTNER"
      : "COMMUNITY PARTNER";

    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: "pass.org.communitycommercemelissa.member",
      serialNumber: memberId,
      teamIdentifier: "MELISSATX26",
      organizationName: "Community Commerce Melissa",
      description: "Community Commerce Melissa Official Membership Card",
      logoText: "COMMUNITY COMMERCE MELISSA",
      foregroundColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(15, 18, 24)",
      labelColor: "rgb(239, 68, 68)",
      storeCard: {
        headerFields: [
          {
            key: "tier",
            label: "MEMBERSHIP LEVEL",
            value: cleanTier,
          },
        ],
        primaryFields: [
          {
            key: "business",
            label: "MEMBER BUSINESS / ORGANIZATION",
            value: businessName,
          },
        ],
        secondaryFields: [
          {
            key: "memberId",
            label: "MEMBER ID",
            value: memberId,
          },
          {
            key: "contact",
            label: "REPRESENTATIVE",
            value: ownerName,
          },
          {
            key: "validThru",
            label: "VALID THROUGH",
            value: "2026 – 2027",
          },
        ],
        auxiliaryFields: [
          {
            key: "location",
            label: "COMMUNITY",
            value: "Melissa, TX",
          },
          {
            key: "taxStatus",
            label: "STATUS",
            value: "501(c)(3) Non-Profit",
          },
        ],
        backFields: [
          {
            key: "about",
            label: "ABOUT THIS CARD",
            value:
              "This certifies that the holder is an active business member in good standing with Community Commerce Melissa, dedicated to local economic development and community advancement.",
          },
          {
            key: "directory",
            label: "MEMBER DIRECTORY & PERKS",
            value: "https://communitycommercemelissa.org/directory",
          },
          {
            key: "support",
            label: "MEMBER SUPPORT",
            value: "info@communitycommercemelissa.org",
          },
        ],
      },
      barcodes: [
        {
          format: "PKBarcodeFormatQR",
          message: `https://communitycommercemelissa.org/directory?memberId=${encodeURIComponent(memberId)}`,
          messageEncoding: "iso-8859-1",
          altText: memberId,
        },
      ],
    };

    if (download) {
      // Serve as downloadable pass file or JSON
      const jsonBuffer = Buffer.from(JSON.stringify(passJson, null, 2), "utf-8");
      return new Response(jsonBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.pkpass",
          "Content-Disposition": `attachment; filename="CCM-Membership-${memberId}.pkpass"`,
        },
      });
    }

    return NextResponse.json(passJson);
  } catch (error: any) {
    console.error("Error generating Apple Wallet pass:", error);
    return NextResponse.json({ error: "Failed to generate Apple Wallet pass" }, { status: 500 });
  }
}
