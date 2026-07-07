import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings — HK Salon Admin" };

export default async function AdminSettingsPage() {
  const settings = await db.setting.findUnique({ where: { id: 1 } });

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-1">Settings</h1>
      <p className="text-sm text-cream/50 mb-6">Site-wide content: contact info, hours, hero copy, and the founder bio.</p>
      <SettingsForm settings={settings} />
    </div>
  );
}
