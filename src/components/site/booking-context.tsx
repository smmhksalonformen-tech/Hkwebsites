"use client";

import { createContext, useCallback, useContext, useState } from "react";

type BookingPrefill = { label: string } | null;

type BookingContextValue = {
  open: boolean;
  prefill: BookingPrefill;
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>(null);

  const openBooking = useCallback((p?: BookingPrefill) => {
    setPrefill(p ?? null);
    setOpen(true);
  }, []);
  const closeBooking = useCallback(() => setOpen(false), []);

  return (
    <BookingContext.Provider value={{ open, prefill, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
