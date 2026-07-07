"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertTestimonial } from "@/lib/actions/testimonials";

type Testimonial = { id: string; quote: string; author: string; source: string; rating: number; status: string };

export function TestimonialEditor({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertTestimonial(testimonial?.id ?? null, formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/testimonials");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/admin/testimonials" className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to testimonials
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Quote</label>
          <textarea name="quote" defaultValue={testimonial?.quote ?? ""} rows={3} required
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Author</label>
            <input name="author" defaultValue={testimonial?.author ?? ""} placeholder="username" required
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Source</label>
            <input name="source" defaultValue={testimonial?.source ?? "Instagram"}
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Rating (1-5)</label>
            <input name="rating" type="number" min="1" max="5" defaultValue={testimonial?.rating ?? 5}
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Status</label>
            <select name="status" defaultValue={testimonial?.status ?? "published"}
              className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2 text-sm text-cream focus:border-bronze focus:outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-bronze px-5 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Testimonial
        </button>
      </form>
    </div>
  );
}
