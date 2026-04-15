export type CompanyFeatureIcon = "clock" | "target" | "shield" | "leaf";

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
    icon: "shield",
    text: "6 månaders garanti på alla våra rekryteringar",
  },
  {
    icon: "leaf",
    text: "Fokus på hållbarhet och mångfald i varje process",
  },
];
