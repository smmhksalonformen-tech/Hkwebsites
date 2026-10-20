"use server";

import { randomBytes } from "crypto";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { isGiftCardAmount, MAX_QTY_PER_CARD, ORDER_STATUSES, type OrderItem } from "@/lib/gift-cards";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const orderSchema = z
  .object({
    items: z
      .array(z.object({ amount: z.number().int(), qty: z.number().int().min(1).max(MAX_QTY_PER_CARD) }))
      .min(1, "Your cart is empty"),
    name: z.string().trim().min(2, "Please enter your name"),
    phone: z.string().trim().regex(/^[0-9+\s-]{10,16}$/, "Please enter a valid phone number"),
    email: z.string().trim().email("Please enter a valid email").optional().or(z.literal("")),
    deliveryMethod: z.enum(["delivery", "pickup"]),
    city: z.string().trim().optional(),
    address: z.string().trim().optional(),
    recipientName: z.string().trim().max(80).optional(),
    giftMessage: z.string().trim().max(300).optional(),
  })
  .refine((d) => d.deliveryMethod === "pickup" || (d.city && d.city.length > 1), {
    message: "Please enter your city",
  })
  .refine((d) => d.deliveryMethod === "pickup" || (d.address && d.address.length > 5), {
    message: "Please enter your full delivery address",
  });

export type GiftCardOrderInput = z.input<typeof orderSchema>;

function makeReference() {
  // e.g. HKGC-7F3K9Q — short enough to quote on a bank transfer.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  return "HKGC-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function createGiftCardOrder(
  input: GiftCardOrderInput
): Promise<{ success: true; token: string } | { success: false; error: string }> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  // Merge duplicate lines and reject anything that isn't a real card value.
  const merged = new Map<number, number>();
  for (const it of d.items) {
    if (!isGiftCardAmount(it.amount)) return { success: false, error: "Invalid gift card in cart" };
    merged.set(it.amount, Math.min(MAX_QTY_PER_CARD, (merged.get(it.amount) ?? 0) + it.qty));
  }
  const items: OrderItem[] = [...merged].map(([amount, qty]) => ({ amount, qty }));
  const total = items.reduce((sum, it) => sum + it.amount * it.qty, 0);

  const token = randomBytes(18).toString("base64url");
  const pickup = d.deliveryMethod === "pickup";

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await db.giftCardOrder.create({
        data: {
          reference: makeReference(),
          token,
          name: d.name,
          phone: d.phone,
          email: d.email || null,
          deliveryMethod: d.deliveryMethod,
          city: pickup ? "" : d.city ?? "",
          address: pickup ? "" : d.address ?? "",
          recipientName: d.recipientName || null,
          giftMessage: d.giftMessage || null,
          items,
          total,
        },
      });
      revalidatePath("/admin/gift-cards");
      return { success: true, token };
    } catch (e) {
      // Unique-constraint clash on reference: retry with a new one.
      if ((e as { code?: string }).code !== "P2002") throw e;
    }
  }
  return { success: false, error: "Could not place your order. Please try again." };
}

const updateSchema = z.object({
  status: z.enum(ORDER_STATUSES.map((s) => s.value) as [string, ...string[]]),
  cardNumbers: z.string().max(500),
  adminNote: z.string().max(1000),
});

export async function updateGiftCardOrder(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const parsed = updateSchema.safeParse({
    status: formData.get("status"),
    cardNumbers: formData.get("cardNumbers") ?? "",
    adminNote: formData.get("adminNote") ?? "",
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const order = await db.giftCardOrder.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/gift-cards");
  revalidatePath(`/gift-cards/order/${order.token}`);
  return { success: true, message: `Order ${order.reference} updated.` };
}

export async function deleteGiftCardOrder(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  await db.giftCardOrder.delete({ where: { id } });
  revalidatePath("/admin/gift-cards");
  return { success: true, message: "Order deleted." };
}
