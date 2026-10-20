import Image from "next/image";
import { cn } from "@/lib/utils";

// Product photos (square, light backdrop) and tight crops of just the card,
// one pair per value in GIFT_CARD_AMOUNTS.
const PHOTOS: Record<number, string> = {
  5000: "/gift-card/5000.jpg",
  10000: "/gift-card/10000.jpg",
};
const CARD_CROPS: Record<number, string> = {
  5000: "/gift-card/card-5000.jpg",
  10000: "/gift-card/card-10000.jpg",
};

const alt = (amount: number) => `HK Salon For Men gift card, Rs ${amount.toLocaleString("en-PK")}`;

/** Full product photo, for the gift card page. */
export function GiftCardPhoto({ amount, className, priority }: { amount: number; className?: string; priority?: boolean }) {
  return (
    <div className={cn("relative aspect-square w-full overflow-hidden bg-[#f4f1ed]", className)}>
      <Image src={PHOTOS[amount]} alt={alt(amount)} fill priority={priority} className="object-cover" sizes="(min-width: 1024px) 600px, 100vw" />
    </div>
  );
}

/** Just the card, for thumbnails in the cart. */
export function GiftCardFront({ amount, className }: { amount: number; className?: string }) {
  return (
    <div className={cn("relative aspect-[662/412] w-full overflow-hidden rounded-[6%/9.5%]", className)}>
      <Image src={CARD_CROPS[amount]} alt={alt(amount)} fill className="scale-[1.02] object-cover" sizes="200px" />
    </div>
  );
}
