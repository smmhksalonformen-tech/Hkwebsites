// Launch switch. While false, /gift-cards shows "Launching soon", the cart is
// hidden and the server refuses new orders. Flip to true to go live.
export const GIFT_CARDS_LIVE = false;

// Single source of truth for gift card values. The server recomputes every
// order total from this list — never trust amounts sent from the browser.
export const GIFT_CARD_AMOUNTS = [5000, 10000] as const;
export type GiftCardAmount = (typeof GIFT_CARD_AMOUNTS)[number];

export const MAX_QTY_PER_CARD = 10;

export function isGiftCardAmount(n: number): n is GiftCardAmount {
  return (GIFT_CARD_AMOUNTS as readonly number[]).includes(n);
}

// Mirrors the back of the printed card.
export const GIFT_CARD_TERMS = [
  "Valid for 6 months from the date of issue.",
  "Minimum 80% of the card value must be used on services (e.g. if the card is PKR 10,000, at least PKR 8,000 must be availed).",
  "Non-transferable and cannot be exchanged for cash.",
  "Cannot be combined with other offers unless stated otherwise.",
  "Lost or damaged cards will not be replaced.",
];

export const ORDER_STATUSES = [
  { value: "pending_payment", label: "Awaiting payment" },
  { value: "paid", label: "Paid" },
  { value: "dispatched", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function statusLabel(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export type OrderItem = { amount: number; qty: number };
