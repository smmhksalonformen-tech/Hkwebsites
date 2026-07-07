"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const packageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
  tagline: z.string().optional(),
  price: z.coerce.number().min(0),
  items: z.string().optional(),
  featured: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export async function upsertPackage(id: string | null, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    tagline: formData.get("tagline") ?? "",
    price: formData.get("price"),
    items: formData.get("items") ?? "",
    featured: formData.get("featured") ?? "",
    status: formData.get("status"),
  };

  const parsed = packageSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const data = parsed.data;
  const items = data.items ? data.items.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const payload = {
    title: data.title,
    slug: data.slug,
    tagline: data.tagline || "",
    price: data.price,
    items,
    featured: data.featured === "on",
    status: data.status,
  };

  if (id) {
    await db.package.update({ where: { id }, data: payload });
  } else {
    await db.package.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/admin/packages");
  return { success: true, message: id ? "Package updated." : "Package created." };
}

export async function deletePackage(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  await db.package.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/packages");
  return { success: true, message: "Package deleted." };
}
