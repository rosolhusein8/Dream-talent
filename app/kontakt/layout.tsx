/*
 * Fil: app/kontakt/layout.tsx
 * Syfte: Metadata/layout för kontaktsidan.
 * Vad koden gör: Sätter titel och beskrivning för SEO och browser-flik.
 * Lär dig: Bra exempel på Next.js metadata i App Router.
 * Felsökning: Om sidtitel eller meta inte stämmer, kontrollera denna fil.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | Dream Talent",
  description:
    "Kontakta Dream Talent för frågor om rekrytering, samarbete eller våra tjänster. Vi återkommer så snart vi kan.",
  openGraph: {
    title: "Kontakt | Dream Talent",
    description:
      "Kontakta Dream Talent för frågor om rekrytering, samarbete eller våra tjänster. Vi återkommer så snart vi kan.",
    type: "website",
  },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
