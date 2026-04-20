/*
 * Fil: components/RegisterCvButton.tsx
 * Syfte: Modal för "Registrera CV".
 * Vad koden gör: Öppnar formulär, validerar input, laddar upp CV och sparar metadata i localStorage.
 * Lär dig: Titta på handleSubmit för hela flödet från UI -> API -> admin-data.
 * Felsökning: Börja med submitError, nätverksanrop till /api/cv/register och filvalidering.
 */
"use client";

import { FormEvent, useEffect, useId, useState } from "react";

type Props = {
  className: string;
  label: string;
};

const CV_STORAGE_KEY = "admin.cvRegistrations";
const roleOptions = ["HR", "Rekrytering", "Ekonomi", "Marknad", "IT", "Annat"];
const experienceOptions = ["0-2 år", "3-5 år", "6-10 år", "10+ år"];

export function RegisterCvButton({ className, label }: Props) {
  // Form-state för modalen. Varje useState motsvarar ett formulärfält.
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [experience, setExperience] = useState("");
  const [about, setAbout] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Hela CV-flödet: bygg FormData, skicka till API och spara resultat för adminpanelen.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    if (!cvFile) {
      setSubmitError("Ladda upp ditt CV.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("location", location);
      formData.append("desiredRole", desiredRole);
      formData.append("experience", experience);
      formData.append("about", about);
      formData.append("cv", cvFile);

      const res = await fetch("/api/cv/register", { method: "POST", body: formData });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        cvFileName?: string;
        cvFilePath?: string;
      };

      if (!res.ok) {
        setSubmitError(data.error || "Kunde inte skicka CV just nu.");
        return;
      }

      const storedRaw = window.localStorage.getItem(CV_STORAGE_KEY);
      const stored = storedRaw ? (JSON.parse(storedRaw) as unknown) : [];
      const safeStored = Array.isArray(stored) ? stored : [];
      const newItem = {
        id: `cv-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        competence: desiredRole.trim() || "Ej angiven",
        cvFileName: data.cvFileName || cvFile.name,
        cvFilePath: data.cvFilePath || "",
        starred: false,
        createdAt: new Date().toISOString().slice(0, 10),
        status: "Ny" as const,
      };
      window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify([newItem, ...safeStored]));

      setOpen(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setDesiredRole("");
      setExperience("");
      setAbout("");
      setCvFile(null);
    } catch {
      setSubmitError("Kunde inte skicka. Kontrollera nätverket och försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-[640px] overflow-hidden rounded-[22px] bg-white shadow-[0_30px_80px_-24px_rgba(15,23,42,0.35)]"
          >
            {/* Modalhuvud: titel, beskrivning och stängknapp. */}
            <div className="flex items-start justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">
              <div>
                <h2 id={titleId} className="text-[1.65rem] font-semibold tracking-tight text-zinc-900">
                  Registrera ditt CV
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Lägg in dina uppgifter så kontaktar vi dig när vi har matchande tjänster.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                aria-label="Stäng"
              >
                ✕
              </button>
            </div>

            {/* Formulärdelen är scrollbar så knapparna kan ligga kvar i botten. */}
            <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto px-5 py-4 sm:px-6">
              <div className="space-y-3.5 pb-4">
                {submitError ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
                ) : null}

                <div>
                  <label className="mb-1 block text-[13px] font-medium text-zinc-900">Namn *</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-transparent bg-zinc-100 px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                    placeholder="För- och efternamn"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-zinc-900">E-post *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-transparent bg-zinc-100 px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                      placeholder="din.email@exempel.se"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-zinc-900">Telefon *</label>
                    <input
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 w-full rounded-xl border border-transparent bg-zinc-100 px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                      placeholder="+46 70 123 45 67"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-zinc-900">Plats</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-11 w-full rounded-xl border border-transparent bg-zinc-100 px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                    placeholder="Stockholm, Göteborg, etc."
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-zinc-900">Önskad roll *</label>
                    <select
                      required
                      value={desiredRole}
                      onChange={(e) => setDesiredRole(e.target.value)}
                      className="h-11 w-full rounded-xl border border-transparent bg-zinc-100 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                    >
                      <option value="">Välj rolltyp</option>
                      {roleOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-zinc-900">Erfarenhet (år)</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="h-11 w-full rounded-xl border border-transparent bg-zinc-100 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                    >
                      <option value="">Välj erfarenhetsnivå</option>
                      {experienceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-zinc-900">Ladda upp CV *</label>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center transition hover:bg-zinc-100">
                    <svg className="h-7 w-7 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4M4 16.5v1A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-1" />
                    </svg>
                    <p className="mt-3 text-sm text-zinc-700">Klicka för att ladda upp eller dra och släpp</p>
                    <p className="mt-1 text-xs text-zinc-500">PDF, DOC eller DOCX (max 5MB)</p>
                    {cvFile ? <p className="mt-2 text-xs font-medium text-zinc-700">{cvFile.name}</p> : null}
                    <input
                      required
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-zinc-900">Om dig själv</label>
                  <textarea
                    rows={3}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="min-h-[92px] w-full rounded-xl border border-transparent bg-zinc-100 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                    placeholder="Beskriv kort din bakgrund och vad du söker..."
                  />
                </div>
              </div>
              <div className="sticky bottom-0 -mx-5 border-t border-zinc-100 bg-white px-5 pt-3 sm:-mx-6 sm:px-6">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#080b22] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#13183b] disabled:opacity-60"
                  >
                    {isSubmitting ? "Skickar..." : "Skicka CV"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
