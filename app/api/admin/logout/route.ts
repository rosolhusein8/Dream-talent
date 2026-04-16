/*
 * Fil: app/api/admin/logout/route.ts
 * Syfte: API för att logga ut admin.
 * Vad koden gör: Rensar session-cookien.
 * Lär dig: Enkel route handler som bara skickar tillbaka JSON + cookie-ändring.
 * Felsökning: Om logout inte fungerar, kontrollera cookienamn och path.
 */
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
