"use server";

import { z } from "zod";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { STAMPS_REQUIRED } from "@/lib/loyalty-constants";

const LOYALTY_COOKIE = "hk_loyalty_phone";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
});

export async function registerOrLookupLoyaltyMember(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { name, phone, email } = parsed.data;

  const member = await db.loyaltyMember.upsert({
    where: { phone },
    update: {},
    create: { name, phone, email: email || null },
  });

  const cookieStore = await cookies();
  cookieStore.set(LOYALTY_COOKIE, member.phone, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return { success: true, data: { id: member.id } };
}

export async function getMyLoyaltyMember() {
  const cookieStore = await cookies();
  const phone = cookieStore.get(LOYALTY_COOKIE)?.value;
  if (!phone) return null;
  return db.loyaltyMember.findUnique({
    where: { phone },
    include: { stampRequests: { where: { status: "PENDING" }, take: 1 } },
  });
}

export async function requestLoyaltyStamp(): Promise<AdminActionResult> {
  const cookieStore = await cookies();
  const phone = cookieStore.get(LOYALTY_COOKIE)?.value;
  if (!phone) return { success: false, error: "Please register first." };

  const member = await db.loyaltyMember.findUnique({
    where: { phone },
    include: { stampRequests: { where: { status: "PENDING" }, take: 1 } },
  });
  if (!member) return { success: false, error: "Loyalty card not found." };
  if (member.stamps >= STAMPS_REQUIRED) return { success: false, error: "Your card is already full — ask staff to redeem your reward." };
  if (member.stampRequests.length > 0) return { success: false, error: "You already have a stamp pending approval." };

  await db.loyaltyStampRequest.create({ data: { memberId: member.id } });
  revalidatePath("/loyalty");
  revalidatePath("/admin/loyalty");
  return { success: true, message: "Stamp requested — ask staff to approve it." };
}

export async function lookupLoyaltyMemberByPhone(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return { success: false, error: "Enter your phone number" };

  const member = await db.loyaltyMember.findUnique({ where: { phone } });
  if (!member) return { success: false, error: "No loyalty card found for this number. Please register." };

  const cookieStore = await cookies();
  cookieStore.set(LOYALTY_COOKIE, member.phone, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return { success: true, data: { id: member.id } };
}

export async function signOutLoyaltyMember() {
  const cookieStore = await cookies();
  cookieStore.delete(LOYALTY_COOKIE);
}

type AdminActionResult = { success: true; message: string } | { success: false; error: string };

export async function addLoyaltyStamp(memberId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "You don't have permission to do this." };

  const member = await db.loyaltyMember.findUnique({ where: { id: memberId } });
  if (!member) return { success: false, error: "Member not found." };
  if (member.stamps >= STAMPS_REQUIRED) {
    return { success: false, error: "This card is already full — redeem the reward first." };
  }

  await db.loyaltyMember.update({ where: { id: memberId }, data: { stamps: { increment: 1 } } });
  revalidatePath("/admin/loyalty");
  return { success: true, message: "Stamp added." };
}

export async function redeemLoyaltyReward(memberId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "You don't have permission to do this." };

  const member = await db.loyaltyMember.findUnique({ where: { id: memberId } });
  if (!member) return { success: false, error: "Member not found." };
  if (member.stamps < STAMPS_REQUIRED) return { success: false, error: "Card isn't full yet." };

  await db.loyaltyMember.update({
    where: { id: memberId },
    data: { stamps: 0, timesRedeemed: { increment: 1 }, lastRedeemedAt: new Date() },
  });
  revalidatePath("/admin/loyalty");
  return { success: true, message: "Reward redeemed — card reset." };
}

export async function removeLoyaltyStamp(memberId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "You don't have permission to do this." };

  const member = await db.loyaltyMember.findUnique({ where: { id: memberId } });
  if (!member) return { success: false, error: "Member not found." };
  if (member.stamps <= 0) return { success: false, error: "No stamps to remove." };

  await db.loyaltyMember.update({ where: { id: memberId }, data: { stamps: { decrement: 1 } } });
  revalidatePath("/admin/loyalty");
  return { success: true, message: "Stamp removed." };
}

export async function approveLoyaltyStampRequest(requestId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "You don't have permission to do this." };

  const request = await db.loyaltyStampRequest.findUnique({ where: { id: requestId }, include: { member: true } });
  if (!request) return { success: false, error: "Request not found." };
  if (request.status !== "PENDING") return { success: false, error: "This request was already resolved." };

  await db.$transaction([
    db.loyaltyStampRequest.update({ where: { id: requestId }, data: { status: "APPROVED", resolvedAt: new Date() } }),
    db.loyaltyMember.update({
      where: { id: request.memberId },
      data: { stamps: Math.min(request.member.stamps + 1, STAMPS_REQUIRED) },
    }),
  ]);

  revalidatePath("/admin/loyalty");
  revalidatePath("/loyalty");
  return { success: true, message: "Stamp approved." };
}

export async function rejectLoyaltyStampRequest(requestId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { success: false, error: "You don't have permission to do this." };

  const request = await db.loyaltyStampRequest.findUnique({ where: { id: requestId } });
  if (!request) return { success: false, error: "Request not found." };
  if (request.status !== "PENDING") return { success: false, error: "This request was already resolved." };

  await db.loyaltyStampRequest.update({ where: { id: requestId }, data: { status: "REJECTED", resolvedAt: new Date() } });
  revalidatePath("/admin/loyalty");
  revalidatePath("/loyalty");
  return { success: true, message: "Request rejected." };
}

export async function getLoyaltySiteUrl() {
  const h = await headers();
  const host = h.get("host") || "www.hksalonformen.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}/loyalty`;
}
