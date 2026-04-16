/*
 * Fil: components/CompanyFeatureIcon.tsx
 * Syfte: Returnerar rätt ikon för företagsfunktioner.
 * Vad koden gör: Matchar ett ikon-namn till en Lucide-ikon.
 * Lär dig: Enkel exempel-fil för hur man mappar typade värden till UI.
 * Felsökning: Om fel ikon visas, kontrollera inkommande namn från companyFeatures.
 */
import type { CompanyFeatureIcon as IconName } from "@/lib/companyFeatures";
import { CircleDot, Clock3, Leaf } from "lucide-react";

const className = "h-5 w-5 shrink-0 text-zinc-900";

export function CompanyFeatureIcon({ name }: { name: IconName }) {
  switch (name) {
    case "clock":
      return <Clock3 className={className} strokeWidth={2} aria-hidden />;
    case "target":
      return <CircleDot className={className} strokeWidth={2} aria-hidden />;
    case "leaf":
      return <Leaf className={className} strokeWidth={2} aria-hidden />;
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}
