"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { upsertTeamMember } from "@/lib/actions/team";

type TeamMember = { id: string; name: string; role: string; image: string | null; status: string };

export function TeamEditor({ member }: { member?: TeamMember }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertTeamMember(member?.id ?? null, formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/team");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/admin/team" className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to team
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Name</label>
          <input name="name" defaultValue={member?.name ?? ""} required
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Role</label>
          <input name="role" defaultValue={member?.role ?? ""} placeholder="Senior Hair Stylist" required
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Photo URL</label>
          <input name="image" defaultValue={member?.image ?? ""} placeholder="/team/name.jpg"
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none" />
        </div>
        <div className="space-y-1.5 w-40">
          <label className="text-xs font-mono uppercase tracking-luxe-sm text-cream/50">Status</label>
          <select name="status" defaultValue={member?.status ?? "published"}
            className="w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2 text-sm text-cream focus:border-bronze focus:outline-none">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-bronze px-5 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Team Member
        </button>
      </form>
    </div>
  );
}
