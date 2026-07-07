import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamEditor } from "@/components/admin/team-editor";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Edit Team Member — HK Salon Admin" };

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await db.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">Edit Team Member</h1>
      <TeamEditor member={member} />
    </div>
  );
}
