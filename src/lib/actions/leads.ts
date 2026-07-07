"use server";

import { db } from "@/lib/db";

export async function createLead(data: {
  name: string;
  phone: string;
  service?: string;
  specialist?: string;
  date?: string;
  time?: string;
}) {
  try {
    await db.lead.create({ data });
  } catch {
    // Non-fatal — WhatsApp handoff is the primary path, DB logging is a bonus for the dashboard.
  }
}

export async function createMessage(data: { name: string; phone: string; email?: string; message: string }) {
  await db.message.create({ data });
  return { success: true };
}
