"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export async function upsertTeamMember(id: string | null, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const raw = {
    name: formData.get("name"),
    role: formData.get("role"),
    image: formData.get("image") ?? "",
    status: formData.get("status"),
  };

  const parsed = teamSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const data = parsed.data;
  const payload = { name: data.name, role: data.role, image: data.image || null, status: data.status };

  if (id) {
    await db.teamMember.update({ where: { id }, data: payload });
  } else {
    await db.teamMember.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/admin/team");
  return { success: true, message: id ? "Team member updated." : "Team member added." };
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  await db.teamMember.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/team");
  return { success: true, message: "Team member removed." };
}
