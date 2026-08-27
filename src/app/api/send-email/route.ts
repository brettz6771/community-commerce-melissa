import { NextResponse } from "next/server";
import { saveContactToDb } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { escapeHtml, isValidEmail } from "@/lib/html";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, formType, senderEmail, details } = body;

    if (!isValidEmail(senderEmail)) {
      return NextResponse.json({ error: "A valid sender email is required." }, { status: 400 });
    }

    const dbSaved = await saveContactToDb({
      email: senderEmail.trim(),
      formType: formType || "Website Form",
      source: formType || "Footer Subscribe",
      details: details || {},
    });

    const toEmail = "info@communitycommercemelissa.org";
    const safeFormType = escapeHtml(formType || "Website Form");

    const formattedDetailsHtml = Object.entries(details || {})
      .map(
        ([key, val]) =>
          `<tr><td style="padding: 6px 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; text-transform: capitalize;">${escapeHtml(key)}:</td><td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(val)}</td></tr>`
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0b0e14; padding: 20px; text-align: center; border-bottom: 3px solid #dc2626;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase;">Community Commerce Melissa</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">New Form Submission: <strong>${safeFormType}</strong></p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Submission Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${formattedDetailsHtml}
          </table>
        </div>
        <div style="background-color: #f8fafc; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Sent to info@communitycommercemelissa.org from website visitor
        </div>
      </div>
    `;

    const result = await sendEmail({
      to: toEmail,
      replyTo: senderEmail.trim(),
      subject: String(subject || `New Submission: ${formType || "Website Form"}`).slice(0, 200),
      html: htmlContent,
    });

    if (!result.success && !dbSaved) {
      return NextResponse.json(
        { error: result.error || "Email could not be sent." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, result, savedToDatabase: dbSaved });
  } catch (error) {
    console.error("Error in /api/send-email route:", error);
    return NextResponse.json(
      { error: "Internal server error processing email." },
      { status: 500 }
    );
  }
}
