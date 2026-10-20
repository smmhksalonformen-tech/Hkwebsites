"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ExternalLink, Loader2, MessageCircle, Save } from "lucide-react";
import { cn, formatPKR } from "@/lib/utils";
import { ORDER_STATUSES, statusLabel, type OrderItem } from "@/lib/gift-cards";
import { deleteGiftCardOrder, updateGiftCardOrder } from "@/lib/actions/gift-cards";
import { DeleteButton } from "./delete-button";

type Order = {
  id: string;
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
  status: string;
  cardNumbers: string;
  adminNote: string;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending_payment: "bg-amber-500/10 text-amber-400",
  paid: "bg-sky-500/10 text-sky-400",
  dispatched: "bg-violet-500/10 text-violet-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-cream/10 text-cream/50",
};

const FIELD = "w-full rounded-lg border border-ink-line bg-ink-deep px-3 py-2 text-sm text-cream focus:border-bronze focus:outline-none";
const LABEL = "text-xs font-mono uppercase tracking-luxe-sm text-cream/50";

function waNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? "92" + digits.slice(1) : digits;
}

export function GiftCardOrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [open, setOpen] = useState(order.status === "pending_payment" || order.status === "paid");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateGiftCardOrder(order.id, formData);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const summary = order.items.map((it) => `${it.qty}× ${formatPKR(it.amount)}`).join(", ");
  const date = new Date(order.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full p-4 flex items-center justify-between gap-4 text-left">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm text-cream">{order.reference}</p>
            <span className={cn("text-[10px] uppercase px-2 py-0.5 rounded-full shrink-0", STATUS_STYLES[order.status])}>
              {statusLabel(order.status)}
            </span>
          </div>
          <p className="text-xs text-cream/40 truncate">{order.name} · {summary} · {date}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm text-cream tabular-nums">{formatPKR(order.total)}</span>
          <ChevronDown className={cn("h-4 w-4 text-cream/40 transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 grid gap-6 lg:grid-cols-2">
          <div className="space-y-1.5 text-sm text-cream/70">
            <p><span className="text-cream/40">Customer:</span> {order.name}</p>
            <p className="flex items-center gap-2">
              <span className="text-cream/40">Phone:</span> {order.phone}
              <a href={`https://wa.me/${waNumber(order.phone)}`} target="_blank" rel="noopener noreferrer" className="text-bronze hover:text-champagne" aria-label="WhatsApp customer">
                <MessageCircle className="h-4 w-4" />
              </a>
            </p>
            {order.email && <p><span className="text-cream/40">Email:</span> {order.email}</p>}
            <p>
              <span className="text-cream/40">{order.deliveryMethod === "pickup" ? "Pickup" : "Deliver to"}:</span>{" "}
              {order.deliveryMethod === "pickup" ? "at the salon" : `${order.address}, ${order.city}`}
            </p>
            {order.recipientName && <p><span className="text-cream/40">Gift for:</span> {order.recipientName}</p>}
            {order.giftMessage && <p className="italic text-cream/60">&ldquo;{order.giftMessage}&rdquo;</p>}
            <p><span className="text-cream/40">Cards:</span> {summary}</p>
            <a href={`/gift-cards/order/${order.token}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-bronze hover:text-champagne">
              Customer&apos;s order page <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className={LABEL}>Status</label>
              <select name="status" defaultValue={order.status} className={FIELD}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Card number(s) sent</label>
              <input name="cardNumbers" defaultValue={order.cardNumbers} placeholder="HKM-GC-000101, HKM-GC-000102" className={FIELD} />
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Internal note</label>
              <textarea name="adminNote" defaultValue={order.adminNote} rows={2} className={FIELD} />
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-bronze px-4 py-2 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
              <DeleteButton action={deleteGiftCardOrder} id={order.id} label={`order ${order.reference}`} />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
