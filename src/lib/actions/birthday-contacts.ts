"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type ActionResult = { success: true; message: string } | { success: false; error: string };

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  dob: z.string().trim().min(1, "Date of birth is required"),
});

export async function createBirthdayContact(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    dob: formData.get("dob"),
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  await db.birthdayContact.create({
    data: { name: parsed.data.name, email: parsed.data.email, dob: new Date(parsed.data.dob) },
  });

  revalidatePath("/admin/birthdays");
  return { success: true, message: "Contact added." };
}

export async function deleteBirthdayContact(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Not authenticated" };

  await db.birthdayContact.delete({ where: { id } });
  revalidatePath("/admin/birthdays");
  return { success: true, message: "Contact removed." };
}
