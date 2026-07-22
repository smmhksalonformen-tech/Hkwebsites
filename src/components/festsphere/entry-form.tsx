"use client";

import { useState, useTransition } from "react";
import { PartyPopper, Copy, Check } from "lucide-react";
import { submitFestsphereEntry } from "@/lib/actions/festsphere";

export function FestsphereEntryForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitFestsphereEntry(formData);
      if (result.success) {
        setCouponCode(result.couponCode);
      } else {
        setError(result.error);
      }
    });
  }

  function handleCopy() {
    if (!couponCode) return;
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (couponCode) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-bronze/30 bg-ink-soft px-6 py-10 text-center animate-bubble-in">
        <ConfettiBurst />
        <PartyPopper className="mx-auto h-10 w-10 text-bronze" strokeWidth={1.5} />
        <h2 className="font-display mt-4 text-3xl italic text-champagne">Hurray!</h2>
        <p className="mt-2 text-sm text-cream/80">
          You&rsquo;ve got <span className="font-semibold text-bronze">10% off</span> your next visit at HK Salon Men Multan.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="rounded-lg border border-bronze/40 bg-ink px-4 py-2 font-mono text-lg tracking-widest text-champagne">
            {couponCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-bronze/40 text-bronze transition-colors hover:bg-bronze/10"
            aria-label="Copy coupon code"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-4 text-xs text-cream/50">
          Show this code at HK Salon For Men, Gulgasht Colony, Multan. Valid for a limited time after Fest Sphere Mega Summer Bazar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Name</label>
        <input
          name="name"
          required
          placeholder="Your full name"
          className="w-full rounded-lg border border-ink-line bg-ink-soft px-4 py-3 text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Phone Number</label>
        <input
          name="phone"
          type="tel"
          required
          placeholder="03XX-XXXXXXX"
          className="w-full rounded-lg border border-ink-line bg-ink-soft px-4 py-3 text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Address</label>
        <input
          name="address"
          required
          placeholder="Your area / address in Multan"
          className="w-full rounded-lg border border-ink-line bg-ink-soft px-4 py-3 text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-luxe-sm text-ink-deep transition-colors hover:bg-champagne disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Claim My 10% Off"}
      </button>
    </form>
  );
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 16 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 h-2 w-2 rounded-sm bg-bronze animate-confetti"
          style={{
            // @ts-expect-error -- custom properties consumed by the confetti keyframes
            "--angle": `${(360 / pieces.length) * i}deg`,
            "--delay": `${(i % 4) * 0.05}s`,
            backgroundColor: i % 3 === 0 ? "var(--color-champagne)" : i % 3 === 1 ? "var(--color-bronze)" : "var(--color-bronze-deep)",
          }}
        />
      ))}
    </div>
  );
}
