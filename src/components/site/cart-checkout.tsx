"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Gift, Landmark, Loader2, Minus, Plus, Store, Trash2, Truck } from "lucide-react";
import { cn, formatPKR } from "@/lib/utils";
import { MAX_QTY_PER_CARD } from "@/lib/gift-cards";
import { createGiftCardOrder } from "@/lib/actions/gift-cards";
import { useCart } from "./cart-context";
import { GiftCardFront } from "./gift-card-visual";

const FIELD =
  "w-full rounded-lg border border-ink-line bg-ink-soft px-3.5 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none";
const LABEL = "mb-1.5 block text-xs font-mono uppercase tracking-luxe-sm text-cream/50";

export function CartCheckout() {
  const router = useRouter();
  const { items, total, count, ready, setQty, remove, clear } = useCart();
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery");
  const [isGift, setIsGift] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!ready) {
    return <div className="h-64 animate-pulse rounded-2xl border border-ink-line bg-ink-soft/50" />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-line px-6 py-16 text-center">
        <Gift className="mx-auto h-8 w-8 text-bronze" />
        <p className="mt-4 font-display text-2xl text-cream">Your cart is empty</p>
        <p className="mt-2 text-sm text-cream/50">Gift someone the HK experience.</p>
        <Link
          href="/gift-cards"
          className="mt-6 inline-block rounded-lg bg-bronze px-6 py-3 text-xs font-bold uppercase tracking-wide text-ink-deep hover:bg-champagne"
        >
          Shop gift cards
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    startTransition(async () => {
      const result = await createGiftCardOrder({
        items,
        name: get("name"),
        phone: get("phone"),
        email: get("email"),
        deliveryMethod: delivery,
        city: get("city"),
        address: get("address"),
        recipientName: isGift ? get("recipientName") : "",
        giftMessage: isGift ? get("giftMessage") : "",
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      clear();
      router.push(`/gift-cards/order/${result.token}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
      {/* Details */}
      <div className="order-2 space-y-8 lg:order-1">
        <fieldset className="space-y-4">
          <legend className="mb-4 font-display text-2xl text-cream">Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={LABEL}>Full name</label>
              <input id="name" name="name" required autoComplete="name" className={FIELD} />
            </div>
            <div>
              <label htmlFor="phone" className={LABEL}>Phone / WhatsApp</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="03XX XXXXXXX" className={FIELD} />
            </div>
          </div>
          <div>
            <label htmlFor="email" className={LABEL}>Email (optional)</label>
            <input id="email" name="email" type="email" autoComplete="email" className={FIELD} />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 font-display text-2xl text-cream">Delivery</legend>
          <div className="grid grid-cols-2 gap-3" role="radiogroup">
            {[
              { v: "delivery" as const, label: "Deliver to me", Icon: Truck },
              { v: "pickup" as const, label: "Pick up at salon", Icon: Store },
            ].map(({ v, label, Icon }) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={delivery === v}
                onClick={() => setDelivery(v)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-4 py-3.5 text-sm transition-colors",
                  delivery === v ? "border-bronze bg-bronze/[0.08] text-cream" : "border-ink-line text-cream/60 hover:border-bronze/60"
                )}
              >
                <Icon className={cn("h-4 w-4", delivery === v && "text-bronze")} /> {label}
              </button>
            ))}
          </div>
          {delivery === "delivery" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_2fr]">
              <div>
                <label htmlFor="city" className={LABEL}>City</label>
                <input id="city" name="city" required autoComplete="address-level2" defaultValue="Multan" className={FIELD} />
              </div>
              <div>
                <label htmlFor="address" className={LABEL}>Full address</label>
                <input id="address" name="address" required autoComplete="street-address" placeholder="House, street, area" className={FIELD} />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-cream/50">
              Collect your card from 7-B Tulip Street, Gulgasht Colony, Multan, once your payment is confirmed.
            </p>
          )}
        </fieldset>

        <fieldset>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-cream/80">
            <input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} className="h-4 w-4 accent-[var(--color-bronze)]" />
            This is a gift: add the recipient&apos;s name and a note
          </label>
          {isGift && (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="recipientName" className={LABEL}>Recipient&apos;s name</label>
                <input id="recipientName" name="recipientName" maxLength={80} className={FIELD} />
              </div>
              <div>
                <label htmlFor="giftMessage" className={LABEL}>Gift note (optional)</label>
                <textarea id="giftMessage" name="giftMessage" rows={3} maxLength={300} className={FIELD} />
              </div>
            </div>
          )}
        </fieldset>

        <div className="flex gap-3 rounded-xl border border-ink-line bg-ink-soft p-4">
          <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-bronze" />
          <div>
            <p className="text-sm font-medium text-cream">Payment: bank transfer</p>
            <p className="mt-1 text-sm text-cream/50">
              After you place the order you&apos;ll see our bank details and your order reference. Send us the transfer
              screenshot on WhatsApp and we&apos;ll dispatch your card.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <aside className="order-1 rounded-2xl border border-ink-line bg-ink-soft/60 p-5 lg:sticky lg:top-24 lg:order-2">
        <h2 className="font-display text-2xl text-cream">Order summary</h2>
        <ul className="mt-5 divide-y divide-ink-line">
          {items.map((it) => (
            <li key={it.amount} className="flex items-center gap-4 py-4 first:pt-0">
              <GiftCardFront amount={it.amount} className="w-24 shrink-0 shadow-none" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-cream">Gift Card · {formatPKR(it.amount)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center rounded-md border border-ink-line">
                    <button type="button" onClick={() => setQty(it.amount, it.qty - 1)} className="p-1.5 text-cream/60 hover:text-cream" aria-label="Decrease quantity">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums text-cream">{it.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(it.amount, it.qty + 1)}
                      disabled={it.qty >= MAX_QTY_PER_CARD}
                      className="p-1.5 text-cream/60 hover:text-cream disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button type="button" onClick={() => remove(it.amount)} className="p-1.5 text-cream/40 hover:text-red-400" aria-label="Remove">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm tabular-nums text-cream">{formatPKR(it.amount * it.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-2 border-t border-ink-line pt-4 text-sm">
          <div className="flex justify-between text-cream/60">
            <span>{count} {count === 1 ? "card" : "cards"}</span>
            <span className="tabular-nums">{formatPKR(total)}</span>
          </div>
          <div className="flex justify-between text-cream/60">
            <span>Delivery</span>
            <span>{delivery === "pickup" ? "Pickup" : "Free"}</span>
          </div>
          <div className="flex justify-between pt-2 font-display text-2xl text-cream">
            <span>Total</span>
            <span className="tabular-nums text-bronze">{formatPKR(total)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-bronze px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-ink-deep transition-colors hover:bg-champagne disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Place order
        </button>
        <Link href="/gift-cards" className="mt-3 block text-center text-xs text-cream/50 hover:text-cream">
          Continue shopping
        </Link>
      </aside>
    </form>
  );
}
