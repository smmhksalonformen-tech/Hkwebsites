"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBirthdayContact } from "@/lib/actions/birthday-contacts";

const inputClass =
  "w-full rounded-lg border border-ink-line bg-ink px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none";

export function BirthdayContactForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createBirthdayContact(formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/birthdays");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Name</label>
        <input name="name" required placeholder="Full name" className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Email</label>
        <input name="email" type="email" required placeholder="name@example.com" className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Date of Birth</label>
        <input name="dob" type="date" required max={new Date().toISOString().slice(0, 10)} className={`${inputClass} [color-scheme:dark]`} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-bronze px-5 py-2.5 text-sm font-bold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Contact
      </button>
    </form>
  );
}
