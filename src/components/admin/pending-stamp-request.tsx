"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { approveLoyaltyStampRequest, rejectLoyaltyStampRequest } from "@/lib/actions/loyalty";

type Request = {
  id: string;
  memberName: string;
  memberPhone: string;
  createdAt: string;
};

export function PendingStampRequest({ request }: { request: Request }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-500/10 text-amber-400">
          <Clock className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-cream">{request.memberName}</p>
          <p className="text-xs text-cream/40">{request.memberPhone} · requested {request.createdAt}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => rejectLoyaltyStampRequest(request.id))}
          className="grid h-8 w-8 place-items-center rounded-lg border border-ink-line text-cream/60 transition-colors hover:border-red-400 hover:text-red-400 disabled:opacity-40"
          aria-label="Reject"
        >
          <X className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => approveLoyaltyStampRequest(request.id))}
          className="flex items-center gap-1.5 rounded-lg bg-bronze px-3 py-1.5 text-xs font-semibold text-ink-deep transition-colors hover:bg-champagne disabled:opacity-40"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Approve
        </button>
      </div>
    </div>
  );
}
