import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/blog-editor";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Blog Post — HK Salon Admin" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">Edit Blog Post</h1>
      <BlogEditor post={post} />
    </div>
  );
}
