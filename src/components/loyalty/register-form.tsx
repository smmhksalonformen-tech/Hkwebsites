"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerOrLookupLoyaltyMember, lookupLoyaltyMemberByPhone } from "@/lib/actions/loyalty";

export function LoyaltyRegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"register" | "returning">("register");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result =
        mode === "register" ? await registerOrLookupLoyaltyMember(formData) : await lookupLoyaltyMemberByPhone(formData);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-bronze/30 bg-ink-soft p-6">
      <div className="mb-5 flex rounded-lg border border-ink-line p-1">
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md py-2 text-xs font-semibold uppercase tracking-luxe-sm transition-colors ${
            mode === "register" ? "bg-bronze text-ink-deep" : "text-cream/60"
          }`}
        >
          New Member
        </button>
        <button
          type="button"
          onClick={() => setMode("returning")}
          className={`flex-1 rounded-md py-2 text-xs font-semibold uppercase tracking-luxe-sm transition-colors ${
            mode === "returning" ? "bg-bronze text-ink-deep" : "text-cream/60"
          }`}
        >
          Already a Member
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Name</label>
            <input
              name="name"
              required
              placeholder="Your full name"
              className="w-full rounded-lg border border-ink-line bg-ink px-4 py-3 text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none"
            />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Phone Number</label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="03XX-XXXXXXX"
            className="w-full rounded-lg border border-ink-line bg-ink px-4 py-3 text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none"
          />
        </div>
        {mode === "register" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe-sm text-bronze">
              Email <span className="normal-case text-cream/40">(optional)</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-ink-line bg-ink px-4 py-3 text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-luxe-sm text-ink-deep transition-colors hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Please wait…" : mode === "register" ? "Get My Loyalty Card" : "View My Card"}
        </button>
      </form>
    </div>
  );
}
