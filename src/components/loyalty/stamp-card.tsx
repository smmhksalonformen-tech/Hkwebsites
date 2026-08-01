"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Scissors, Check, Gift, LogOut, Clock, Stamp } from "lucide-react";
import { signOutLoyaltyMember, requestLoyaltyStamp } from "@/lib/actions/loyalty";
import { STAMPS_REQUIRED } from "@/lib/loyalty-constants";

type Member = {
  name: string;
  phone: string;
  stamps: number;
  timesRedeemed: number;
  hasPendingRequest: boolean;
};

export function LoyaltyStampCard({ member }: { member: Member }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const ready = member.stamps >= STAMPS_REQUIRED;

  function handleSignOut() {
    startTransition(async () => {
      await signOutLoyaltyMember();
      router.refresh();
    });
  }

  function handleRequestStamp() {
    setError(null);
    startTransition(async () => {
      const result = await requestLoyaltyStamp();
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-bronze/30 bg-ink-soft">
      <div className="bg-gradient-to-br from-bronze/20 via-ink-soft to-ink-soft px-6 py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-luxe-sm text-bronze">HK Salon For Men</p>
        <h1 className="font-display mt-2 text-3xl italic text-champagne">Welcome back, {member.name.split(" ")[0]}</h1>
        <p className="mt-1 text-xs text-cream/50">{member.phone}</p>
      </div>

      <div className="px-6 py-8">
        <p className="text-center text-sm font-semibold text-cream/70">
          {ready ? "Your reward is ready!" : `${member.stamps} of ${STAMPS_REQUIRED} Stamps`}
        </p>

        <div className="mt-5 grid grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: STAMPS_REQUIRED }).map((_, i) => {
            const filled = i < member.stamps;
            return (
              <div
                key={i}
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors sm:h-16 sm:w-16 ${
                  filled ? "border-bronze bg-bronze text-ink-deep" : "border-dashed border-ink-line text-cream/20"
                }`}
              >
                {filled ? <Check className="h-6 w-6 sm:h-7 sm:w-7" /> : <Scissors className="h-5 w-5 sm:h-6 sm:w-6" />}
              </div>
            );
          })}
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-ink">
          <div
            className="h-full rounded-full bg-bronze transition-all duration-500"
            style={{ width: `${Math.min(100, (member.stamps / STAMPS_REQUIRED) * 100)}%` }}
          />
        </div>

        {ready ? (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-bronze bg-bronze/10 p-4">
            <Gift className="h-6 w-6 shrink-0 text-bronze" />
            <p className="text-sm text-cream">
              <span className="font-semibold text-champagne">Free Haircut + Beard Styling</span> — show this screen at
              the counter to redeem.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-6 text-center text-sm text-cream/50">
              {STAMPS_REQUIRED - member.stamps} more visit{STAMPS_REQUIRED - member.stamps === 1 ? "" : "s"} for a free
              haircut + beard styling.
            </p>

            {member.hasPendingRequest ? (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <Clock className="h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-sm text-amber-200">
                  1 stamp is pending staff approval. It will be added once approved.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestStamp}
                disabled={isPending}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-luxe-sm text-ink-deep transition-colors hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Stamp className="h-4 w-4" /> {isPending ? "Requesting…" : "Request a Stamp"}
              </button>
            )}
            {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
          </>
        )}

        {member.timesRedeemed > 0 && (
          <p className="mt-4 text-center text-xs text-cream/30">
            Rewards redeemed so far: {member.timesRedeemed}
          </p>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isPending}
          className="mx-auto mt-8 flex items-center gap-1.5 text-xs text-cream/40 transition-colors hover:text-cream/70"
        >
          <LogOut className="h-3.5 w-3.5" /> Not you? Switch member
        </button>
      </div>
    </div>
  );
}
