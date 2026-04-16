/*
 * Fil: app/layout.tsx
 * Syfte: Global layout för hela Next.js-appen.
 * Vad koden gör: Laddar global CSS och gemensamma komponenter som header.
 * Lär dig: Den här filen visar vad som renderas runt alla sidor.
 * Felsökning: Om något syns på alla sidor, börja ofta här.
 */

import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}