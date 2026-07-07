"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  duration: z.string().optional(),
  price: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export async function upsertService(id: string | null, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    description: formData.get("description") ?? "",
    duration: formData.get("duration") ?? "",
    price: formData.get("price") ?? "",
    status: formData.get("status"),
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const data = parsed.data;
  const payload = {
    title: data.title,
    slug: data.slug,
    category: data.category,
    description: data.description || "",
    duration: data.duration || "",
    price: data.price || "On request",
    status: data.status,
  };

  if (id) {
    await db.service.update({ where: { id }, data: payload });
  } else {
    await db.service.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
  return { success: true, message: id ? "Service updated." : "Service created." };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  await db.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/services");
  return { success: true, message: "Service deleted." };
}
