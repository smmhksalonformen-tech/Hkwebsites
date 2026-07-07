import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageEditor } from "@/components/admin/package-editor";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Package — HK Salon Admin" };

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await db.package.findUnique({ where: { id } });
  if (!pkg) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">Edit Package</h1>
      <PackageEditor pkg={pkg} />
    </div>
  );
}
