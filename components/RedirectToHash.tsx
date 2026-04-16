/*
 * Fil: components/RedirectToHash.tsx
 * Syfte: Skickar gamla routes vidare till en sektion på startsidan.
 * Vad koden gör: När komponenten laddas redirectar den till `/#section`.
 * Lär dig: Enkel klientredirect med useEffect.
 * Felsökning: Om redirect inte sker, kontrollera section-prop och routermiljö.
 */
"use client";

import { useEffect } from "react";

/** Client redirect to `/#section` for old route URLs. */
export function RedirectToHash({ section }: { section: string }) {
  useEffect(() => {
    window.location.replace(`/#${section}`);
  }, [section]);

  return (
    <main className="flex min-h-[40vh] items-center justify-center px-4">
      <p className="text-sm text-zinc-600">Omdirigerar till startsidan…</p>
    </main>
  );
}
