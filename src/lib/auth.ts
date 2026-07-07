import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SESSION_OPTIONS, type SessionData } from "./session-config";

export type { SessionData };
export { SESSION_OPTIONS };

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function requireAdmin(): Promise<SessionData | null> {
  const session = await getSession();
  if (!session.adminId) return null;
  return { adminId: session.adminId, email: session.email, role: session.role };
}
