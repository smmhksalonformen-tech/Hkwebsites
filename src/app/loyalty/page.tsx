import type { Metadata } from "next";
import Image from "next/image";
import { getMyLoyaltyMember } from "@/lib/actions/loyalty";
import { LoyaltyRegisterForm } from "@/components/loyalty/register-form";
import { LoyaltyStampCard } from "@/components/loyalty/stamp-card";

export const metadata: Metadata = {
  title: "Loyalty Card | HK Salon For Men",
  description: "Collect stamps at HK Salon For Men and earn a free haircut + beard styling.",
};

export default async function LoyaltyPage() {
  const member = await getMyLoyaltyMember();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        {!member && (
          <div className="mb-8 text-center">
            <Image
              src="/logo-cream.png"
              alt="HK Salon For Men"
              width={160}
              height={64}
              className="mx-auto h-14 w-auto"
              priority
            />
            <p className="mt-4 text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Loyalty Card</p>
            <h1 className="font-display mt-3 text-4xl italic text-champagne sm:text-5xl">Collect &amp; Earn</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cream/60">
              Get a stamp every visit. Collect {""}
              <span className="text-bronze">3 stamps</span> and your next haircut + beard styling is on us.
            </p>
          </div>
        )}

        {member ? (
          <LoyaltyStampCard
            member={{
              name: member.name,
              phone: member.phone,
              stamps: member.stamps,
              timesRedeemed: member.timesRedeemed,
            }}
          />
        ) : (
          <LoyaltyRegisterForm />
        )}
      </div>
    </main>
  );
}
