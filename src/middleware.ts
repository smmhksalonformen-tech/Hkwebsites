import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SESSION_OPTIONS, type SessionData } from "@/lib/session-config";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, SESSION_OPTIONS);

  if (!session.adminId) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
