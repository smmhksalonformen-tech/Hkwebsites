import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SiteShell } from "@/components/site/site-shell";
import { Container } from "@/components/site/container";
import { GiftCardBuyer } from "@/components/site/gift-card-buyer";
import { GIFT_CARD_TERMS } from "@/lib/gift-cards";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gift Cards — HK Salon For Men",
  description:
    "Gift a premium grooming experience. HK Salon For Men gift cards in Rs 5,000 and Rs 10,000, delivered to your door or ready for pickup in Gulgasht Colony, Multan.",
  alternates: { canonical: "/gift-cards" },
  openGraph: {
    type: "website",
    title: "Gift Cards — HK Salon For Men",
    description: "Gift a premium grooming experience at HK Salon For Men, Multan.",
  },
};

const STEPS = [
  { n: "01", title: "Choose & checkout", body: "Pick a card value, add it to your cart and enter delivery details." },
  { n: "02", title: "Pay by bank transfer", body: "Transfer the total and send us the screenshot on WhatsApp." },
  { n: "03", title: "We deliver", body: "Your printed card is delivered to your door, or ready at the salon." },
];

export default async function GiftCardsPage() {
  const settings = await db.setting.findUnique({ where: { id: 1 } });
  if (!settings) return null;

  return (
    <SiteShell settings={settings}>
      <section className="py-14 sm:py-20">
        <Container>
          <GiftCardBuyer />
        </Container>
      </section>

      <section className="border-t border-ink-line py-16 sm:py-20">
        <Container>
          <p className="font-mono text-xs uppercase tracking-luxe-sm text-bronze">How it works</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <span className="font-display text-4xl text-bronze/70">{s.n}</span>
                <h2 className="mt-2 font-display text-2xl text-cream">{s.title}</h2>
                <p className="mt-2 text-sm text-cream/60">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="terms" className="border-t border-ink-line py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-cream">Terms &amp; Conditions</h2>
            <ul className="mt-6 space-y-3">
              {GIFT_CARD_TERMS.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-cream/70">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bronze" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
