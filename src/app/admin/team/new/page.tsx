import type { Metadata } from "next";
import { TeamEditor } from "@/components/admin/team-editor";

export const metadata: Metadata = { title: "New Team Member — HK Salon Admin" };

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-6">New Team Member</h1>
      <TeamEditor />
    </div>
  );
}
