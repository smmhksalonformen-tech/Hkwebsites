import type { Metadata } from "next";
import { GalleryEditor } from "@/components/admin/gallery-editor";

export const metadata: Metadata = { title: "New Gallery Post — HK Salon Admin" };

export default function NewGalleryPostPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">New Gallery Post</h1>
      <GalleryEditor />
    </div>
  );
}
