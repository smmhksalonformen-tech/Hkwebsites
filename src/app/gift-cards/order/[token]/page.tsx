import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { SiteShell } from "@/components/site/site-shell";
import { Container } from "@/components/site/container";
import { CopyButton } from "@/components/site/copy-button";
import { formatPKR } from "@/lib/utils";
import { statusLabel, type OrderItem } from "@/lib/gift-cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Gift Card Order — HK Salon For Men",
  robots: { index: false, follow: false },
};

export default async function GiftCardOrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [settings, order] = await Promise.all([
    db.setting.findUnique({ where: { id: 1 } }),
    db.giftCardOrder.findUnique({ where: { token } }),
  ]);
  if (!settings) return null;
  if (!order) notFound();

  const items = order.items as OrderItem[];
  const awaitingPayment = order.status === "pending_payment";
  const bank = [
    { label: "Bank", value: settings.bankName },
    { label: "Account title", value: settings.bankAccountTitle },
    { label: "Account number", value: settings.bankAccountNumber },
    { label: "IBAN", value: settings.bankIban },
  ].filter((b) => b.value);

  const waText = encodeURIComponent(
    `Hi HK Salon For Men, I've paid ${formatPKR(order.total)} for gift card order ${order.reference}. Sharing the transfer screenshot.`
  );

  return (
    <SiteShell settings={settings}>
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <CheckCircle2 className="h-10 w-10 text-bronze" />
            <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
              {awaitingPayment ? "Order placed. One step left." : "Thank you for your order"}
            </h1>
            <p className="mt-3 text-cream/60">
              Order <span className="font-mono text-cream">{order.reference}</span> ·{" "}
              <span className="text-bronze">{statusLabel(order.status)}</span>
            </p>

            {awaitingPayment && (
              <div className="mt-8 rounded-2xl border border-bronze/50 bg-bronze/[0.06] p-6">
                <h2 className="font-display text-2xl text-cream">Pay by bank transfer</h2>
                <p className="mt-1 text-sm text-cream/60">
                  Transfer <span className="font-semibold text-cream">{formatPKR(order.total)}</span> and put{" "}
                  <span className="font-mono text-cream">{order.reference}</span> in the transfer note.
                </p>

                {bank.length > 0 ? (
                  <dl className="mt-5 divide-y divide-ink-line rounded-xl border border-ink-line bg-ink-deep/60">
                    {[...bank, { label: "Amount", value: formatPKR(order.total) }, { label: "Reference", value: order.reference }].map((b) => (
                      <div key={b.label} className="flex items-center justify-between gap-4 px-4 py-3">
                        <dt className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">{b.label}</dt>
                        <dd className="flex items-center gap-2 text-right text-sm text-cream">
                          <span className="break-all">{b.value}</span>
                          <CopyButton value={b.value} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-5 text-sm text-cream/70">
                    Message us on WhatsApp and we&apos;ll share our bank details right away.
                  </p>
                )}

                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-bronze px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-ink-deep transition-colors hover:bg-champagne"
                >
                  <MessageCircle className="h-4 w-4" /> Send payment screenshot on WhatsApp
                </a>
                <p className="mt-3 text-center text-xs text-cream/40">
                  Bookmark this page. It updates as your order moves along.
                </p>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-ink-line p-6">
              <h2 className="font-display text-2xl text-cream">Order details</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {items.map((it) => (
                  <li key={it.amount} className="flex justify-between text-cream/70">
                    <span>{it.qty} × Gift Card · {formatPKR(it.amount)}</span>
                    <span className="tabular-nums">{formatPKR(it.amount * it.qty)}</span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-ink-line pt-3 font-semibold text-cream">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPKR(order.total)}</span>
                </li>
              </ul>
              <div className="mt-5 space-y-1 text-sm text-cream/60">
                <p>{order.name} · {order.phone}</p>
                <p>
                  {order.deliveryMethod === "pickup"
                    ? "Pickup at the salon, Gulgasht Colony, Multan"
                    : `Deliver to: ${order.address}, ${order.city}`}
                </p>
                {order.recipientName && <p>Gift for: {order.recipientName}</p>}
              </div>
            </div>

            <Link href="/" className="mt-8 inline-block text-sm text-cream/50 hover:text-cream">
              ← Back to home
            </Link>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
