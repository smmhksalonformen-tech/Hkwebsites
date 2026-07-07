import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Video } from "lucide-react";
import { db } from "@/lib/db";
import { deleteGalleryPost } from "@/lib/actions/gallery";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Gallery — HK Salon Admin" };

export default async function AdminGalleryPage() {
  const gallery = await db.galleryPost.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Gallery</h1>
          <p className="text-sm text-cream/50 mt-1">Shown in Step Inside and the Social Journal.</p>
        </div>
        <Link href="/admin/gallery/new" className="flex items-center gap-2 rounded-lg bg-bronze px-4 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors">
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gallery.length === 0 ? (
          <p className="text-sm text-cream/40 col-span-full">No gallery posts yet.</p>
        ) : (
          gallery.map((g) => (
            <div key={g.id} className="rounded-xl border border-ink-line bg-ink-soft overflow-hidden">
              <div className="aspect-square relative bg-ink-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.image} alt={g.caption ?? ""} className="h-full w-full object-cover" />
                {g.isVideo && (
                  <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-cream">
                    <Video className="h-3 w-3" />
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-cream/60 line-clamp-2">{g.caption || "No caption"}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${g.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-cream/10 text-cream/50"}`}>
                    {g.status}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Link href={`/admin/gallery/${g.id}/edit`} className="p-1.5 rounded-lg text-cream/60 hover:bg-ink-line hover:text-cream transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteButton action={deleteGalleryPost} id={g.id} label="post" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
