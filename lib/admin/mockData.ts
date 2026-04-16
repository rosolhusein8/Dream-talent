
/*
 * Fil: lib/admin/mockData.ts
 * Syfte: Typer och mockdata för adminpanelen.
 * Vad koden gör: Definierar datastrukturer för CV, jobb, företag och tjänster.
 * Lär dig: Den här filen är bra för att förstå hela datamodellen i projektet.
 * Felsökning: Om listor visar konstigt innehåll, kontrollera typer och exempeldata här.
 */

export type DashboardStats = {
  cvCount: number;
  cvNewThisWeek: number;
  jobCount: number;
  jobPending: number;
  companyCount: number;
  companyNew: number;
};

export const dashboardStats: DashboardStats = {
  cvCount: 4,
  cvNewThisWeek: 2,
  jobCount: 3,
  jobPending: 1,
  companyCount: 3,
  companyNew: 1,
};
export type AdminTab = "cv" | "jobs" | "company" | "services";

export type CVRegistration = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  competence: string;
  cvFileName?: string;
  cvFilePath?: string;
  createdAt: string;
  status: "Ny" | "Läst";
};

export type JobApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  cvFileName?: string;
  cvFilePath?: string;
  createdAt: string;
  status: "Ny" | "Läst" | "Väntande";
};

export type CompanyInquiry = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  message: string;
  createdAt: string;
  status: "Ny" | "Läst" | "Besvarad";
};

export const cvRegistrations: CVRegistration[] = [
  {
    id: "cv-1",
    fullName: "Anna Svensson",
    email: "anna@exempel.se",
    phone: "+46 70 111 22 33",
    competence: "HR & Rekrytering",
    createdAt: "2026-04-12",
    status: "Ny",
  },
  {
    id: "cv-2",
    fullName: "Erik Lund",
    email: "erik@exempel.se",
    phone: "+46 70 222 33 44",
    competence: "Ekonomi",
    createdAt: "2026-04-10",
    status: "Läst",
  },
];

export const jobApplications: JobApplication[] = [
  {
    id: "job-1",
    fullName: "Maria Holm",
    email: "maria@exempel.se",
    phone: "+46 70 333 44 55",
    role: "Rekryteringskonsult",
    createdAt: "2026-04-12",
    status: "Väntande",
  },
  {
    id: "job-2",
    fullName: "Johan Berg",
    email: "johan@exempel.se",
    phone: "+46 70 444 55 66",
    role: "HR Business Partner",
    createdAt: "2026-04-11",
    status: "Ny",
  },
];

export const companyInquiries: CompanyInquiry[] = [
  {
    id: "co-1",
    companyName: "TechCorp AB",
    contactPerson: "Karl Andersson",
    email: "karl@techcorp.se",
    phone: "+46 8 123 456",
    industry: "Tech & IT",
    message: "Vi söker 3 seniora utvecklare för ett nytt projekt...",
    createdAt: "2026-04-12",
    status: "Ny",
  },
  {
    id: "co-2",
    companyName: "Nordic Care",
    contactPerson: "Lisa Ek",
    email: "lisa@nordiccare.se",
    phone: "+46 8 765 432",
    industry: "Hälsa",
    message: "Behöver stöd i rekrytering av teamledare.",
    createdAt: "2026-04-09",
    status: "Läst",
  },
];

export type ServiceItem = {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  location: string;
  employmentType: "Heltid" | "Deltid";
  publishedAt: string;
  lastApplyDate: string;
  status: "Publicerad" | "Utkast";
  updatedAt: string;
};

export const mockServices: ServiceItem[] = [
  {
    id: "svc-1",
    title: "Direktrekrytering",
    excerpt: "Vi hittar rätt kandidat för permanenta roller.",
    description:
      "Vi hjälper er att hitta och anställa rätt kandidat för permanenta tjänster med gedigen screening och matchning.",
    location: "Stockholm",
    employmentType: "Heltid",
    publishedAt: "2026-04-01",
    lastApplyDate: "2026-06-30",
    status: "Publicerad",
    updatedAt: "2026-04-12",
  },
  {
    id: "svc-2",
    title: "Konsultuthyrning",
    excerpt: "Snabb tillgång till kompetenta konsulter.",
    description:
      "Snabb tillgång till kompetenta konsulter för era projekt och tillfälliga behov.",
    location: "Göteborg / Hybrid",
    employmentType: "Heltid",
    publishedAt: "2026-03-28",
    lastApplyDate: "2026-06-30",
    status: "Publicerad",
    updatedAt: "2026-04-11",
  },
  {
    id: "svc-3",
    title: "Executive Search",
    excerpt: "Specialiserad rekrytering av ledare.",
    description:
      "Specialiserad rekrytering av ledare och nyckelpositioner med diskret och professionell hantering.",
    location: "Malmö",
    employmentType: "Deltid",
    publishedAt: "2026-03-20",
    lastApplyDate: "2026-06-15",
    status: "Utkast",
    updatedAt: "2026-04-10",
  },
];