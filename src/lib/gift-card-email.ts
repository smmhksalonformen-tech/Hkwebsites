import { getTransport } from "@/lib/birthday-email";
import { formatPKR } from "@/lib/utils";
import type { OrderItem } from "@/lib/gift-cards";

const SITE_URL = "https://www.hksalonformen.com";

type Order = {
  reference: string;
  token: string;
  name: string;
  phone: string;
  email: string | null;
  deliveryMethod: string;
  city: string;
  address: string;
  recipientName: string | null;
  giftMessage: string | null;
  items: OrderItem[];
  total: number;
};

/** Emails the salon (GMAIL_USER, or ORDER_NOTIFY_EMAIL if set) when a gift card order is placed. */
export async function sendGiftCardOrderAlert(order: Order) {
  const transport = getTransport();
  if (!transport) {
    console.warn("[gift-card-email] GMAIL_USER/GMAIL_APP_PASSWORD not set — skipping send.");
    return;
  }

  const from = process.env.GMAIL_USER!;
  const to = process.env.ORDER_NOTIFY_EMAIL || from;
  const count = order.items.reduce((n, it) => n + it.qty, 0);

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0; color:#f3eadd99; font-size:13px; width:130px; vertical-align:top;">${label}</td>
      <td style="padding:8px 0; color:#f3eadd; font-size:14px;">${value}</td>
    </tr>`;

  const items = order.items
    .map((it) => `${it.qty} × Gift Card ${formatPKR(it.amount)} = <strong>${formatPKR(it.amount * it.qty)}</strong>`)
    .join("<br/>");

  const delivery =
    order.deliveryMethod === "pickup"
      ? "Pickup at the salon"
      : `${escapeHtml(order.address)}, ${escapeHtml(order.city)}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background:#100f0d; color:#f3eadd; border-radius:16px; overflow:hidden;">
      <div style="padding:24px 32px; border-bottom:1px solid #2a251e;">
        <p style="margin:0; font-size:12px; text-transform:uppercase; letter-spacing:0.2em; color:#c9b18b; font-weight:600;">New gift card order</p>
        <h1 style="margin:8px 0 0; font-size:24px; color:#e7d8bf; font-weight:600;">${order.reference} · ${formatPKR(order.total)}</h1>
        <p style="margin:6px 0 0; font-size:13px; color:#f3eadd99;">Awaiting bank transfer. Check for the payment, then mark it Paid in admin.</p>
      </div>
      <div style="padding:16px 32px;">
        <table style="width:100%; border-collapse:collapse;">
          ${row("Cards", items)}
          ${row("Customer", escapeHtml(order.name))}
          ${row("Phone", `<a href="https://wa.me/${waNumber(order.phone)}" style="color:#c9b18b;">${escapeHtml(order.phone)}</a>`)}
          ${order.email ? row("Email", escapeHtml(order.email)) : ""}
          ${row(order.deliveryMethod === "pickup" ? "Delivery" : "Deliver to", delivery)}
          ${order.recipientName ? row("Gift for", escapeHtml(order.recipientName)) : ""}
          ${order.giftMessage ? row("Gift note", `<em>${escapeHtml(order.giftMessage)}</em>`) : ""}
        </table>
        <a href="${SITE_URL}/admin/gift-cards" style="display:inline-block; margin:20px 0 8px; padding:12px 24px; background:#c9b18b; color:#100f0d; font-weight:700; text-decoration:none; border-radius:8px; font-size:13px; text-transform:uppercase; letter-spacing:0.1em;">
          Open in admin
        </a>
      </div>
    </div>
  `;

  await transport.sendMail({
    from: `HK Salon Website <${from}>`,
    to,
    replyTo: order.email || undefined,
    subject: `New gift card order ${order.reference}: ${count} card${count === 1 ? "" : "s"}, ${formatPKR(order.total)}`,
    html,
  });
}

function waNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? "92" + digits.slice(1) : digits;
}

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
