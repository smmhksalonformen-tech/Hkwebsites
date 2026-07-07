"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const testimonialSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  author: z.string().min(1, "Author is required"),
  source: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  status: z.enum(["draft", "published"]),
});

export async function upsertTestimonial(id: string | null, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const raw = {
    quote: formData.get("quote"),
    author: formData.get("author"),
    source: formData.get("source") ?? "Instagram",
    rating: formData.get("rating") ?? "5",
    status: formData.get("status"),
  };

  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const data = parsed.data;
  const payload = { quote: data.quote, author: data.author, source: data.source || "Instagram", rating: data.rating, status: data.status };

  if (id) {
    await db.testimonial.update({ where: { id }, data: payload });
  } else {
    await db.testimonial.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true, message: id ? "Testimonial updated." : "Testimonial added." };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  await db.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true, message: "Testimonial deleted." };
}
