"use client";

import { useBooking } from "./booking-context";
import { cn } from "@/lib/utils";

export function BookButton({
  label,
  prefill,
  className,
  children,
}: {
  label?: string;
  prefill?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      onClick={() => openBooking(prefill ? { label: prefill } : null)}
      className={cn(className)}
      aria-label={label}
    >
      {children}
    </button>
  );
}
