"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertService } from "@/lib/actions/services";

type Service = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  status: string;
};

const CATEGORIES = ["Haircut & Styling", "Beard & Shave", "Facials & Skin", "Hair Colour", "Hands & Feet", "Massage & Relaxation"];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export function ServiceEditor({ service }: { service?: Service }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!service?.slug);
  const formRef = useRef<HTMLFormElement>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (!slugManual) setSlug(slugify(e.target.value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertService(service?.id ?? null, formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/services");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/services" className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to services
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

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Category</label>
            <select name="category" defaultValue={service?.category ?? CATEGORIES[0]}
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Duration</label>
            <input name="duration" defaultValue={service?.duration ?? ""} placeholder="~30 min"
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Price</label>
            <input name="price" defaultValue={service?.price ?? "On request"} placeholder="On request"
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Description</label>
          <textarea name="description" defaultValue={service?.description ?? ""} rows={3}
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>

        <div className="space-y-1.5 w-40">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Status</label>
          <select name="status" defaultValue={service?.status ?? "published"}
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2 text-sm text-cream focus:border-bronze focus:outline-none">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-bronze px-5 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Service
        </button>
      </form>
    </div>
  );
}
