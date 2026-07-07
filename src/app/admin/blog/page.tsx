import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { deleteBlogPost } from "@/lib/actions/blog";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata: Metadata = { title: "Blog — HK Salon Admin" };

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-cream">Blog</h1>
          <p className="text-sm text-cream/50 mt-1">Posts shown on the public blog.</p>
        </div>
        <Link href="/admin/blog/new" className="flex items-center gap-2 rounded-lg bg-bronze px-4 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors">
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      <div className="rounded-xl border border-ink-line bg-ink-soft divide-y divide-ink-line">
        {posts.length === 0 ? (
          <p className="p-6 text-sm text-cream/40">No blog posts yet.</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.title} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-ink-line shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-cream font-medium truncate">{p.title}</p>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full shrink-0 ${p.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-cream/10 text-cream/50"}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-cream/40 truncate">/blog/{p.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/blog/${p.id}/edit`} className="p-2 rounded-lg text-cream/60 hover:bg-ink-line hover:text-cream transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton action={deleteBlogPost} id={p.id} label={p.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
