"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isGiftCardAmount, MAX_QTY_PER_CARD, type OrderItem } from "@/lib/gift-cards";

const STORAGE_KEY = "hk_cart_v1";

type CartContextValue = {
  items: OrderItem[];
  count: number;
  total: number;
  ready: boolean;
  add: (amount: number, qty?: number) => void;
  setQty: (amount: number, qty: number) => void;
  remove: (amount: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): OrderItem[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (it): it is OrderItem =>
        typeof it?.amount === "number" && isGiftCardAmount(it.amount) && Number.isInteger(it.qty) && it.qty > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from storage after mount so server and client render the same empty cart first.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage blocked (private mode) — cart still works for this page view.
    }
  }, [items, ready]);

  const setQty = useCallback((amount: number, qty: number) => {
    const q = Math.max(0, Math.min(MAX_QTY_PER_CARD, Math.floor(qty)));
    setItems((prev) => {
      const rest = prev.filter((it) => it.amount !== amount);
      if (q === 0) return rest;
      return [...rest, { amount, qty: q }].sort((a, b) => a.amount - b.amount);
    });
  }, []);

  const add = useCallback((amount: number, qty = 1) => {
    if (!isGiftCardAmount(amount)) return;
    setItems((prev) => {
      const current = prev.find((it) => it.amount === amount)?.qty ?? 0;
      const q = Math.min(MAX_QTY_PER_CARD, current + qty);
      return [...prev.filter((it) => it.amount !== amount), { amount, qty: q }].sort((a, b) => a.amount - b.amount);
    });
  }, []);

  const remove = useCallback((amount: number) => setItems((prev) => prev.filter((it) => it.amount !== amount)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.reduce((n, it) => n + it.qty, 0),
      total: items.reduce((n, it) => n + it.qty * it.amount, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
