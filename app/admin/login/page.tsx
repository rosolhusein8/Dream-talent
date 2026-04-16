/*
 * Fil: app/admin/login/page.tsx
 * Syfte: Inloggningssida för admin.
 * Vad koden gör: Visar lösenordsformulär, kontrollerar env-konfig och loggar in via API.
 * Lär dig: Se hur useEffect hämtar configstatus och hur submit hanterar redirect.
 * Felsökning: Titta på configError, felmeddelanden och nätverksanrop till /api/admin/login.
 */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/dashboard";
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [configError, setConfigError] = useState("");
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkConfig() {
      try {
        const response = await fetch("/api/admin/login", { method: "GET" });
        const payload = (await response.json()) as { configError?: string };
        if (!isMounted) return;
        setConfigError(payload.configError || "");
      } catch {
        if (!isMounted) return;
        setConfigError("Kunde inte kontrollera admin-konfigurationen.");
      } finally {
        if (isMounted) {
          setIsCheckingConfig(false);
        }
      }
    }

    checkConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (configError) return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Kunde inte logga in.");
      }
      router.replace(next);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Kunde inte logga in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Admin login</h1>
        <p className="mt-2 text-sm text-zinc-600">Logga in for att komma at adminpanelen.</p>
        {configError ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-medium">Admin-login är inte konfigurerad ännu.</p>
            <p className="mt-1">{configError}</p>
            <p className="mt-2 text-amber-800">Lägg in värden i `.env.local` utifrån `.env.example` och starta om servern.</p>
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-800">
              Losenord
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={Boolean(configError) || isCheckingConfig}
              className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-100"
            />
          </div>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting || Boolean(configError) || isCheckingConfig}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#080b22] px-4 text-sm font-semibold text-white transition hover:bg-[#13183b] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCheckingConfig ? "Kontrollerar..." : isSubmitting ? "Loggar in..." : "Logga in"}
          </button>
        </form>
      </div>
    </main>
  );
}