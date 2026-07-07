"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const settingsSchema = z.object({
  siteName: z.string().min(1),
  legalName: z.string().min(1),
  tagline: z.string().min(1),
  standardsQuote: z.string().min(1),
  aboutFounder: z.string().min(1),
  address: z.string().min(1),
  hours: z.string().min(1),
  phone: z.string().min(1),
  phoneSecondary: z.string().optional(),
  whatsapp: z.string().min(1),
  instagram: z.string().min(1),
  facebook: z.string().min(1),
  tiktok: z.string().min(1),
  mapsQuery: z.string().min(1),
  announcement: z.string().min(1),
  menuUrl: z.string().min(1),
});

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const raw = Object.fromEntries(
    Object.keys(settingsSchema.shape).map((key) => [key, formData.get(key) ?? ""])
  );

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  await db.setting.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true, message: "Settings saved." };
}
