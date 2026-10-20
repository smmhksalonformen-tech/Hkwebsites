"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Minus, Plus, Store, Truck, ShieldCheck } from "lucide-react";
import { cn, formatPKR } from "@/lib/utils";
import { GIFT_CARD_AMOUNTS, GIFT_CARD_TERMS, MAX_QTY_PER_CARD } from "@/lib/gift-cards";
import { useCart } from "./cart-context";
import { GiftCardPhoto } from "./gift-card-visual";

const BENEFITS = [
  "Redeemable on every service: cuts, beard work, facials, Hydrafacial and grooming packages.",
  "A printed, premium card in a matte finish, ready to hand over.",
  "Perfect for birthdays, weddings, Eid and every groom-to-be.",
  "Available in Rs 5,000 and Rs 10,000.",
];

const SECTIONS: { title: string; text?: string; list?: string[] }[] = [
  {
    title: "Description",
    text: "Give him the full HK experience at our Gulgasht Colony flagship: precise cuts, sculpted beards and skin treatments in a lounge built for men. The card is printed and delivered to your door, or ready to collect at the salon.",
  },
  { title: "Key benefits", list: BENEFITS },
  { title: "Terms & conditions", list: GIFT_CARD_TERMS },
  {
    title: "Payment & delivery",
    text: "Pay by bank transfer after placing your order, then send the screenshot on WhatsApp. Once payment is confirmed we deliver your card for free, or have it ready for pickup at the salon.",
  },
];

export function GiftCardBuyer() {
  const router = useRouter();
  const { add } = useCart();
  const [amount, setAmount] = useState<number>(GIFT_CARD_AMOUNTS[0]);
  const [qty, setQty] = useState(1);

  function handleAdd() {
    add(amount, qty);
    toast.success(`${qty} × ${formatPKR(amount)} gift card added`, {
      action: { label: "View cart", onClick: () => router.push("/cart") },
    });
    setQty(1);
  }

  function handleBuyNow() {
    add(amount, qty);
    router.push("/cart");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
      {/* Gallery: full product photo + thumbnails */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="relative">
          {GIFT_CARD_AMOUNTS.map((a, i) => (
            <GiftCardPhoto
              key={a}
              amount={a}
              priority={i === 0}
              className={cn("transition-opacity duration-500", i > 0 && "absolute inset-0", amount === a ? "opacity-100" : "opacity-0")}
            />
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          {GIFT_CARD_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              aria-label={`Show ${formatPKR(a)} card`}
              className={cn(
                "w-20 overflow-hidden rounded-md ring-1 transition sm:w-24",
                amount === a ? "ring-[#1c1a19]" : "ring-black/10 opacity-70 hover:opacity-100"
              )}
            >
              <GiftCardPhoto amount={a} />
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="lg:pt-6">
        <p className="font-mono text-[11px] uppercase tracking-luxe-sm text-[#8a6d4b]">HK Salon For Men</p>
        <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">HK Gift Card</h1>
        <p className="mt-3 font-display text-3xl tabular-nums">{formatPKR(amount)}</p>
        <p className="mt-1 text-xs text-[#1c1a19]/50">Free delivery · Pay by bank transfer</p>

        <div className="mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1c1a19]/60">Value</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Card value">
            {GIFT_CARD_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={amount === a}
                onClick={() => setAmount(a)}
                className={cn(
                  "min-w-28 rounded-full border px-5 py-2.5 text-sm tabular-nums transition-colors",
                  amount === a
                    ? "border-[#1c1a19] bg-[#1c1a19] text-[#f4f1ed]"
                    : "border-[#1c1a19]/20 hover:border-[#1c1a19]"
                )}
              >
                {a.toLocaleString("en-PK")}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1c1a19]/60">Quantity</p>
          <div className="mt-3 inline-flex items-center rounded-full border border-[#1c1a19]/20">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="p-3 disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(MAX_QTY_PER_CARD, q + 1))}
              disabled={qty >= MAX_QTY_PER_CARD}
              className="p-3 disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-full border border-[#1c1a19] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-[#1c1a19] hover:text-[#f4f1ed]"
          >
            Add to cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full rounded-full bg-[#1c1a19] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f1ed] transition-colors hover:bg-[#3a3533]"
          >
            Buy now · {formatPKR(amount * qty)}
          </button>
        </div>

        <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-[#1c1a19]/60">
          <li className="flex flex-col items-center gap-1.5"><Truck className="h-4 w-4" /> Free delivery</li>
          <li className="flex flex-col items-center gap-1.5"><Store className="h-4 w-4" /> Or pick up at salon</li>
          <li className="flex flex-col items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Valid 6 months</li>
        </ul>

        <div className="mt-10 divide-y divide-[#1c1a19]/10 border-y border-[#1c1a19]/10">
          {SECTIONS.map((s, i) => (
            <details key={s.title} open={i === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {s.title}
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-5 text-sm leading-relaxed text-[#1c1a19]/70">
                {s.text && <p>{s.text}</p>}
                {s.list && (
                  <ul className="space-y-2">
                    {s.list.map((t) => (
                      <li key={t} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#1c1a19]/50" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
