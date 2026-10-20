import type { Metadata } from "next";
import { db } from "@/lib/db";
import { GiftCardOrderRow } from "@/components/admin/gift-card-order-row";
import { formatPKR } from "@/lib/utils";
import type { OrderItem } from "@/lib/gift-cards";

export const metadata: Metadata = { title: "Gift Cards — HK Salon Admin" };

export default async function AdminGiftCardsPage() {
  const orders = await db.giftCardOrder.findMany({ orderBy: { createdAt: "desc" } });
  const pending = orders.filter((o) => o.status === "pending_payment").length;
  const toDeliver = orders.filter((o) => o.status === "paid").length;
  const paidTotal = orders
    .filter((o) => ["paid", "dispatched", "delivered"].includes(o.status))
    .reduce((n, o) => n + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-cream">Gift Card Orders</h1>
        <p className="text-sm text-cream/50 mt-1">
          Check the bank transfer, mark the order Paid, write the card number(s) you send, then update the status as it ships.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Awaiting payment", value: String(pending) },
          { label: "Paid, to deliver", value: String(toDeliver) },
          { label: "Total sold", value: formatPKR(paidTotal) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-ink-line bg-ink-soft p-4">
            <p className="text-[10px] font-mono uppercase tracking-luxe-sm text-cream/40">{s.label}</p>
            <p className="mt-1 font-display text-2xl text-cream">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-ink-line bg-ink-soft divide-y divide-ink-line">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-cream/40">No gift card orders yet.</p>
        ) : (
          orders.map((o) => (
            <GiftCardOrderRow
              key={o.id}
              order={{
                id: o.id,
                reference: o.reference,
                token: o.token,
                name: o.name,
                phone: o.phone,
                email: o.email,
                deliveryMethod: o.deliveryMethod,
                city: o.city,
                address: o.address,
                recipientName: o.recipientName,
                giftMessage: o.giftMessage,
                items: o.items as OrderItem[],
                total: o.total,
                status: o.status,
                cardNumbers: o.cardNumbers,
                adminNote: o.adminNote,
                createdAt: o.createdAt.toISOString(),
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
