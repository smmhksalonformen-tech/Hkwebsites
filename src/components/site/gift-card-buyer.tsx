"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus, RotateCw, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { cn, formatPKR } from "@/lib/utils";
import { GIFT_CARD_AMOUNTS, MAX_QTY_PER_CARD } from "@/lib/gift-cards";
import { useCart } from "./cart-context";
import { GiftCardBack, GiftCardFront } from "./gift-card-visual";

export function GiftCardBuyer() {
  const router = useRouter();
  const { add } = useCart();
  const [amount, setAmount] = useState<number>(GIFT_CARD_AMOUNTS[0]);
  const [qty, setQty] = useState(1);
  const [flipped, setFlipped] = useState(false);

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
    <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      {/* Card preview with flip */}
      <div>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="group block w-full [perspective:1600px]"
          aria-label={flipped ? "Show front of card" : "Show back of card"}
        >
          <div
            className={cn(
              "relative transition-transform duration-700 [transform-style:preserve-3d]",
              flipped && "[transform:rotateY(180deg)]"
            )}
          >
            <div className="[backface-visibility:hidden]">
              <GiftCardFront amount={amount} />
            </div>
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <GiftCardBack />
            </div>
          </div>
        </button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-cream/40">
          <RotateCw className="h-3.5 w-3.5" /> Tap the card to see the {flipped ? "front" : "back"}
        </p>
      </div>

      {/* Purchase panel */}
      <div>
        <p className="font-mono text-xs uppercase tracking-luxe-sm text-bronze">The perfect gift</p>
        <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">HK Gift Card</h1>
        <p className="mt-4 text-cream/60">
          Give him the full HK experience — sharp cuts, beard work, facials and grooming at our Gulgasht Colony
          flagship. A printed card, delivered to your door.
        </p>

        <p className="mt-8 text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Card value</p>
        <div className="mt-3 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Card value">
          {GIFT_CARD_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={amount === a}
              onClick={() => {
                setAmount(a);
                setFlipped(false);
              }}
              className={cn(
                "rounded-xl border px-4 py-4 text-left transition-colors",
                amount === a ? "border-bronze bg-bronze/[0.08]" : "border-ink-line hover:border-bronze/60"
              )}
            >
              <span className={cn("block font-display text-2xl", amount === a ? "text-bronze" : "text-cream")}>
                {formatPKR(a)}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-stretch gap-3">
          <div className="flex items-center rounded-lg border border-ink-line">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="p-3 text-cream/70 hover:text-cream disabled:opacity-30"
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center tabular-nums text-cream" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(MAX_QTY_PER_CARD, q + 1))}
              className="p-3 text-cream/70 hover:text-cream disabled:opacity-30"
              disabled={qty >= MAX_QTY_PER_CARD}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-bronze px-5 py-3 text-xs font-bold uppercase tracking-wide text-bronze transition-colors hover:bg-bronze/10"
          >
            <ShoppingBag className="h-4 w-4" /> Add to cart
          </button>
        </div>
        <button
          type="button"
          onClick={handleBuyNow}
          className="mt-3 w-full rounded-lg bg-bronze px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-ink-deep transition-colors hover:bg-champagne"
        >
          Buy now · {formatPKR(amount * qty)}
        </button>

        <div className="mt-6 space-y-2 text-sm text-cream/50">
          <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-bronze" /> Home delivery or pickup at the salon</p>
          <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-bronze" /> Valid for 6 months · <a href="#terms" className="underline underline-offset-2 hover:text-cream">Terms apply</a></p>
        </div>
      </div>
    </div>
  );
}
