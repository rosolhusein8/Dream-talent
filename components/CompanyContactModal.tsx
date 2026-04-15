"use client";

import {
  FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  type CompanyContactErrors,
  validateCompanyContact,
} from "@/lib/companyContactValidation";

const industryOptions: { value: string; label: string }[] = [
  { value: "", label: "Välj bransch" },
  { value: "it", label: "IT & teknik" },
  { value: "industri", label: "Industri & produktion" },
  { value: "handel", label: "Handel & service" },
  { value: "halsa", label: "Hälso- och sjukvård" },
  { value: "utbildning", label: "Utbildning" },
  { value: "offentlig", label: "Offentlig sektor" },
  { value: "bygg", label: "Bygg & anläggning" },
  { value: "ekonomi", label: "Ekonomi & juridik" },
  { value: "annat", label: "Annat" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CompanyContactModal({ open, onClose }: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [needs, setNeeds] = useState("");
  const [errors, setErrors] = useState<CompanyContactErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const next = validateCompanyContact(companyName, contactPerson, email, phone, needs);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "company",
          companyName: companyName.trim(),
          contactPerson: contactPerson.trim(),
          email: email.trim(),
          phone: phone.trim(),
          industry: industry.trim() || undefined,
          needs: needs.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        errors?: CompanyContactErrors;
      };
      if (!res.ok) {
        setSubmitError(
          typeof data.error === "string" ? data.error : "Något gick fel. Försök igen."
        );
        return;
      }
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setIndustry("");
      setNeeds("");
      setErrors({});
      onClose();
    } catch {
      setSubmitError("Kunde inte skicka. Kontrollera nätverket och försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearField(field: keyof CompanyContactErrors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
              Kontakta oss för rekryteringsbehov
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Berätta om dina rekryteringsbehov så återkommer vi med en skräddarsydd lösning.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-1 shrink-0 rounded-md p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Stäng"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {submitError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {submitError}
            </p>
          ) : null}

          <div>
            <label htmlFor="co-name" className="mb-1 block text-sm font-semibold text-zinc-900">
              Företagsnamn <span className="text-red-600">*</span>
            </label>
            <input
              id="co-name"
              type="text"
              value={companyName}
              disabled={isSubmitting}
              onChange={(e) => {
                setCompanyName(e.target.value);
                clearField("companyName");
              }}
              className={`w-full rounded-lg border bg-zinc-100 px-3 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white disabled:opacity-60 ${
                errors.companyName ? "border-red-500" : "border-zinc-200"
              }`}
              placeholder="Ditt företags namn"
              autoComplete="organization"
            />
            {errors.companyName ? (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="co-person" className="mb-1 block text-sm font-semibold text-zinc-900">
              Kontaktperson <span className="text-red-600">*</span>
            </label>
            <input
              id="co-person"
              type="text"
              value={contactPerson}
              disabled={isSubmitting}
              onChange={(e) => {
                setContactPerson(e.target.value);
                clearField("contactPerson");
              }}
              className={`w-full rounded-lg border bg-zinc-100 px-3 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white disabled:opacity-60 ${
                errors.contactPerson ? "border-red-500" : "border-zinc-200"
              }`}
              placeholder="För- och efternamn"
              autoComplete="name"
            />
            {errors.contactPerson ? (
              <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="co-email" className="mb-1 block text-sm font-semibold text-zinc-900">
                E-post <span className="text-red-600">*</span>
              </label>
              <input
                id="co-email"
                type="email"
                value={email}
                disabled={isSubmitting}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearField("email");
                }}
                className={`w-full rounded-lg border bg-zinc-100 px-3 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white disabled:opacity-60 ${
                  errors.email ? "border-red-500" : "border-zinc-200"
                }`}
                placeholder="foretagets.email@exempel.se"
                autoComplete="email"
              />
              {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
            </div>
            <div>
              <label htmlFor="co-phone" className="mb-1 block text-sm font-semibold text-zinc-900">
                Telefon <span className="text-red-600">*</span>
              </label>
              <input
                id="co-phone"
                type="tel"
                value={phone}
                disabled={isSubmitting}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearField("phone");
                }}
                className={`w-full rounded-lg border bg-zinc-100 px-3 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white disabled:opacity-60 ${
                  errors.phone ? "border-red-500" : "border-zinc-200"
                }`}
                placeholder="+46 8 123 456"
                autoComplete="tel"
              />
              {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
            </div>
          </div>

          <div>
            <label htmlFor="co-industry" className="mb-1 block text-sm font-semibold text-zinc-900">
              Bransch
            </label>
            <div className="relative">
              <select
                id="co-industry"
                value={industry}
                disabled={isSubmitting}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full appearance-none rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2.5 pr-10 text-zinc-900 outline-none transition focus:border-zinc-500 focus:bg-white disabled:opacity-60"
              >
                {industryOptions.map((o) => (
                  <option key={o.value || "placeholder"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="co-needs" className="mb-1 block text-sm font-semibold text-zinc-900">
              Beskriv era rekryteringsbehov <span className="text-red-600">*</span>
            </label>
            <textarea
              id="co-needs"
              rows={4}
              value={needs}
              disabled={isSubmitting}
              onChange={(e) => {
                setNeeds(e.target.value);
                clearField("needs");
              }}
              className={`w-full resize-y rounded-lg border bg-zinc-100 px-3 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white disabled:opacity-60 ${
                errors.needs ? "border-red-500" : "border-zinc-200"
              }`}
              placeholder="Berätta om vilka roller ni söker, antal personer, tidsplan och andra önskemål..."
            />
            {errors.needs ? <p className="mt-1 text-sm text-red-600">{errors.needs}</p> : null}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-60"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#080b22] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13183b] disabled:opacity-60"
            >
              {isSubmitting ? "Skickar…" : "Skicka förfrågan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
