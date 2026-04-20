/*
 * Fil: proxy.ts
 * Syfte: Skyddar admin-routes innan sidan laddas.
 * Vad koden gör: Kollar session-cookie, redirectar till login och sätter säkerhetsheaders.
 * Lär dig: Viktig fil för att förstå route-skydd i Next.js.
 * Felsökning: Om admin redirectar fel eller släpper in fel användare, börja här.
 */
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/admin/auth";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // Samlar små säkerhetsheaders på ett ställe så adminrutter får samma skydd.
  const withSecurityHeaders = (response: NextResponse) => {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  };

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Login-sidan ska vara tillgänglig när man inte är inloggad, men hoppa vidare om cookie redan finns.
  if (pathname === "/admin/login") {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (isValidSessionToken(token)) {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin/dashboard", request.url))
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (isValidSessionToken(token)) {
    return withSecurityHeaders(NextResponse.next());
  }

  // Alla andra adminrutter skickas till login om session saknas.
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return withSecurityHeaders(NextResponse.redirect(loginUrl));
}

export const config = {
  matcher: ["/admin/:path*"],
};
