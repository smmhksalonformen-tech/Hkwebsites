"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertGalleryPost } from "@/lib/actions/gallery";

type GalleryPost = {
  id: string;
  image: string;
  caption: string | null;
  link: string | null;
  isVideo: boolean;
  videoUrl: string | null;
  status: string;
};

export function GalleryEditor({ post }: { post?: GalleryPost }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertGalleryPost(post?.id ?? null, formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/gallery");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/admin/gallery" className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to gallery
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Image URL</label>
          <input name="image" defaultValue={post?.image ?? ""} placeholder="/photos/example.jpg" required
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Caption</label>
          <textarea name="caption" defaultValue={post?.caption ?? ""} rows={2}
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Instagram link (optional)</label>
          <input name="link" defaultValue={post?.link ?? ""} placeholder="https://www.instagram.com/p/..."
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>
        <label className="flex items-center gap-2 text-sm text-cream/70">
          <input type="checkbox" name="isVideo" defaultChecked={post?.isVideo ?? false} className="rounded border-ink-line" />
          This post is a video
        </label>
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Video URL (if video)</label>
          <input name="videoUrl" defaultValue={post?.videoUrl ?? ""} placeholder="/videos/example.mp4"
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>
        <div className="space-y-1.5 w-40">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Status</label>
          <select name="status" defaultValue={post?.status ?? "published"}
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2 text-sm text-cream focus:border-bronze focus:outline-none">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-bronze px-5 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Post
        </button>
      </form>
    </div>
  );
}
