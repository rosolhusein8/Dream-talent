/*
 * Fil: app/layout.tsx
 * Syfte: Global layout för hela Next.js-appen.
 * Vad koden gör: Laddar global CSS, header, SiteFooter på alla routes och flex-layout.
 * Lär dig: Den här filen visar vad som renderas runt alla sidor.
 * Felsökning: Om något syns på alla sidor, börja ofta här.
 */

import "./globals.css";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}