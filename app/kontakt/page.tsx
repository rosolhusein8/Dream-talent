"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { type ContactFormErrors, validateContactForm } from "@/lib/contactValidation";

export default function KontaktPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitError(null);
    const nextErrors = validateContactForm(name, email, message);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setSubmitError(
          typeof data.error === "string" ? data.error : "Något gick fel. Försök igen."
        );
        return;
      }

      setShowSuccessPopup(true);
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch {
      setSubmitError("Kunde inte skicka. Kontrollera nätverket och försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearFieldError(field: keyof ContactFormErrors) {
    if (!errors[field]) return;
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  useEffect(() => {
    if (!showSuccessPopup) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuccessPopup(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuccessPopup]);

  return (
    <main className="min-h-screen bg-[url('/bild3.jpg')] bg-cover bg-center bg-no-repeat px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Kontakta oss</h1>
          <Link
            href="/"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100"
          >
            Stäng
          </Link>
        </div>
        <p className="mt-3 text-zinc-600">
          Skicka ett meddelande så återkommer vi så snart vi kan.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          {submitError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {submitError}
            </p>
          ) : null}

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-800">
              Namn
            </label>
            <input
              id="name"
              type="text"
              value={name}
              disabled={isSubmitting}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              className={`w-full rounded-lg border px-3 py-2.5 text-zinc-900 outline-none transition focus:border-zinc-500 disabled:opacity-60 ${
                errors.name ? "border-red-500" : "border-zinc-300"
              }`}
              placeholder="Ditt namn"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name ? (
              <p id="name-error" className="mt-1 text-xs text-red-600">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-800">
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled={isSubmitting}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              className={`w-full rounded-lg border px-3 py-2.5 text-zinc-900 outline-none transition focus:border-zinc-500 disabled:opacity-60 ${
                errors.email ? "border-red-500" : "border-zinc-300"
              }`}
              placeholder="du@epost.se"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email ? (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-zinc-800">
              Meddelande
            </label>
            <textarea
              id="message"
              rows={6}
              value={message}
              disabled={isSubmitting}
              onChange={(e) => {
                setMessage(e.target.value);
                clearFieldError("message");
              }}
              className={`w-full rounded-lg border px-3 py-2.5 text-zinc-900 outline-none transition focus:border-zinc-500 disabled:opacity-60 ${
                errors.message ? "border-red-500" : "border-zinc-300"
              }`}
              placeholder="Skriv ditt meddelande..."
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message ? (
              <p id="message-error" className="mt-1 text-xs text-red-600">
                {errors.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex rounded-lg bg-[#080b22] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#13183b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Skickar…" : "Skicka meddelande"}
          </button>
        </form>
      </div>

      {showSuccessPopup ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-4"
          onClick={() => setShowSuccessPopup(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-900">Tack för ditt meddelande!</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Vi har tagit emot din förfrågan och återkommer så snart vi kan.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccessPopup(false)}
              className="mt-5 inline-flex rounded-lg bg-[#080b22] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#13183b]"
            >
              Stäng
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
