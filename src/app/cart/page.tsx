import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { GIFT_CARDS_LIVE } from "@/lib/gift-cards";
import { SiteShell } from "@/components/site/site-shell";
import { Container } from "@/components/site/container";
import { CartCheckout } from "@/components/site/cart-checkout";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Your Cart — HK Salon For Men",
  robots: { index: false },
};

export default async function CartPage() {
  if (!GIFT_CARDS_LIVE) redirect("/gift-cards");
  const settings = await db.setting.findUnique({ where: { id: 1 } });
  if (!settings) return null;

  return (
    <SiteShell settings={settings}>
      <section className="py-12 sm:py-16">
        <Container>
          <h1 className="font-display text-4xl text-cream sm:text-5xl">Cart &amp; Checkout</h1>
          <div className="mt-8">
            <CartCheckout />
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
