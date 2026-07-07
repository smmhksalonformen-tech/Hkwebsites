import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { deleteService } from "@/lib/actions/services";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Services — HK Salon Admin" };

export default async function AdminServicesPage() {
  const services = await db.service.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Services</h1>
          <p className="text-sm text-cream/50 mt-1">The full menu shown in the Services section.</p>
        </div>
        <Link href="/admin/services/new" className="flex items-center gap-2 rounded-lg bg-bronze px-4 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors">
          <Plus className="h-4 w-4" /> New Service
        </Link>
      </div>

      <div className="rounded-xl border border-ink-line bg-ink-soft divide-y divide-ink-line">
        {services.length === 0 ? (
          <p className="p-6 text-sm text-cream/40">No services yet.</p>
        ) : (
          services.map((s) => (
            <div key={s.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-cream font-medium truncate">{s.title}</p>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full shrink-0 ${s.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-cream/10 text-cream/50"}`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-cream/40 truncate">{s.category} · {s.duration} · {s.price}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/services/${s.id}/edit`} className="p-2 rounded-lg text-cream/60 hover:bg-ink-line hover:text-cream transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton action={deleteService} id={s.id} label={s.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
