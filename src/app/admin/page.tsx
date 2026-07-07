import type { Metadata } from "next";
import Link from "next/link";
import { Scissors, Package as PackageIcon, Users, Image as ImageIcon, Newspaper, Inbox } from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard — HK Salon Admin" };

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminDashboardPage() {
  const [services, packages, team, gallery, blogPosts, newLeads, latestLeads] = await Promise.all([
    db.service.count(),
    db.package.count(),
    db.teamMember.count(),
    db.galleryPost.count(),
    db.blogPost.count(),
    db.lead.count({ where: { status: "new" } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const cards = [
    { label: "Services", value: services, href: "/admin/services", icon: Scissors },
    { label: "Packages", value: packages, href: "/admin/packages", icon: PackageIcon },
    { label: "Team Members", value: team, href: "/admin/team", icon: Users },
    { label: "Gallery Posts", value: gallery, href: "/admin/gallery", icon: ImageIcon },
    { label: "Blog Posts", value: blogPosts, href: "/admin/blog", icon: Newspaper },
    { label: "New Booking Requests", value: newLeads, href: null, icon: Inbox },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-cream">Dashboard</h1>
        <p className="text-sm text-cream/50 mt-1">Overview of your site content and booking leads.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c) =>
          c.href ? (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-xl border border-ink-line bg-ink-soft p-5 hover:border-bronze transition-colors"
            >
              <c.icon className="h-5 w-5 text-bronze mb-3" />
              <p className="font-display text-2xl text-cream">{c.value}</p>
              <p className="text-xs text-cream/50 mt-1">{c.label}</p>
            </Link>
          ) : (
            <div key={c.label} className="rounded-xl border border-ink-line bg-ink-soft p-5">
              <c.icon className="h-5 w-5 text-bronze mb-3" />
              <p className="font-display text-2xl text-cream">{c.value}</p>
              <p className="text-xs text-cream/50 mt-1">{c.label}</p>
            </div>
          )
        )}
      </div>

      <div className="rounded-xl border border-ink-line bg-ink-soft">
        <div className="p-5 border-b border-ink-line">
          <h2 className="font-display text-lg text-cream">Recent booking requests</h2>
        </div>
        {latestLeads.length === 0 ? (
          <p className="p-5 text-sm text-cream/40">No leads yet.</p>
        ) : (
          <div className="divide-y divide-ink-line">
            {latestLeads.map((l) => (
              <div key={l.id} className="p-4 flex items-center justify-between text-sm">
                <div>
                  <p className="text-cream">{l.name} · {l.phone}</p>
                  <p className="text-xs text-cream/40">{l.service ?? "—"} {l.date ? `· ${l.date} ${l.time}` : ""}</p>
                </div>
                <span className="text-xs text-cream/40">{formatDate(l.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
