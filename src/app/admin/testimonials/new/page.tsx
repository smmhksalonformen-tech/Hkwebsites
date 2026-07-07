import type { Metadata } from "next";
import { TestimonialEditor } from "@/components/admin/testimonial-editor";

export const metadata: Metadata = { title: "New Testimonial — HK Salon Admin" };

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">New Testimonial</h1>
      <TestimonialEditor />
    </div>
  );
}
