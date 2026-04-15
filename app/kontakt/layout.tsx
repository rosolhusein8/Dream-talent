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
