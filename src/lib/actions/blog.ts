"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export async function upsertBlogPost(id: string | null, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    image: formData.get("image") ?? "",
    status: formData.get("status"),
  };

  const parsed = blogSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const data = parsed.data;
  const payload = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    image: data.image || null,
    status: data.status,
  };

  try {
    if (id) {
      await db.blogPost.update({ where: { id }, data: payload });
    } else {
      await db.blogPost.create({ data: payload });
    }
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      return { success: false, error: "That slug is already in use — pick a different one." };
    }
    throw err;
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/admin/blog");
  return { success: true, message: id ? "Blog post updated." : "Blog post published." };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  await db.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true, message: "Blog post removed." };
}
