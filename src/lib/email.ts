import { saveContactToDb } from "@/lib/db";

interface SendEmailParams {
  to: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({
  to,
  from,
  replyTo,
  subject,
  html,
  text,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const defaultFrom = process.env.EMAIL_FROM || "website@communitycommercemelissa.org";
  const fromEmail = from || defaultFrom;
  const toList = Array.isArray(to) ? to : [to];

  // 1. Try Resend if configured
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toList,
          reply_to: replyTo,
          subject,
          html,
          text,
        }),
      });

      if (res.ok) {
        console.log(`Email successfully dispatched via Resend to ${toList.join(", ")}`);
        return { success: true };
      } else {
        const errText = await res.text();
        console.warn("Resend API returned error:", res.status, errText);
      }
    } catch (err: any) {
      console.warn("Resend dispatch failed:", err?.message);
    }
  }

  // 2. Try SendGrid if configured
  if (sendgridKey) {
    try {
      const sendgridPayload = {
        personalizations: [
          {
            to: toList.map((email) => ({ email })),
          },
        ],
        from: {
          email: fromEmail,
          name: "Community Commerce Melissa",
        },
        reply_to: replyTo
          ? {
              email: replyTo,
              name: "Community Commerce Team",
            }
          : undefined,
        subject,
        content: [
          {
            type: "text/html",
            value: html,
          },
        ],
      };

      const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sendgridKey}`,
        },
        body: JSON.stringify(sendgridPayload),
      });

      if (sgResponse.ok) {
        console.log(`Email successfully dispatched via SendGrid to ${toList.join(", ")}`);
        return { success: true };
      } else {
        const errorText = await sgResponse.text();
        console.error("SendGrid API error:", sgResponse.status, errorText);
      }
    } catch (err: any) {
      console.error("SendGrid dispatch failed:", err?.message);
    }
  }

  console.warn(
    `[Email Service Notice] Neither SENDGRID_API_KEY nor RESEND_API_KEY is configured in production environment variables. Email to ${toList.join(", ")} with subject "${subject}" was logged to database.`
  );

  return { 
    success: false, 
    error: "No email API key (SENDGRID_API_KEY or RESEND_API_KEY) found in environment variables." 
  };
}

export async function sendMemberWelcomeAndAdminAlert({
  memberEmail,
  businessName,
  ownerName,
  tier,
  memberId,
  amount,
  city = "Melissa",
  state = "TX",
  phone = "",
  category = "General Business",
  website = "",
  sessionId = "",
}: {
  memberEmail: string;
  businessName: string;
  ownerName?: string;
  tier: string;
  memberId: string;
  amount: number | string;
  city?: string;
  state?: string;
  phone?: string;
  category?: string;
  website?: string;
  sessionId?: string;
}) {
  const adminEmail = "info@communitycommercemelissa.org";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://communitycommercemelissa.org";
  const receiptUrl = `${siteUrl}/membership/receipt?session_id=${sessionId || ""}&tier=${encodeURIComponent(tier)}`;
  const directoryUrl = `${siteUrl}/directory`;

  const cleanTier = tier.toLowerCase().includes("partner")
    ? "2026 Community Partner"
    : tier.toLowerCase().includes("member")
    ? "2026 Community Member"
    : "2026 Community Member";

  // --- 1. MEMBER WELCOME & DIGITAL BADGE EMAIL ---
  const memberHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Welcome to Community Commerce Melissa</title></head>
    <body style="margin: 0; padding: 0; background-color: #0b0e14; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0b0e14; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #151922; border: 2px solid #a81c24; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #0b0e14; padding: 25px 30px; border-bottom: 2px solid #a81c24; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">
                    COMMUNITY COMMERCE <span style="color: #ef4444;">MELISSA</span>
                  </h1>
                  <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
                    Official 501(c)(3) Non-Profit Organization • Melissa, TX
                  </p>
                </td>
              </tr>

              <!-- Badge Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #7a141a 0%, #a81c24 100%); padding: 25px 30px; text-align: center;">
                  <div style="display: inline-block; background-color: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.3); padding: 4px 12px; border-radius: 20px; color: #fecaca; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                    VERIFIED ACTIVE MEMBER
                  </div>
                  <h2 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                    ${cleanTier}
                  </h2>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 30px; color: #e2e8f0; font-size: 14px; line-height: 1.6;">
                  <p style="font-size: 16px; color: #ffffff; margin-top: 0;">
                    Hello <strong>${ownerName || businessName}</strong>,
                  </p>
                  <p>
                    Congratulations and welcome to <strong>Community Commerce Melissa</strong>! We are honored to have <strong>${businessName}</strong> as an official member strengthening our local business community.
                  </p>

                  <!-- Member Details Box -->
                  <div style="background-color: #0b0e14; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px;">
                      <tr>
                        <td style="color: #94a3b8; font-weight: bold; text-transform: uppercase; font-size: 11px;">MEMBER ID NUMBER:</td>
                        <td style="color: #ffffff; font-weight: bold; font-family: monospace; font-size: 15px;">${memberId}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: bold; text-transform: uppercase; font-size: 11px;">REGISTERED BUSINESS:</td>
                        <td style="color: #ffffff; font-weight: bold;">${businessName}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: bold; text-transform: uppercase; font-size: 11px;">MEMBERSHIP LEVEL:</td>
                        <td style="color: #ef4444; font-weight: bold;">${cleanTier}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: bold; text-transform: uppercase; font-size: 11px;">LOCATION:</td>
                        <td style="color: #ffffff;">${city}, ${state}</td>
                      </tr>
                      <tr>
                        <td style="color: #94a3b8; font-weight: bold; text-transform: uppercase; font-size: 11px;">VALID THROUGH:</td>
                        <td style="color: #ffffff;">2026 – 2027</td>
                      </tr>
                    </table>
                  </div>

                  <!-- CTAs -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${receiptUrl}" style="display: inline-block; background-color: #a81c24; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 6px;">
                      View Digital Badge & Receipt →
                    </a>
                    <a href="${directoryUrl}" style="display: inline-block; background-color: #334155; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 6px;">
                      View Business Directory →
                    </a>
                  </div>

                  <p style="color: #94a3b8; font-size: 13px;">
                    Your digital badge is now active. You can download the high-resolution badge image for your website footer and email signature, print your storefront certificate, or add it to Apple Wallet on your mobile device.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #0b0e14; padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); color: #64748b; font-size: 11px;">
                  <p style="margin: 0 0 6px 0;">Community Commerce Melissa • 501(c)(3) Non-Profit Organization</p>
                  <p style="margin: 0;">Questions? Reply directly to this email or contact <a href="mailto:info@communitycommercemelissa.org" style="color: #ef4444; text-decoration: none;">info@communitycommercemelissa.org</a></p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // --- 2. ADMIN NOTIFICATION EMAIL TO info@communitycommercemelissa.org ---
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>New Member Registration Alert</title></head>
    <body style="font-family: Arial, sans-serif; color: #0f172a; background-color: #f1f5f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <div style="background-color: #0b0e14; padding: 20px; text-align: center; border-bottom: 3px solid #a81c24;">
          <h2 style="color: #ffffff; margin: 0; font-size: 18px; text-transform: uppercase;">Community Commerce Melissa</h2>
          <p style="color: #ef4444; margin: 4px 0 0 0; font-size: 13px; font-weight: bold;">🎉 NEW MEMBER REGISTRATION (PAYMENT VERIFIED)</p>
        </div>

        <div style="padding: 24px;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
            Member Information
          </h3>

          <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
            <tr style="background-color: #f8fafc;">
              <td style="font-weight: bold; width: 40%; border-bottom: 1px solid #e2e8f0;">Business Name:</td>
              <td style="font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${businessName}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Primary Contact:</td>
              <td style="border-bottom: 1px solid #e2e8f0;">${ownerName || "N/A"}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email Address:</td>
              <td style="border-bottom: 1px solid #e2e8f0;"><a href="mailto:${memberEmail}">${memberEmail}</a></td>
            </tr>
            <tr>
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Phone Number:</td>
              <td style="border-bottom: 1px solid #e2e8f0;">${phone || "N/A"}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Membership Level:</td>
              <td style="color: #a81c24; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${cleanTier}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Amount Paid:</td>
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">$${amount}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Member ID:</td>
              <td style="font-family: monospace; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${memberId}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">City & State:</td>
              <td style="border-bottom: 1px solid #e2e8f0;">${city}, ${state}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Business Category:</td>
              <td style="border-bottom: 1px solid #e2e8f0;">${category}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Website URL:</td>
              <td style="border-bottom: 1px solid #e2e8f0;">${website ? `<a href="${website}">${website}</a>` : "N/A"}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Directory Status:</td>
              <td style="color: #16a34a; font-weight: bold; border-bottom: 1px solid #e2e8f0;">✓ Auto-Published to Directory</td>
            </tr>
            <tr>
              <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Stripe Session ID:</td>
              <td style="font-family: monospace; font-size: 11px; border-bottom: 1px solid #e2e8f0;">${sessionId || "N/A"}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f8fafc; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Sent automatically by Community Commerce Melissa Website System
        </div>
      </div>
    </body>
    </html>
  `;

  // Dispatch both emails
  const [memberResult, adminResult] = await Promise.allSettled([
    // Email to Member
    sendEmail({
      to: memberEmail,
      replyTo: adminEmail,
      subject: `🎉 Welcome to Community Commerce Melissa — Your Official Member Badge & Details (${businessName})`,
      html: memberHtml,
    }),
    // Email to Admin
    sendEmail({
      to: adminEmail,
      replyTo: memberEmail,
      subject: `🚨 New Member Sign Up: ${businessName} — ${cleanTier} ($${amount})`,
      html: adminHtml,
    }),
  ]);

  // Log in database
  await saveContactToDb({
    email: memberEmail,
    formType: "Paid Membership Dispatched",
    source: "Stripe Payment Completion",
    details: {
      "Member ID": memberId,
      "Business Name": businessName,
      "Owner Name": ownerName || "N/A",
      "Tier": cleanTier,
      "Amount Paid": `$${amount}`,
      "City": city,
      "State": state,
      "Phone": phone,
      "Category": category,
      "Website": website,
      "Admin Notified": adminEmail,
    },
  });

  return { memberResult, adminResult };
}
