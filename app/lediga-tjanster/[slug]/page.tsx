/*
 * Fil: app/lediga-tjanster/[slug]/page.tsx
 * Syfte: Detaljsida för en specifik tjänst.
 * Vad koden gör: Hämtar jobb via slug, visar info och skickar ansökan inkl. CV.
 * Lär dig: Följ handleSubmit för ansökningsflödet och localStorage-koppling till admin.
 * Felsökning: Kontrollera slug-matchning, API-svar från /api/apply och filvalidering.
 */
"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getClientListingJobs } from "@/lib/jobsSource";

const JOB_APPLICATIONS_STORAGE_KEY = "admin.jobApplications";

function formatSwedishDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function JobDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const jobs = useMemo(() => getClientListingJobs(), []);
  const job = jobs.find((j) => j.slug === slug);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!job) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      if (!cvFile) {
        throw new Error("Ladda upp ditt CV innan du skickar ansökan.");
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(cvFile.type)) {
        throw new Error("CV måste vara PDF, DOC eller DOCX.");
      }
      if (cvFile.size > 5 * 1024 * 1024) {
        throw new Error("CV-filen är för stor. Max 5 MB.");
      }

      const formData = new FormData();
      formData.append("jobSlug", job.slug);
      formData.append("jobTitle", job.title);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("message", message);
      formData.append("cv", cvFile);

      const response = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        error?: string;
        cvFileName?: string;
        cvFilePath?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || "Något gick fel. Försök igen.");
      }

      const storedRaw = window.localStorage.getItem(JOB_APPLICATIONS_STORAGE_KEY);
      const stored = storedRaw ? (JSON.parse(storedRaw) as unknown) : [];
      const safeStored = Array.isArray(stored) ? stored : [];
      const newApplication = {
        id: `job-${Date.now()}`,
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: job.title,
        cvFileName: payload.cvFileName || cvFile.name,
        cvFilePath: payload.cvFilePath || "",
        starred: false,
        createdAt: new Date().toISOString().slice(0, 10),
        status: "Ny" as const,
      };
      window.localStorage.setItem(
        JOB_APPLICATIONS_STORAGE_KEY,
        JSON.stringify([newApplication, ...safeStored])
      );

      setSubmitSuccess("Tack! Din ansökan är skickad.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setCvFile(null);
    } catch (error) {
      const fallback = "Kunde inte skicka ansökan just nu. Försök igen om en stund.";
      setSubmitError(error instanceof Error ? error.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!job) {
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
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Tjänsten kunde inte hittas
          </h1>
          <p className="mt-4 text-zinc-600">
            Det kan bero på att tjänsten har tagits bort eller inte är publicerad.
          </p>
        </div>
      </main>
    );
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
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">Fyll i formuläret nedan för att skicka din ansökan.</p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-800">
                Namn
              </label>
              <input
                id="name"
                name="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-800">
                  E-post
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-800">
                  Telefon
                </label>
                <input
                  id="phone"
                  name="phone"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-zinc-800">
                Meddelande (valfritt)
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label htmlFor="cv" className="mb-1 block text-sm font-medium text-zinc-800">
                CV (PDF, DOC, DOCX)
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={(event) => setCvFile(event.target.files?.[0] || null)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-zinc-200"
              />
              <p className="mt-1 text-xs text-zinc-500">Max 5 MB.</p>
            </div>

            {submitError ? <p className="text-sm font-medium text-red-600">{submitError}</p> : null}
            {submitSuccess ? <p className="text-sm font-medium text-emerald-600">{submitSuccess}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex rounded-lg bg-[#080b22] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#13183b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Skickar..." : "Skicka ansökan"}
            </button>
          </form>

          <p className="mt-4 text-xs text-zinc-500">Alternativ e-post: {job.applyEmail}</p>
        </div>
      </div>
    </main>
  );
}
