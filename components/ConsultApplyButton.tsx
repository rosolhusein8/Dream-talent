/*
 * Fil: components/ConsultApplyButton.tsx
 * Syfte: Modal för "Ansök som konsult".
 * Vad koden gör: Hanterar formulär, klientvalidering och POST till kontakt-API.
 * Lär dig: Jämför validate() och handleSubmit() för att förstå validering + submit.
 * Felsökning: Kontrollera errors-state, submitError och API-svar från /api/contact.
 */
"use client";

import { FormEvent, useEffect, useId, useState } from "react";

type Props = {
  className: string;
  label: string;
};

export function ConsultApplyButton({ className, label }: Props) {
  // Form-state för konsultansökan.
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    coverLetter?: string;
  }>({});

  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Enkel klientvalidering innan vi skickar något till API:t.
  function validate() {
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = "Ange ditt namn.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Ange en giltig e-postadress.";
    }
    if (phone.replace(/\D/g, "").length < 8) {
      nextErrors.phone = "Ange ett giltigt telefonnummer.";
    }
    if (coverLetter.trim().length < 10) {
      nextErrors.coverLetter = "Skriv minst 10 tecken i personligt brev.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const message = [
        "Ansökan: Bli konsult",
        `Telefon: ${phone.trim()}`,
        "",
        "Personligt brev:",
        coverLetter.trim(),
      ].join("\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitError(
          typeof data.error === "string" ? data.error : "Något gick fel. Försök igen."
        );
        return;
      }

      setOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setCoverLetter("");
      setErrors({});
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
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[640px] overflow-hidden rounded-[22px] bg-white shadow-[0_30px_80px_-24px_rgba(15,23,42,0.35)]"
          >
            {/* Modalhuvud: förklarar snabbt vad användaren gör här. */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4 sm:px-6">
              <div>
                <h2 id={titleId} className="text-[1.65rem] font-semibold tracking-tight text-zinc-900">
                  Ansök till Bli konsult
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Fyll i dina uppgifter så återkommer vi till dig så snart som möjligt.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-md p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                aria-label="Stäng"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollbar formulärdel med sticky knappsektion längst ned. */}
            <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto px-5 py-4 sm:px-6" noValidate>
              <div className="space-y-3.5 pb-4">
                {submitError ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <div>
                  <label htmlFor="consult-name" className="mb-1 block text-[13px] font-medium text-zinc-900">
                    Namn <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="consult-name"
                    type="text"
                    value={name}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={`h-11 w-full rounded-xl border px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 ${
                      errors.name
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-transparent bg-zinc-100 focus:border-zinc-300"
                    }`}
                    placeholder="Ditt fullständiga namn"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="consult-email" className="mb-1 block text-[13px] font-medium text-zinc-900">
                    E-post <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="consult-email"
                    type="email"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`h-11 w-full rounded-xl border px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 ${
                      errors.email
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-transparent bg-zinc-100 focus:border-zinc-300"
                    }`}
                    placeholder="din.email@exempel.se"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="consult-phone" className="mb-1 block text-[13px] font-medium text-zinc-900">
                    Telefon <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="consult-phone"
                    type="tel"
                    value={phone}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={`h-11 w-full rounded-xl border px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 ${
                      errors.phone
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-transparent bg-zinc-100 focus:border-zinc-300"
                    }`}
                    placeholder="+46 70 123 45 67"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label
                    htmlFor="consult-letter"
                    className="mb-1 block text-[13px] font-medium text-zinc-900"
                  >
                    Personligt brev <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="consult-letter"
                    rows={4}
                    value={coverLetter}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setCoverLetter(e.target.value);
                      setErrors((prev) => ({ ...prev, coverLetter: undefined }));
                    }}
                    className={`min-h-[120px] w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 ${
                      errors.coverLetter
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-transparent bg-zinc-100 focus:border-zinc-300"
                    }`}
                    placeholder="Berätta lite om dig själv och varför du vill jobba hos oss..."
                  />
                </div>

                <div className="sticky bottom-0 -mx-5 border-t border-zinc-100 bg-white px-5 pt-3 sm:-mx-6 sm:px-6">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      disabled={isSubmitting}
                      className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-60"
                    >
                      Avbryt
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#080b22] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#13183b] disabled:opacity-60"
                    >
                      {isSubmitting ? "Skickar..." : "Skicka ansökan"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
