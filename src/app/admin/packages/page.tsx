import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { db } from "@/lib/db";
import { deletePackage } from "@/lib/actions/packages";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatPKR } from "@/lib/utils";

export const metadata: Metadata = { title: "Packages — HK Salon Admin" };

export default async function AdminPackagesPage() {
  const packages = await db.package.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Packages</h1>
          <p className="text-sm text-cream/50 mt-1">The Signatures shown on your homepage.</p>
        </div>
        <Link href="/admin/packages/new" className="flex items-center gap-2 rounded-lg bg-bronze px-4 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors">
          <Plus className="h-4 w-4" /> New Package
        </Link>
      </div>

      <div className="rounded-xl border border-ink-line bg-ink-soft divide-y divide-ink-line">
        {packages.length === 0 ? (
          <p className="p-6 text-sm text-cream/40">No packages yet.</p>
        ) : (
          packages.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-cream font-medium truncate">{p.title}</p>
                  {p.featured && <Star className="h-3.5 w-3.5 text-bronze shrink-0" fill="currentColor" />}
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full shrink-0 ${p.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-cream/10 text-cream/50"}`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-cream/40 truncate">{p.tagline} · {formatPKR(p.price)} · {p.items.length} items</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/packages/${p.id}/edit`} className="p-2 rounded-lg text-cream/60 hover:bg-ink-line hover:text-cream transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton action={deletePackage} id={p.id} label={p.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
