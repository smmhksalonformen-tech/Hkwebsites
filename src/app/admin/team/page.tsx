import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { deleteTeamMember } from "@/lib/actions/team";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Team — HK Salon Admin" };

export default async function AdminTeamPage() {
  const team = await db.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Team</h1>
          <p className="text-sm text-cream/50 mt-1">Your artists, shown in Our Artists and the booking wizard.</p>
        </div>
        <Link href="/admin/team/new" className="flex items-center gap-2 rounded-lg bg-bronze px-4 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors">
          <Plus className="h-4 w-4" /> New Member
        </Link>
      </div>

      <div className="rounded-xl border border-ink-line bg-ink-soft divide-y divide-ink-line">
        {team.length === 0 ? (
          <p className="p-6 text-sm text-cream/40">No team members yet.</p>
        ) : (
          team.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-ink-line shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-cream font-medium truncate">{t.name}</p>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full shrink-0 ${t.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-cream/10 text-cream/50"}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-cream/40 truncate">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/team/${t.id}/edit`} className="p-2 rounded-lg text-cream/60 hover:bg-ink-line hover:text-cream transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton action={deleteTeamMember} id={t.id} label={t.name} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
