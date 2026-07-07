import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestimonialEditor } from "@/components/admin/testimonial-editor";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Testimonial — HK Salon Admin" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await db.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">Edit Testimonial</h1>
      <TestimonialEditor testimonial={testimonial} />
    </div>
  );
}
