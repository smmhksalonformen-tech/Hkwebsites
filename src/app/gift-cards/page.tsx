import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SiteShell } from "@/components/site/site-shell";
import { Container } from "@/components/site/container";
import { GiftCardBuyer } from "@/components/site/gift-card-buyer";

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
        <Container>
          <GiftCardBuyer />
        </Container>
      </section>
    </SiteShell>
  );
}
