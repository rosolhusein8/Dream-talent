/*
 * Fil: lib/jobsSource.ts
 * Syfte: Samlar jobbdata från mockdata och adminstyrda tjänster.
 * Vad koden gör: Normaliserar olika källor till ett gemensamt format för listning.
 * Lär dig: Bra fil för att förstå datatransformering innan rendering.
 * Felsökning: Om jobb saknas eller ser fel ut, kontrollera mapping-logiken här.
 */
import { mockJobs, type CityFilterId, type Job } from "@/lib/mockJobs";
import { type ServiceItem } from "@/lib/admin/mockData";

export type ListingJob = Job & {
  source: "mock" | "admin";
};

const SERVICES_STORAGE_KEY = "admin.services";

// Gör rubriker säkra att använda i URL:er.
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Försöker översätta fritext-plats till filtertaggar som UI:t förstår.
function locationToCityTags(location: string): CityFilterId[] {
  const normalized = location
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const tags: CityFilterId[] = [];
  const lookup: Array<{ needle: string; tag: CityFilterId }> = [
    { needle: "stockholm", tag: "stockholm" },
    { needle: "goteborg", tag: "goteborg" },
    { needle: "malmo", tag: "malmo" },
    { needle: "helsingborg", tag: "helsingborg" },
    { needle: "uppsala", tag: "uppsala" },
    { needle: "lund", tag: "lund" },
    { needle: "linkoping", tag: "linkoping" },
    { needle: "orebro", tag: "orebro" },
    { needle: "hybrid", tag: "hybrid" },
    { needle: "distans", tag: "distans" },
  ];

  lookup.forEach(({ needle, tag }) => {
    if (normalized.includes(needle)) tags.push(tag);
  });

  return tags.length > 0 ? tags : ["stockholm"];
}

// Gör om en adminskapad tjänst till samma format som vanliga jobbannonser använder.
export function mapServiceToListingJob(service: ServiceItem): ListingJob {
  const cityTags = locationToCityTags(service.location);
  const remoteAvailable = cityTags.includes("hybrid") || cityTags.includes("distans");

  return {
    source: "admin",
    title: service.title,
    slug: `admin-${slugify(service.title)}-${service.id.slice(-6)}`,
    department: "Tjänst",
    category: "HR",
    employmentType: service.employmentType,
    postedDate: service.publishedAt,
    summary: service.excerpt,
    longDescription: service.description,
    requirements: [],
    locationDisplay: service.location || "Plats ej angiven",
    cityTags,
    skills: [],
    remoteAvailable,
    applyEmail: "jobb@dreamtalent.se",
    lastApplyDate: service.lastApplyDate,
  };
}

// Huvudfunktion för jobblistan: kombinerar mockjobb med publicerade admin-tjänster.
export function getClientListingJobs(): ListingJob[] {
  const fromMock: ListingJob[] = mockJobs.map((job) => ({ ...job, source: "mock" }));

  try {
    const raw = window.localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) return fromMock;

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fromMock;

    const fromAdmin = (parsed as ServiceItem[])
      .filter((service) => service.status === "Publicerad")
      .map(mapServiceToListingJob);

    return [...fromAdmin, ...fromMock];
  } catch {
    return fromMock;
  }
}
