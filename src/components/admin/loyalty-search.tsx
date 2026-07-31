"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export function LoyaltySearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/30" />
      <input
        defaultValue={searchParams.get("q") ?? ""}
        onChange={handleChange}
        placeholder="Search by name or phone…"
        className="w-full rounded-lg border border-ink-line bg-ink-soft py-2.5 pl-10 pr-4 text-sm text-cream placeholder:text-cream/30 focus:border-bronze focus:outline-none"
      />
    </div>
  );
}
