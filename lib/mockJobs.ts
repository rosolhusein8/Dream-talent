export type JobCategory =
  | "Teknik"
  | "Design"
  | "Produkt"
  | "Försäljning"
  | "HR"
  | "Marknad";

/** Nycklar för ortfilter (små bokstäver, inga mellanslag) */
export type CityFilterId =
  | "stockholm"
  | "goteborg"
  | "malmo"
  | "helsingborg"
  | "uppsala"
  | "lund"
  | "linkoping"
  | "orebro"
  | "distans"
  | "hybrid";

export type Job = {
  title: string;
  slug: string;
  department: string;
  category: JobCategory;
  employmentType: string;
  postedDate: string;
  summary: string;
  /** Flera stycken separeras med dubbla radbrytningar (\n\n) */
  longDescription: string;
  requirements: string[];
  /** Meriterande, inte hårda krav */
  niceToHave?: string[];
  /** Visas på kortet, t.ex. "Göteborg / Hybrid" */
  locationDisplay: string;
  /** Vilka orter jobbet matchar vid filter (kan vara flera) */
  cityTags: CityFilterId[];
  skills: string[];
  /** true = distans och/eller hybrid möjlig (inte bara kontor) */
  remoteAvailable: boolean;
  applyEmail: string;
  lastApplyDate: string;
};

/** Dropdown: Alla orter + svenska städer (visningsnamn med stor bokstav) */
export const cityFilterOptions: { value: "all" | CityFilterId; label: string }[] =
  [
    { value: "all", label: "Alla orter" },
    { value: "stockholm", label: "Stockholm" },
    { value: "goteborg", label: "Göteborg" },
    { value: "malmo", label: "Malmö" },
    { value: "helsingborg", label: "Helsingborg" },
    { value: "uppsala", label: "Uppsala" },
    { value: "lund", label: "Lund" },
    { value: "linkoping", label: "Linköping" },
    { value: "orebro", label: "Örebro" },
    { value: "distans", label: "Distans" },
    { value: "hybrid", label: "Hybrid" },
  ];

