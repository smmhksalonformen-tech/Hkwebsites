import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { db } from "@/lib/db";
import { deleteTestimonial } from "@/lib/actions/testimonials";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Testimonials — HK Salon Admin" };

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Testimonials</h1>
          <p className="text-sm text-cream/50 mt-1">Shown in What Multan Is Saying.</p>
        </div>
        <Link href="/admin/testimonials/new" className="flex items-center gap-2 rounded-lg bg-bronze px-4 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors">
          <Plus className="h-4 w-4" /> New Testimonial
        </Link>
      </div>

      <div className="rounded-xl border border-ink-line bg-ink-soft divide-y divide-ink-line">
        {testimonials.length === 0 ? (
          <p className="p-6 text-sm text-cream/40">No testimonials yet.</p>
        ) : (
          testimonials.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-bronze" fill="currentColor" />
                  ))}
                </div>
                <p className="text-cream text-sm truncate">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-xs text-cream/40">{t.author} · {t.source}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/testimonials/${t.id}/edit`} className="p-2 rounded-lg text-cream/60 hover:bg-ink-line hover:text-cream transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton action={deleteTestimonial} id={t.id} label="testimonial" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
