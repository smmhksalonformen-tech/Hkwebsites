"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertBlogPost } from "@/lib/actions/blog";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  status: string;
};

const FIELD = "w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none";
const LABEL = "text-xs font-mono uppercase tracking-luxe-sm text-cream/50";

export function BlogEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertBlogPost(post?.id ?? null, formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/blog");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className={LABEL}>Title</label>
          <input name="title" defaultValue={post?.title ?? ""} required className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Slug (URL — lowercase, hyphens only)</label>
          <input
            name="slug"
            defaultValue={post?.slug ?? ""}
            placeholder="hk-salon-flagship-multan"
            required
            className={FIELD}
          />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Excerpt (shown on the blog list)</label>
          <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} required className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Cover Image URL</label>
          <input name="image" defaultValue={post?.image ?? ""} placeholder="/blog/post-slug.jpg" className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Content (leave a blank line between paragraphs)</label>
          <textarea name="content" defaultValue={post?.content ?? ""} rows={14} required className={FIELD} />
        </div>
        <div className="space-y-1.5 w-40">
          <label className={LABEL}>Status</label>
          <select name="status" defaultValue={post?.status ?? "published"} className={FIELD}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-bronze px-5 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Post
        </button>
      </form>
    </div>
  );
}
