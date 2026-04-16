/*
 * Fil: app/om-oss/page.tsx
 * Syfte: Bakåtkompatibel route för "Om oss".
 * Vad koden gör: Redirectar till om-oss-sektionen på startsidan.
 * Lär dig: Visar hur man kan behålla gamla länkar trots ny sidstruktur.
 * Felsökning: Kontrollera section-namnet om redirecten inte fungerar.
 */
import { RedirectToHash } from "@/components/RedirectToHash";

export default function Page() {
  return <RedirectToHash section="om-oss" />;
}
