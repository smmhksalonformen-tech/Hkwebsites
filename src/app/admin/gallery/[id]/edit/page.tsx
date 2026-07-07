import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryEditor } from "@/components/admin/gallery-editor";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Gallery Post — HK Salon Admin" };

export default async function EditGalleryPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.galleryPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">Edit Gallery Post</h1>
      <GalleryEditor post={post} />
    </div>
  );
}
