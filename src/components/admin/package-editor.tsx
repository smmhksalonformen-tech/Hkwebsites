"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertPackage } from "@/lib/actions/packages";

type Package = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  price: number;
  items: string[];
  featured: boolean;
  status: string;
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export function PackageEditor({ pkg }: { pkg?: Package }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(pkg?.title ?? "");
  const [slug, setSlug] = useState(pkg?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!pkg?.slug);
  const formRef = useRef<HTMLFormElement>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (!slugManual) setSlug(slugify(e.target.value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertPackage(pkg?.id ?? null, formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/packages");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/packages" className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to packages
      </Link>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Title</label>
            <input name="title" value={title} onChange={handleTitleChange} required
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Slug</label>
            <input name="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }} required
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Tagline</label>
          <input name="tagline" defaultValue={pkg?.tagline ?? ""} placeholder="The complete grooming session."
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Price (PKR)</label>
          <input name="price" type="number" min="0" defaultValue={pkg?.price ?? 0} required
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Included items (comma-separated)</label>
          <textarea name="items" defaultValue={(pkg?.items ?? []).join(", ")} rows={3} placeholder="Hair Cut, Beard, Wash"
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input type="checkbox" name="featured" defaultChecked={pkg?.featured ?? false} className="rounded border-ink-line" />
            Most Loved (featured)
          </label>
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Status</label>
            <select name="status" defaultValue={pkg?.status ?? "published"}
              className="rounded-lg border border-ink-line bg-ink-soft px-3 py-2 text-sm text-cream focus:border-bronze focus:outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-bronze px-5 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Package
        </button>
      </form>
    </div>
  );
}
