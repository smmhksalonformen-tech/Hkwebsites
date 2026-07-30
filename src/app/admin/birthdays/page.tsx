import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Gift } from "lucide-react";
import { db } from "@/lib/db";
import { deleteBirthdayContact } from "@/lib/actions/birthday-contacts";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Birthdays — HK Salon Admin" };

const dobFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" });

export default async function AdminBirthdaysPage() {
  const contacts = await db.birthdayContact.findMany({ orderBy: { dob: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Birthdays</h1>
          <p className="text-sm text-cream/50 mt-1">
            Every morning, anyone whose birthday is today automatically gets a 10% off email — no manual work needed.
          </p>
        </div>
        <Link href="/admin/birthdays/new" className="flex items-center gap-2 rounded-lg bg-bronze px-4 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors">
          <Plus className="h-4 w-4" /> Add Contact
        </Link>
      </div>

      <div className="rounded-xl border border-ink-line bg-ink-soft divide-y divide-ink-line">
        {contacts.length === 0 ? (
          <p className="p-6 text-sm text-cream/40">No birthdays added yet.</p>
        ) : (
          contacts.map((c) => {
            const wishedThisYear = c.lastWishedYear === new Date().getFullYear();
            return (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-cream text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-cream/40">
                    {c.email} · {dobFormatter.format(c.dob)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {wishedThisYear && (
                    <span className="flex items-center gap-1 rounded-full bg-bronze/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-bronze">
                      <Gift className="h-3 w-3" /> Wished {c.lastWishedYear}
                    </span>
                  )}
                  <DeleteButton action={deleteBirthdayContact} id={c.id} label="contact" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
