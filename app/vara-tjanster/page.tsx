/*
 * Fil: app/vara-tjanster/page.tsx
 * Syfte: Bakåtkompatibel route för "Våra tjänster".
 * Vad koden gör: Redirectar till tjänste-sektionen på startsidan.
 * Lär dig: Enkel route som hjälper gamla länkar fortsätta fungera.
 * Felsökning: Om fel sektion öppnas, kontrollera section-värdet här.
 */
import { RedirectToHash } from "@/components/RedirectToHash";

export default function Page() {
  return <RedirectToHash section="vara-tjanster" />;
}
