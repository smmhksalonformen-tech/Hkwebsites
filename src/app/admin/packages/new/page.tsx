import type { Metadata } from "next";
import { PackageEditor } from "@/components/admin/package-editor";

export const metadata: Metadata = { title: "New Package — HK Salon Admin" };

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">New Package</h1>
      <PackageEditor />
    </div>
  );
}
