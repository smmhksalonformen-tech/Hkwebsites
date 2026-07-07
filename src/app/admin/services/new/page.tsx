import type { Metadata } from "next";
import { ServiceEditor } from "@/components/admin/service-editor";

export const metadata: Metadata = { title: "New Service — HK Salon Admin" };

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">New Service</h1>
      <ServiceEditor />
    </div>
  );
}
