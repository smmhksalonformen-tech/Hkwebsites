"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteButton({ action, id, label }: { action: (id: string) => Promise<{ success: boolean; message?: string; error?: string }>; id: string; label: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`Delete ${label}? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await action(id);
      if (result.success) {
        toast.success(result.message ?? "Deleted.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete.");
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-lg text-cream/40 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
      aria-label={`Delete ${label}`}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
