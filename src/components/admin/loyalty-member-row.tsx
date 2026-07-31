"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addLoyaltyStamp, removeLoyaltyStamp, redeemLoyaltyReward } from "@/lib/actions/loyalty";
import { STAMPS_REQUIRED } from "@/lib/loyalty-constants";

type Member = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  stamps: number;
  timesRedeemed: number;
};

export function LoyaltyMemberRow({ member }: { member: Member }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const ready = member.stamps >= STAMPS_REQUIRED;

  function run(action: () => Promise<{ success: boolean; message?: string; error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast.success(result.message ?? "Done.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-cream">{member.name}</p>
        <p className="text-xs text-cream/40">
          {member.phone}
          {member.email ? ` · ${member.email}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: STAMPS_REQUIRED }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${i < member.stamps ? "bg-bronze" : "border border-ink-line"}`}
            />
          ))}
          <span className="ml-1 text-xs text-cream/50">
            {member.stamps}/{STAMPS_REQUIRED}
          </span>
        </div>

        {ready && (
          <span className="rounded-full bg-bronze/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-bronze">
            Ready
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isPending || member.stamps <= 0}
            onClick={() => run(() => removeLoyaltyStamp(member.id))}
            className="grid h-8 w-8 place-items-center rounded-lg border border-ink-line text-cream/60 transition-colors hover:bg-ink-line disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Remove stamp"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={isPending || ready}
            onClick={() => run(() => addLoyaltyStamp(member.id))}
            className="grid h-8 w-8 place-items-center rounded-lg bg-bronze text-ink-deep transition-colors hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Add stamp"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            disabled={isPending || !ready}
            onClick={() => run(() => redeemLoyaltyReward(member.id))}
            className="flex items-center gap-1.5 rounded-lg border border-bronze px-3 py-1.5 text-xs font-semibold text-bronze transition-colors hover:bg-bronze hover:text-ink-deep disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-bronze"
          >
            <Gift className="h-3.5 w-3.5" /> Redeem
          </button>
        </div>
      </div>
    </div>
  );
}
