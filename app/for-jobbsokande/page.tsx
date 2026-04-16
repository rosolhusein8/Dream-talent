/*
 * Fil: app/for-jobbsokande/page.tsx
 * Syfte: Bakåtkompatibel route för "För jobbsökande".
 * Vad koden gör: Redirectar till jobbsökande-sektionen på startsidan.
 * Lär dig: Minimal route som återanvänder en gemensam redirect-komponent.
 * Felsökning: Om sektionen inte hittas, kontrollera hash-id på startsidan.
 */
import { RedirectToHash } from "@/components/RedirectToHash";

export default function Page() {
  return <RedirectToHash section="jobbsokande" />;
}
