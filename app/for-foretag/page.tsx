/*
 * Fil: app/for-foretag/page.tsx
 * Syfte: Bakåtkompatibel route för "För företag".
 * Vad koden gör: Redirectar användaren till rätt sektion på startsidan.
 * Lär dig: Enkel route som bara återanvänder RedirectToHash.
 * Felsökning: Om länken går fel, kontrollera section-namnet.
 */
import { RedirectToHash } from "@/components/RedirectToHash";

export default function Page() {
  return <RedirectToHash section="foretag" />;
}
