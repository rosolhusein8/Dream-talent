/*
 * Fil: lib/admin/auth.ts
 * Syfte: Hjälpfunktioner för admin-autentisering.
 * Vad koden gör: Hanterar lösenord, session-token och kontroll av säker env-konfiguration.
 * Lär dig: Bra fil för att förstå hur auth-logik kan separeras från API-routes.
 * Felsökning: Om login strular, kontrollera env-värden och token-jämförelser här.
 */
export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_VERSION = "v1";
const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEFAULT_ADMIN_SESSION_SECRET = "dream-talent-dev-secret-change-me";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_ADMIN_SESSION_SECRET;
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminConfigError() {
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === DEFAULT_ADMIN_PASSWORD) {
    return "ADMIN_PASSWORD måste sättas till ett eget starkt lösenord.";
  }

  if (
    !process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET === DEFAULT_ADMIN_SESSION_SECRET
  ) {
    return "ADMIN_SESSION_SECRET måste sättas till en egen hemlig nyckel.";
  }

  if (process.env.ADMIN_SESSION_SECRET.length < 24) {
    return "ADMIN_SESSION_SECRET måste vara minst 24 tecken.";
  }

  return null;
}

export function verifyAdminPassword(password: string) {
  return password === getAdminPassword();
}

export function createSessionToken() {
  return `${SESSION_VERSION}:${getSecret()}`;
}

export function isValidSessionToken(token: string | undefined) {
  return Boolean(token) && token === createSessionToken();
}
