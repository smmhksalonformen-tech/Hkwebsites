"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your address"),
  dob: z.string().trim().min(1, "Enter your date of birth"),
});

type ActionResult =
  | { success: true; couponCode: string }
  | { success: false; error: string };

// Coupon stays valid for 2 days after the event (25 July 2026 → expires end of 27 July 2026).
const EXPIRES_AT = new Date("2026-07-28T00:00:00+05:00");

function generateCouponCode() {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FEST-${random}`;
}

async function pushToGoogleSheet(entry: { name: string; phone: string; address: string; dob?: string; couponCode: string }) {
  const webhookUrl = process.env.FESTSPHERE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: entry.name,
        phone: entry.phone,
        address: entry.address,
        dob: entry.dob ?? "",
        couponCode: entry.couponCode,
        submittedAt: new Date().toISOString(),
      }),
    });
  } catch {
    // Non-fatal — the database row is the source of truth if the sheet sync fails.
  }
}

export async function submitFestsphereEntry(formData: FormData): Promise<ActionResult> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    dob: formData.get("dob"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { dob, ...rest } = parsed.data;
  let couponCode = generateCouponCode();

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await db.festsphereEntry.create({
        data: { ...rest, dob: dob ? new Date(dob) : undefined, couponCode, expiresAt: EXPIRES_AT },
      });
      await pushToGoogleSheet({ ...rest, dob, couponCode });
      return { success: true, couponCode };
    } catch (err: unknown) {
      const isUniqueClash = typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
      if (isUniqueClash) {
        couponCode = generateCouponCode();
        continue;
      }
      return { success: false, error: "Something went wrong. Please try again." };
    }
  }

  return { success: false, error: "Something went wrong. Please try again." };
}
