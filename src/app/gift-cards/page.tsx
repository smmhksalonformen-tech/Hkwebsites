import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { SiteShell } from "@/components/site/site-shell";
import { Container } from "@/components/site/container";
import { GiftCardBuyer } from "@/components/site/gift-card-buyer";
import { GIFT_CARDS_LIVE } from "@/lib/gift-cards";

export const revalidate = 60;

export const metadata: Metadata = {
  title: GIFT_CARDS_LIVE ? "Gift Cards — HK Salon For Men" : "Gift Cards: Launching Soon — HK Salon For Men",
  description: GIFT_CARDS_LIVE
    ? "Gift a premium grooming experience. HK Salon For Men gift cards in Rs 5,000 and Rs 10,000, delivered to your door or ready for pickup in Gulgasht Colony, Multan."
    : "HK Salon For Men gift cards are launching soon.",
  alternates: { canonical: "/gift-cards" },
  openGraph: {
    type: "website",
    title: "Gift Cards — HK Salon For Men",
    description: "Gift a premium grooming experience at HK Salon For Men, Multan.",
    images: ["/gift-card/10000.jpg"],
  },
};

export default async function GiftCardsPage() {
  const settings = await db.setting.findUnique({ where: { id: 1 } });
  if (!settings) return null;

  return (
    <SiteShell settings={settings}>
      {/* Light canvas matched to the product photo backdrop so the images bleed into the page. */}
      <section className="bg-[#f4f1ed] py-10 text-[#1c1a19] sm:py-14">
        <Container>{GIFT_CARDS_LIVE ? <GiftCardBuyer /> : <LaunchingSoon whatsapp={settings.whatsapp} />}</Container>
      </section>
    </SiteShell>
  );
}

function LaunchingSoon({ whatsapp }: { whatsapp: string }) {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center py-12 text-center">
      <p className="font-mono text-[11px] uppercase tracking-luxe-sm text-[#8a6d4b]">HK Salon For Men</p>
      <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">Gift Cards</h1>
      <p className="mt-3 font-display text-3xl italic text-[#8a6d4b] sm:text-4xl">Launching soon</p>
      <p className="mt-6 text-[#1c1a19]/70">
        We&apos;re putting the finishing touches on something special. Check back soon.
      </p>
      <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi HK Salon For Men, please let me know when gift cards launch.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#1c1a19] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4f1ed] transition-colors hover:bg-[#3a3533]"
        >
          Notify me on WhatsApp
        </a>
        <Link
          href="/"
          className="rounded-full border border-[#1c1a19] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-[#1c1a19] hover:text-[#f4f1ed]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
