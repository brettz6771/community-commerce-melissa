import { NextResponse } from "next/server";
import { saveContactToDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, formType, senderEmail, senderName, details } = body;

    // Save contact to Postgres database via DATABASE_URL if available
    if (senderEmail) {
      await saveContactToDb({
        email: senderEmail,
        formType: formType || "Website Form",
        source: formType || "Footer Subscribe",
        details: details || {},
      });
    }

    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      console.warn("SENDGRID_API_KEY is not set. Mocking email delivery.");
      return NextResponse.json({
        success: true,
        message: "Email submission logged and saved to database.",
      });
    }

    const fromEmail = "website@communitycommercemelissa.org";
    const toEmail = "info@communitycommercemelissa.org";

    // Format HTML content for clean reading in inbox
    const formattedDetailsHtml = Object.entries(details || {})
      .map(
        ([key, val]) =>
          `<tr><td style="padding: 6px 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; text-transform: capitalize;">${key}:</td><td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0;">${val}</td></tr>`
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0b0e14; padding: 20px; text-align: center; border-bottom: 3px solid #dc2626;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase;">Community Commerce Melissa</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">New Form Submission: <strong>${formType || "Website Form"}</strong></p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Submission Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${formattedDetailsHtml}
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Sent from website@communitycommercemelissa.org to info@communitycommercemelissa.org
        </div>
      </div>
    `;

    const sendgridPayload = {
      personalizations: [
        {
          to: [{ email: toEmail }],
        },
      ],
      from: {
        email: fromEmail,
        name: "Community Commerce Melissa Website",
      },
      reply_to: {
        email: senderEmail && senderEmail.includes("@") ? senderEmail : fromEmail,
        name: senderName || "Website Visitor",
      },
      subject: subject || `New Submission: ${formType || "Website Form"}`,
      content: [
        {
          type: "text/html",
          value: htmlContent,
        },
      ],
    };

    const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(sendgridPayload),
    });

    if (!sgResponse.ok) {
      const errorText = await sgResponse.text();
      console.error("SendGrid API error:", sgResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to send email via SendGrid." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/send-email route:", error);
    return NextResponse.json(
      { error: "Internal server error processing email." },
      { status: 500 }
    );
  }
}
