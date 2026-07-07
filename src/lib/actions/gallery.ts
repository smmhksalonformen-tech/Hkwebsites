"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const gallerySchema = z.object({
  image: z.string().min(1, "Image URL is required"),
  caption: z.string().optional(),
  link: z.string().optional(),
  isVideo: z.string().optional(),
  videoUrl: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export async function upsertGalleryPost(id: string | null, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const raw = {
    image: formData.get("image"),
    caption: formData.get("caption") ?? "",
    link: formData.get("link") ?? "",
    isVideo: formData.get("isVideo") ?? "",
    videoUrl: formData.get("videoUrl") ?? "",
    status: formData.get("status"),
  };

  const parsed = gallerySchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const data = parsed.data;
  const payload = {
    image: data.image,
    caption: data.caption || null,
    link: data.link || null,
    isVideo: data.isVideo === "on",
    videoUrl: data.videoUrl || null,
    status: data.status,
  };

  if (id) {
    await db.galleryPost.update({ where: { id }, data: payload });
  } else {
    await db.galleryPost.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true, message: id ? "Gallery post updated." : "Gallery post added." };
}

export async function deleteGalleryPost(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  await db.galleryPost.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true, message: "Gallery post deleted." };
}
