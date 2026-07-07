import type { Metadata } from "next";
import { BlogEditor } from "@/components/admin/blog-editor";

export const metadata: Metadata = { title: "New Blog Post — HK Salon Admin" };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">New Blog Post</h1>
      <BlogEditor />
    </div>
  );
}
