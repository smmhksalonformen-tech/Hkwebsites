import Image from "next/image";
import { MapPin, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { GIFT_CARD_TERMS } from "@/lib/gift-cards";

/**
 * Drop the printed card artwork into public/gift-card/ and list it here to
 * replace the CSS rendering, e.g. { 5000: "/gift-card/front-5000.jpg" }.
 */
const FRONT_IMAGES: Record<number, string> = {};
const BACK_IMAGE: string | null = null;

const SURFACE =
  "relative aspect-[1.586/1] w-full overflow-hidden text-left rounded-[4.5%/7%] text-[#ece6df] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10";
const SURFACE_BG = "bg-[radial-gradient(120%_90%_at_70%_15%,#6b6562_0%,#4a4543_45%,#383433_100%)]";

function formatCardAmount(amount: number) {
  return amount.toLocaleString("en-US").replace(/,/g, "’");
}

export function GiftCardFront({ amount, className }: { amount: number; className?: string }) {
  const img = FRONT_IMAGES[amount];
  if (img) {
    return (
      <div className={cn(SURFACE, className)}>
        <Image src={img} alt={`HK Salon For Men gift card — Rs ${amount.toLocaleString()}`} fill className="object-cover" sizes="(min-width: 1024px) 560px, 100vw" />
      </div>
    );
  }
  return (
    <div className={cn(SURFACE, SURFACE_BG, "@container", className)} role="img" aria-label={`HK Salon For Men gift card — Rs ${amount.toLocaleString()}`}>
      <Image src="/logo-cream.png" alt="" width={160} height={70} className="absolute right-[6%] top-[7%] h-auto w-[26%]" />
      <span className="absolute left-[6%] top-1/2 -translate-y-1/2 text-[4.2cqw] font-light tracking-[0.06em]">GIFT CARD</span>
      <span className="absolute bottom-[12%] right-[11%] text-[4.6cqw] font-light tracking-[0.12em] tabular-nums">
        {formatCardAmount(amount)}
      </span>
    </div>
  );
}

export function GiftCardBack({ className }: { className?: string }) {
  if (BACK_IMAGE) {
    return (
      <div className={cn(SURFACE, className)}>
        <Image src={BACK_IMAGE} alt="Gift card terms and conditions" fill className="object-cover" sizes="(min-width: 1024px) 560px, 100vw" />
      </div>
    );
  }
  return (
    <div className={cn(SURFACE, SURFACE_BG, "@container", className)} role="img" aria-label="Gift card back with terms and conditions">
      <div className="absolute left-[6%] top-[11%]">
        <p className="text-[3.1cqw] font-light tracking-[0.04em]">GIFT CARD NO.</p>
        <p className="mt-[0.6cqw] text-[4.6cqw] tracking-[0.04em]">HKM-GC-••••••</p>
      </div>
      <div className="absolute left-[50%] right-[5%] top-[31%]">
        <p className="text-[3.3cqw] font-light tracking-[0.04em]">TERMS &amp; CONDITIONS</p>
        <ul className="mt-[1.6cqw] list-disc space-y-[0.4cqw] pl-[2.4cqw] text-[1.55cqw] leading-snug text-[#ece6df]/85">
          {GIFT_CARD_TERMS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-[8%] left-0 right-0 flex justify-center gap-[5cqw] text-[1.9cqw] text-[#ece6df]/90">
        <span className="flex items-center gap-[0.8cqw]"><MapPin className="h-[2.2cqw] w-[2.2cqw]" /> Gulgasht Colony, Multan</span>
        <span className="flex items-center gap-[0.8cqw]"><Phone className="h-[2.2cqw] w-[2.2cqw]" /> +92 320 0005337</span>
        <span className="flex items-center gap-[0.8cqw]"><Globe className="h-[2.2cqw] w-[2.2cqw]" /> hksalonformen.com</span>
      </div>
    </div>
  );
}
