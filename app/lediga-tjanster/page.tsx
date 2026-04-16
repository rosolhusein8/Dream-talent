/*
 * Fil: app/lediga-tjanster/page.tsx
 * Syfte: Lista alla publicerade lediga tjänster.
 * Vad koden gör: Renderar kort/lista från jobbkällan och länkar till detaljsidor.
 * Lär dig: Se hur data mappas till UI och hur varje tjänst får egen slug-länk.
 * Felsökning: Om listan är tom, kontrollera jobbkällan i lib/jobsSource.
 */
"use client";

import Link from "next/link";
import { useMemo, useState, type SVGProps } from "react";
import { cityFilterOptions, type CityFilterId } from "@/lib/mockJobs";
import { getClientListingJobs, type ListingJob } from "@/lib/jobsSource";

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.2 16.2 21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}

function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="8"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8v4l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatSwedishDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<"all" | CityFilterId>("all");
  const [remote, setRemote] = useState<"all" | "remote" | "onsite">("all");
  const combinedJobs = useMemo<ListingJob[]>(() => getClientListingJobs(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return combinedJobs.filter((job) => {
      if (cityFilter !== "all" && !job.cityTags.includes(cityFilter)) {
        return false;
      }
      if (remote === "remote" && !job.remoteAvailable) return false;
      if (remote === "onsite" && job.remoteAvailable) return false;
      if (!q) return true;
      const hay = [
        job.title,
        job.summary,
        job.department,
        job.category,
        ...job.skills,
        job.locationDisplay,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, cityFilter, remote, combinedJobs]);

  return (
    <main className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold tracking-tight text-[#000000] sm:text-4xl">
          Lediga tjänster
        </h1>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="flex flex-col gap-3">
            <div className="relative min-w-0">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök efter roll, kompetens eller avdelning..."
                className="w-full rounded-2xl border border-[#E5E5E7] bg-[#F2F2F4] py-3.5 pl-12 pr-4 text-sm text-[#000000] placeholder:text-[#6B7280] focus:border-[#E5E5E7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E5E5E7]"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value as "all" | CityFilterId)}
                className="w-full rounded-2xl border border-[#E5E5E7] bg-[#F2F2F4] px-4 py-3.5 text-sm font-medium text-[#000000] focus:border-[#E5E5E7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E5E5E7]"
                aria-label="Ort"
              >
                {cityFilterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={remote}
                onChange={(e) => setRemote(e.target.value as "all" | "remote" | "onsite")}
                className="w-full rounded-2xl border border-[#E5E5E7] bg-[#F2F2F4] px-4 py-3.5 text-sm font-medium text-[#000000] focus:border-[#E5E5E7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E5E5E7]"
                aria-label="Arbetsplats"
              >
                <option value="all">Alla arbetssätt</option>
                <option value="remote">Distans eller hybrid</option>
                <option value="onsite">På plats</option>
              </select>
            </div>
          </div>
        </div>

        <section className="mt-10">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E5E7] bg-[#F2F2F4] p-12 text-center">
              <p className="font-medium text-[#000000]">Inga träffar</p>
              <p className="mt-2 text-sm text-[#6B7280]">Prova att ändra sökord eller filter.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCityFilter("all");
                  setRemote("all");
                }}
                className="mt-6 inline-flex rounded-xl bg-[#0A0B14] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#14151f]"
              >
                Rensa filter
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((job) => (
                <article
                  key={job.slug}
                  className="flex flex-col rounded-2xl border border-[#E5E5E7] bg-[#FFFFFF] p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-[#000000] sm:text-xl">
                        {job.title}
                      </h2>
                      <p className="mt-1 text-sm text-[#6B7280]">{job.department}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#F2F2F4] px-3 py-1 text-xs font-medium text-[#000000]">
                      {job.employmentType}
                    </span>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[#6B7280]">{job.summary}</p>

                  <div className="mt-5 space-y-2.5 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <PinIcon className="h-4 w-4 shrink-0 text-[#6B7280]" />
                      <span>{job.locationDisplay}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4 shrink-0 text-[#6B7280]" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 shrink-0 text-[#6B7280]" />
                      <span>{job.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 shrink-0 text-center text-[11px] leading-4 text-[#6B7280]">
                        •
                      </span>
                      <span>Publicerad {formatSwedishDate(job.postedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 shrink-0 text-center text-[11px] leading-4 text-[#6B7280]">
                        •
                      </span>
                      <span>Sista ansökningsdag {formatSwedishDate(job.lastApplyDate)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-[#E5E5E7] bg-[#FFFFFF] px-2.5 py-1 text-xs font-medium text-[#000000]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/lediga-tjanster/${job.slug}`}
                    className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#0A0B14] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#14151f]"
                  >
                    Ansök nu
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