export const mockJobs: Job[] = [
  {
    title: "UX/UI Designer",
    slug: "ux-ui-designer-goteborg",
    department: "Design",
    category: "Design",
    employmentType: "Heltid",
    postedDate: "2026-04-01",
    summary:
      "Skapa användarvänliga gränssnitt och samarbeta nära produkt och utveckling i spännande kundprojekt.",
    longDescription:
      "Du formar hur användare möter våra kunders digitala produkter — från tidig idé till färdigt gränssnitt. Du jobbar nära produktägare och utvecklare i team som värdesätter tempo, tydlighet och tillgänglighet.\n\nArbetet sker till stor del på plats i Göteborg med möjlighet till viss distans enligt överenskommelse. Du förväntas ta ägande för användarflöden, visuell kvalitet och att designbeslut landar i leverans.",
    requirements: [
      "Minst 3 års erfarenhet av UX/UI för webb eller produkt",
      "Vana att arbeta i Figma och att dokumentera komponenter och tillstånd",
      "God förmåga att genomföra och tillämpa insikter från användarstudier",
      "Flytande svenska och engelska i tal och skrift",
    ],
    niceToHave: [
      "Erfarenhet av design systems och samarbete med utvecklare i sprint",
      "Kunskap om WCAG och inkluderande design",
    ],
    locationDisplay: "Göteborg / Hybrid",
    cityTags: ["goteborg", "hybrid"],
    skills: ["Figma", "User Research", "Prototyping"],
    remoteAvailable: true,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
  {
    title: "Frontendutvecklare",
    slug: "frontendutvecklare-stockholm",
    department: "Teknik",
    category: "Teknik",
    employmentType: "Heltid",
    postedDate: "2026-03-28",
    summary:
      "Bygg moderna webbgränssnitt i React/Next.js och bidra till snabb, tillgänglig användarupplevelse.",
    longDescription:
      "Vi söker en frontendutvecklare som trivs i React-ekosystemet och bryr sig om prestanda, kodkvalitet och användarupplevelse. Du ingår i leveransteam hos kund och samarbetar tätt med design och backend.\n\nRollen kan utföras på distans inom Sverige med regelbundna möten enligt teamets behov. Du bidrar med kodgranskning, tekniska avvägningar och en tydlig frontend-struktur.",
    requirements: [
      "Minst 2 års erfarenhet av professionell frontendutveckling",
      "Stark vana vid TypeScript och React",
      "Erfarenhet av Next.js eller motsvarande SSR/SSG-ramverk",
      "Förståelse för responsiv layout, tillgänglighet och webbprestanda",
    ],
    niceToHave: [
      "Erfarenhet av Tailwind CSS eller liknande utility-first-approach",
      "Vana vid CI/CD och enhetstester för UI",
    ],
    locationDisplay: "Stockholm / Distans",
    cityTags: ["stockholm", "distans"],
    skills: ["React", "TypeScript", "Next.js"],
    remoteAvailable: true,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
  {
    title: "Produktägare",
    slug: "produktagare-malmo",
    department: "Produkt",
    category: "Produkt",
    employmentType: "Heltid",
    postedDate: "2026-03-20",
    summary:
      "Äg backlog, prioritering och samordning mellan intressenter för att leverera värde i rätt ordning.",
    longDescription:
      "Som produktägare driver du prioritering och roadmap i nära dialog med intressenter och utvecklingsteam. Du översätter affärsmål till tydliga backloggar, accepterar leveranser och säkerställer att värdet mätas och följs upp.\n\nTjänsten är placerad i Malmö med närvaro på plats i huvudsakliga workshops och sprintceremonier.",
    requirements: [
      "Erfarenhet av produktägarroll eller motsvarande ansvar för backlog och prioritering",
      "Vana vid agila arbetssätt (Scrum/Kanban)",
      "Förmåga att facilitera beslut mellan teknik, sälj och kund",
      "Utmärkt kommunikation på svenska och engelska",
    ],
    niceToHave: [
      "Certifiering eller dokumenterad erfarenhet av Product Owner-rollen",
      "Erfarenhet från B2B eller SaaS",
    ],
    locationDisplay: "Malmö",
    cityTags: ["malmo"],
    skills: ["Roadmap", "Agile", "Stakeholders"],
    remoteAvailable: false,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
  {
    title: "Account Manager",
    slug: "account-manager-goteborg",
    department: "Försäljning",
    category: "Försäljning",
    employmentType: "Heltid",
    postedDate: "2026-03-15",
    summary:
      "Bygg långsiktiga kundrelationer och säkerställ tillväxt genom strukturerad affärsutveckling.",
    longDescription:
      "Du ansvarar för utvalda kundkonton med fokus på retention, up-sell och nöjdhet. Genom strukturerad uppföljning och affärsmässig dialog säkerställer du att avtal och leveranser ligger i linje med kundens mål.\n\nRollen kräver närvaro i Göteborg för möten och kundbesök enligt plan.",
    requirements: [
      "Flerårig erfarenhet av B2B-försäljning eller kundansvar",
      "Trygg i förhandling, upphandling och avtalsdiskussion",
      "God systemvana (CRM) och strukturerad arbetsmetod",
      "B-körkort och vilja att resa inom regionen vid behov",
    ],
    niceToHave: [
      "Erfarenhet från rekrytering, konsult eller tjänsteförsäljning",
      "Vana att arbeta mot budget och prognos",
    ],
    locationDisplay: "Göteborg",
    cityTags: ["goteborg"],
    skills: ["B2B", "CRM", "Förhandling"],
    remoteAvailable: false,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
  {
    title: "HR-specialist",
    slug: "hr-specialist-goteborg",
    department: "HR",
    category: "HR",
    employmentType: "Deltid",
    postedDate: "2026-01-15",
    summary:
      "Stöd kunder med personalfrågor, arbetsrätt och processer för en trygg arbetsmiljö.",
    longDescription:
      "I rollen som HR-specialist bistår du våra kunder med rådgivning inom arbetsrätt, avtal, förändringsprocesser och arbetsmiljö. Du kan arbeta både operativt och som bollplank i mer komplexa frågor.\n\nTjänsten är deltid med placering i Göteborg och en fördelning mellan kontor och distans enligt överenskommelse.",
    requirements: [
      "Akademisk utbildning inom HR eller motsvarande erfarenhet som bedöms likvärdig",
      "God kunskap om svensk arbetsrätt och kollektivavtal",
      "Erfarenhet av att stödja chefer i personalfrågor",
      "Serviceinriktad och tydlig i skrift och tal",
    ],
    niceToHave: [
      "Erfarenhet från konsultativ HR eller som HR-generalist",
      "Kunskap om arbetsmiljölagstiftning och rehabiliteringsprocesser",
    ],
    locationDisplay: "Göteborg",
    cityTags: ["goteborg"],
    skills: ["Arbetsrätt", "HR-processer", "Rekrytering"],
    remoteAvailable: false,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
  {
    title: "Talent Acquisition Manager",
    slug: "talent-acquisition-manager-malmo",
    department: "Rekrytering",
    category: "HR",
    employmentType: "Heltid",
    postedDate: "2026-01-30",
    summary:
      "Leda search-arbetet och utveckla strategier för att attrahera rätt talanger till nyckelroller.",
    longDescription:
      "Du leder och kvalitetssäkrar search mot krävande roller, samtidigt som du utvecklar arbetssätt, kanaler och samarbete med hiring managers. Du har ett helhetsperspektiv från kravprofil till erbjudande och kandidatupplevelse.\n\nPlacering Malmö med hybridupplägg; resor i tjänsten kan förekomma.",
    requirements: [
      "Flerårig erfarenhet av search mot specialist- eller ledningsroller",
      "Dokumenterad förmåga att driva processer med flera intressenter",
      "Strategiskt tänk kring employer branding och kandidatresa",
      "Flytande svenska och engelska",
    ],
    niceToHave: [
      "Erfarenhet av rekrytering inom tech eller konsultbransch",
      "Vana vid ATS och datadriven uppföljning",
    ],
    locationDisplay: "Malmö / Hybrid",
    cityTags: ["malmo", "hybrid"],
    skills: ["Executive search", "Employer branding", "Process"],
    remoteAvailable: true,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
  {
    title: "Growth Marketer",
    slug: "growth-marketer-distans",
    department: "Marknad",
    category: "Marknad",
    employmentType: "Heltid",
    postedDate: "2026-03-10",
    summary:
      "Driv tillväxt med datadriven marknadsföring, experiment och optimering av kanaler.",
    longDescription:
      "Du ansvarar för att planera, genomföra och följa upp kampanjer och experiment som driver kvalificerade leads och konvertering. Arbetet är nära kopplat till sälj och produkt beroende på kunduppdrag.\n\nTjänsten är helt på distans inom Sverige; verktyg och möten sker digitalt i första hand.",
    requirements: [
      "Erfarenhet av performance-marknadsföring (betald social, SEM eller liknande)",
      "Vana att arbeta med analys (t.ex. GA4, annonsplattformar)",
      "Strukturerad testmetodik och dokumentation av resultat",
      "Goda kunskaper i svenska och engelska",
    ],
    niceToHave: [
      "Erfarenhet av B2B eller leadgenerering",
      "Kunskap om SEO och innehåll som stödjer konvertering",
    ],
    locationDisplay: "Distans (Sverige)",
    cityTags: ["distans"],
    skills: ["Analytics", "SEO", "Paid social"],
    remoteAvailable: true,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
  {
    title: "Rekryteringskonsult",
    slug: "rekryteringskonsult-stockholm",
    department: "Rekrytering",
    category: "HR",
    employmentType: "Heltid",
    postedDate: "2026-02-01",
    summary:
      "Matcha kandidater och kunder i hela rekryteringsprocessen med fokus på kvalitet och tempo.",
    longDescription:
      "Som rekryteringskonsult äger du hela kedjan från intag och kravprofil till tillsättning och uppföljning. Du bygger förtroende hos både kandidater och kunder och säkerställer att processer håller hög kvalitet och rätt tempo.\n\nPlacering Stockholm med arbete från kontor i huvudsak; viss flexibilitet kan diskuteras.",
    requirements: [
      "Erfarenhet av helhetsrekrytering eller search inom konsultativ rekrytering",
      "Utmärkta kommunikations- och intervjufärdigheter",
      "Förmåga att hantera flera processer parallellt med tydlig prioritering",
      "Svenska och engelska obehindrat",
    ],
    niceToHave: [
      "Nätverk eller erfarenhet inom affärsområden vi ofta rekryterar till",
      "Vana vid CRM/ATS och GDPR i rekryteringsprocesser",
    ],
    locationDisplay: "Stockholm",
    cityTags: ["stockholm"],
    skills: ["Search", "Intervjuer", "Kunddialog"],
    remoteAvailable: false,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
  {
    title: "Kundansvarig sälj",
    slug: "kundansvarig-salj-helsingborg",
    department: "Försäljning",
    category: "Försäljning",
    employmentType: "Heltid",
    postedDate: "2026-04-05",
    summary:
      "Utveckla befintliga kunder i Skåne och bygg långsiktiga relationer med fokus på nytta och tillväxt.",
    longDescription:
      "Du ansvarar för ett antal kundkonton i regionen med fokus på tillväxt, lönsamhet och långsiktiga relationer. Genom regelbunden dialog och affärsmässig rådgivning identifierar du behov och säkerställer att våra erbjudanden matchar kundens utveckling.\n\nTjänsten är placerad i Helsingborg med resor i Skåne.",
    requirements: [
      "Dokumenterad erfarenhet av KAM eller motsvarande kundansvar inom B2B",
      "Trygg i hela säljprocessen från planering till avtal",
      "Självgående med stark resultatorientering",
      "B-körkort",
    ],
    niceToHave: [
      "Erfarenhet från tjänsteförsäljning eller rekrytering",
      "Vana att arbeta med CRM och prognos",
    ],
    locationDisplay: "Helsingborg",
    cityTags: ["helsingborg"],
    skills: ["KAM", "Sälj", "Relation"],
    remoteAvailable: false,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: "2026-06-30",
  },
];
