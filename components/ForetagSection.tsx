/*
 * Fil: components/ForetagSection.tsx
 * Syfte: Sektionen "För företag" på startsidan.
 * Vad koden gör: Visar innehåll för företag och öppnar kontaktmodalen vid behov.
 * Lär dig: Bra exempel på hur en sektion kan hållas separat från startsidan.
 * Felsökning: Kontrollera props, modal-state och bild-/textinnehåll här först.
 */
"use client";

import Image from "next/image";
import { useState } from "react";
import { CompanyContactModal } from "@/components/CompanyContactModal";
import { CompanyFeatureIcon } from "@/components/CompanyFeatureIcon";
import { companyFeatures } from "@/lib/companyFeatures";

export function ForetagSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        id="foretag"
        className="scroll-mt-24 border-b border-zinc-200 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              För företag
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
              Vi hjälper er att hitta rätt talanger för er organisation
            </p>
          </div>

          <div className="mt-12 grid items-stretch gap-10 lg:grid-cols-2">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[340px] lg:min-h-full">
              <Image
                src="/bild2.jpg"
                alt="Möte i professionell miljö"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-zinc-900">
                Varför välja Dream Talent?
              </h3>
              <ul className="mt-6 space-y-4">
                {companyFeatures.map((f) => (
                  <li key={f.text} className="flex gap-4">
                    <CompanyFeatureIcon name={f.icon} />
                    <p className="text-base leading-relaxed text-zinc-800">{f.text}</p>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-8 inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-[#080b22] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13183b] sm:w-auto"
              >
                Kontakta oss
              </button>
            </div>
          </div>
        </div>
      </section>

      <CompanyContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
