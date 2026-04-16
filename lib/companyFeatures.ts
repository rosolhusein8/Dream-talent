/*
 * Fil: lib/companyFeatures.ts
 * Syfte: Innehållsdata för företagssektionen.
 * Vad koden gör: Exporterar feature-texter och ikon-typer som UI-komponenter använder.
 * Lär dig: Bra exempel på att separera innehåll från komponentkod.
 * Felsökning: Om text eller ikon inte stämmer i företagsdelen, börja här.
 */
export type CompanyFeatureIcon = "clock" | "target" | "leaf";

export type CompanyFeature = {
  icon: CompanyFeatureIcon;
  text: string;
};

export const companyFeatures: CompanyFeature[] = [
  {
    icon: "clock",
    text: "Snabb process - vi levererar kandidater inom 2 veckor",
  },
  {
    icon: "target",
    text: "Hög träffsäkerhet med vår avancerade matchningsprocess",
  },
  {
    icon: "leaf",
    text: "Fokus på hållbarhet och mångfald i varje process",
  },
];
