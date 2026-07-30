import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendBirthdayEmail } from "@/lib/birthday-email";

// Runs once a day via Vercel Cron (see vercel.json) — a single quick query,
// not polling, so this doesn't keep the database compute active the way
// client-side polling would.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const currentYear = today.getFullYear();

  const contacts = await db.birthdayContact.findMany();
  const dueToday = contacts.filter(
    (c) => c.dob.getMonth() === todayMonth && c.dob.getDate() === todayDate && c.lastWishedYear !== currentYear
  );

  const results: { email: string; sent: boolean }[] = [];

  for (const contact of dueToday) {
    try {
      const result = await sendBirthdayEmail({ name: contact.name, email: contact.email });
      if (!result.skipped) {
        await db.birthdayContact.update({
          where: { id: contact.id },
          data: { lastWishedYear: currentYear },
        });
      }
      results.push({ email: contact.email, sent: !result.skipped });
    } catch (err) {
      console.error(`[birthday-wishes] Failed to send to ${contact.email}:`, err);
      results.push({ email: contact.email, sent: false });
    }
  }

  return NextResponse.json({ checked: contacts.length, dueToday: dueToday.length, results });
}
