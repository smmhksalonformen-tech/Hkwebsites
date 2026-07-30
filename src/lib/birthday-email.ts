import nodemailer from "nodemailer";

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function couponCode(name: string) {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `HKBDAY-${random}`;
}

export async function sendBirthdayEmail(input: { name: string; email: string }) {
  const transport = getTransport();
  if (!transport) {
    console.warn("[birthday-email] GMAIL_USER/GMAIL_APP_PASSWORD not set — skipping send.");
    return { skipped: true };
  }

  const from = process.env.GMAIL_USER;
  const siteUrl = "https://www.hksalonformen.com";
  const code = couponCode(input.name);

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background:#100f0d; color:#f3eadd; border-radius:16px; overflow:hidden;">
      <div style="padding:32px 32px 16px; text-align:center; border-bottom:1px solid #2a251e;">
        <img src="${siteUrl}/logo-cream.png" alt="HK Salon For Men" style="height:40px; width:auto;" />
      </div>
      <div style="padding:32px; text-align:center;">
        <p style="margin:0; font-size:13px; text-transform:uppercase; letter-spacing:0.2em; color:#c9b18b; font-weight:600;">
          Happy Birthday
        </p>
        <h1 style="margin:12px 0 0; font-size:28px; font-style:italic; color:#e7d8bf; font-weight:600;">
          ${escapeHtml(input.name)}!
        </h1>
        <p style="margin:16px 0 0; font-size:15px; line-height:1.6; color:#f3eadd;">
          From all of us at HK Salon For Men, we wish you a fantastic year ahead. As our small gift to you,
          enjoy <strong style="color:#c9b18b;">10% off</strong> your next visit.
        </p>
        <div style="margin:28px 0; padding:16px; background:#1b1813; border:1px solid #c9b18b66; border-radius:10px;">
          <p style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:0.15em; color:#f3eadd99;">Your Code</p>
          <p style="margin:4px 0 0; font-family:monospace; font-size:20px; letter-spacing:0.15em; color:#e7d8bf;">${code}</p>
        </div>
        <p style="margin:0; font-size:12px; color:#f3eadd80;">
          Show this code at HK Salon For Men, Gulgasht Colony, Multan. Valid for 14 days from today.
        </p>
        <a href="https://wa.me/923200005337" style="display:inline-block; margin-top:24px; padding:12px 28px; background:#c9b18b; color:#100f0d; font-weight:700; text-decoration:none; border-radius:8px; font-size:13px; text-transform:uppercase; letter-spacing:0.1em;">
          Book on WhatsApp
        </a>
      </div>
      <div style="padding:16px 32px; text-align:center; border-top:1px solid #2a251e;">
        <p style="margin:0; font-size:11px; color:#f3eadd60;">HK Salon For Men &middot; Gulgasht Colony, Multan</p>
      </div>
    </div>
  `;

  await transport.sendMail({
    from: `HK Salon For Men <${from}>`,
    to: input.email,
    subject: `Happy Birthday, ${input.name}! Here's 10% off from HK Salon`,
    html,
  });

  return { skipped: false, couponCode: code };
}

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
