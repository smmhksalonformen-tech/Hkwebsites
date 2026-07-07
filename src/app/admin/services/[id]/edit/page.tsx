import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceEditor } from "@/components/admin/service-editor";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Service — HK Salon Admin" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">Edit Service</h1>
      <ServiceEditor service={service} />
    </div>
  );
}
