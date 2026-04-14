import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockJobs } from "@/lib/mockJobs";

type Props = {
  params: Promise<{ slug: string }>;
};

function getJobBySlug(slug: string) {
  return mockJobs.find((j) => j.slug === slug);
}

function formatSwedishDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const title = `${job.title} – ${job.locationDisplay} | Dream Talent`;
  const description = job.summary;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-zinc-800">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-500">
          <Link
            href="/lediga-tjanster"
            className="font-medium text-zinc-700 transition hover:text-zinc-900 hover:underline"
          >
            ← Tillbaka till lediga tjänster
          </Link>
        </p>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{job.title}</h1>

        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm text-zinc-600">
          <span>{job.locationDisplay}</span>
          <span aria-hidden>·</span>
          <span>{job.employmentType}</span>
          <span aria-hidden>·</span>
          <span>{job.department}</span>
          <span aria-hidden>·</span>
          <span>Publicerad {formatSwedishDate(job.postedDate)}</span>
          <span aria-hidden>·</span>
          <span>Sista ansökningsdag {formatSwedishDate(job.lastApplyDate)}</span>
        </div>

        <p className="mt-8 text-lg leading-relaxed text-zinc-700">{job.summary}</p>

        <div className="mt-8 space-y-4 text-base leading-relaxed text-zinc-700">
          {job.longDescription.split("\n\n").map((block, i) => (
            <p key={i}>{block}</p>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900">Krav</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-700 marker:text-zinc-400">
            {job.requirements.map((line) => (
              <li key={line} className="pl-1">
                {line}
              </li>
            ))}
          </ul>
        </section>

        {job.niceToHave && job.niceToHave.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-zinc-900">Meriterande</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-700 marker:text-zinc-400">
              {job.niceToHave.map((line) => (
                <li key={line} className="pl-1">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-base font-semibold text-zinc-900">Ansökan</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Här kan du senare lägga ansökningsformulär eller länk till e-post.
          </p>
          <Link
            href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(
              `Ansökan: ${job.title}`
            )}&body=${encodeURIComponent(
              `Hej Dream Talent,\n\nJag vill ansöka till rollen ${job.title}.\n\nNamn:\nTelefon:\nLinkedIn/CV:\n\nMed vänlig hälsning,`
            )}`}
            className="mt-5 inline-flex rounded-lg bg-[#080b22] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#13183b]"
          >
            Ansök via e-post
          </Link>
        </div>
      </div>
    </main>
  );
}
