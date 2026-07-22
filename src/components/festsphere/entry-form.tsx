"use client";

import { useState, useTransition } from "react";
import { PartyPopper, Copy, Check } from "lucide-react";
import { submitFestsphereEntry } from "@/lib/actions/festsphere";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/site/social-icons";

type SocialLinks = {
  instagram: string;
  facebook: string;
  tiktok: string;
};

export function FestsphereEntryForm({ socials }: { socials: SocialLinks }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

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
    <div>
      <div className="rounded-2xl border border-bronze/30 bg-ink-soft p-5">
        <p className="text-center text-xs font-semibold uppercase tracking-luxe-sm text-bronze">
          Follow us to unlock your 10% off
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <SocialButton
            href={`https://www.instagram.com/${socials.instagram}/`}
            label="Instagram"
            onOpen={() => setUnlocked(true)}
            icon={<InstagramIcon className="h-5 w-5" />}
          />
          <SocialButton
            href={`https://www.facebook.com/${socials.facebook}`}
            label="Facebook"
            onOpen={() => setUnlocked(true)}
            icon={<FacebookIcon className="h-5 w-5" />}
          />
          <SocialButton
            href={`https://www.tiktok.com/@${socials.tiktok}`}
            label="TikTok"
            onOpen={() => setUnlocked(true)}
            icon={<TikTokIcon className="h-5 w-5" />}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Date of Birth</label>
          <input
            name="dob"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-4 py-3 text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none [color-scheme:dark]"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isPending || !unlocked}
          className="w-full rounded-lg bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-luxe-sm text-ink-deep transition-colors hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Submitting…" : unlocked ? "Claim My 10% Off" : "Tap a button above to unlock"}
        </button>
      </form>
    </div>
  );
}

function SocialButton({
  href,
  label,
  icon,
  onOpen,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onOpen: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onOpen}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-ink-line bg-ink px-2 py-3 text-bronze transition-colors hover:border-bronze hover:bg-bronze/10"
    >
      {icon}
      <span className="text-[10px] font-semibold uppercase tracking-wide text-cream/60">{label}</span>
    </a>
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
