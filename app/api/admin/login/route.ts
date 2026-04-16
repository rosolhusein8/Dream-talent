/*
 * Fil: app/api/admin/login/route.ts
 * Syfte: API för admin-login.
 * Vad koden gör: Kontrollerar konfiguration, bromsar brute force, verifierar lösenord och sätter cookie.
 * Lär dig: Bra exempel på backend-logik i Next.js route handlers.
 * Felsökning: Kolla configError, rate limit-state och cookie-sättning.
 */
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  getAdminConfigError,
  verifyAdminPassword,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

type AttemptEntry = {
  count: number;
  firstAttemptAt: number;
  blockedUntil: number;
};

const loginAttempts = new Map<string, AttemptEntry>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function getAttemptState(clientKey: string) {
  const now = Date.now();
  const current = loginAttempts.get(clientKey);
  if (!current) {
    return { count: 0, firstAttemptAt: now, blockedUntil: 0 };
  }
  if (current.blockedUntil > now) {
    return current;
  }
  if (now - current.firstAttemptAt > WINDOW_MS) {
    return { count: 0, firstAttemptAt: now, blockedUntil: 0 };
  }
  return current;
}

export async function GET() {
  const configError = getAdminConfigError();
  return NextResponse.json({
    ok: !configError,
    configError,
  });
}

export async function POST(request: Request) {
  const configError = getAdminConfigError();
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 503 });
  }

  const clientKey = getClientKey(request);
  const attemptState = getAttemptState(clientKey);
  if (attemptState.blockedUntil > Date.now()) {
    return NextResponse.json(
      { error: "För många försök. Vänta 15 minuter innan du provar igen." },
      { status: 429 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON." }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && typeof (body as Record<string, unknown>).password === "string"
      ? (body as Record<string, string>).password
      : "";

  if (!password) {
    return NextResponse.json({ error: "Ange lösenord." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    const now = Date.now();
    const nextCount =
      now - attemptState.firstAttemptAt > WINDOW_MS ? 1 : attemptState.count + 1;
    const nextState: AttemptEntry = {
      count: nextCount,
      firstAttemptAt: now - attemptState.firstAttemptAt > WINDOW_MS ? now : attemptState.firstAttemptAt,
      blockedUntil: nextCount >= MAX_ATTEMPTS ? now + BLOCK_MS : 0,
    };
    loginAttempts.set(clientKey, nextState);

    return NextResponse.json({ error: "Fel lösenord." }, { status: 401 });
  }

  loginAttempts.delete(clientKey);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
