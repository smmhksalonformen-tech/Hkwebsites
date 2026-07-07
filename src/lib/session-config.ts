export type SessionData = {
  adminId: string;
  email: string;
  role: string;
};

export const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET ?? "hk-salon-dev-secret-change-in-prod-32c",
  cookieName: "hksalon_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};
