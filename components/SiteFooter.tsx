/*
 * Fil: components/SiteFooter.tsx
 * Syfte: Gemensam sidfot för hela webbplatsen.
 * Vad koden gör: Visar logotyp, snabblänkar, kontaktuppgifter och policy-rad.
 * Lär dig: Återanvänd den här komponenten från layout istället för att kopiera markup.
 * Felsökning: Om länkar ska ändras, uppdatera dem här så slår det igenom överallt.
 */
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-100 text-zinc-700">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Image
            src="/logo1.png"
            alt="Dream Talent"
            width={220}
            height={56}
            className="h-auto w-[110px] object-contain"
          />
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Din partner för hållbar och framgångsrik rekrytering. Vi kopplar samman drömmar med
            talanger.
          </p>
          <div className="mt-5 space-y-2.5 text-sm text-zinc-700">
            <p className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-zinc-500" />
              kontakt@dreamtalent.se
            </p>
            <p className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-zinc-500" />
              08-123 456 78
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-zinc-500" />
              Storgatan 12, 114 51 Stockholm
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">För jobbsökande</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/#jobbsokande" className="transition hover:text-zinc-900">
              För jobbsökande
            </Link>
            <Link href="/lediga-tjanster" className="transition hover:text-zinc-900">
              Lediga tjänster
            </Link>
            <Link href="/#jobbsokande" className="transition hover:text-zinc-900">
              Registrera CV
            </Link>
            <Link href="/#jobbsokande" className="transition hover:text-zinc-900">
              Bli konsult
            </Link>
            <Link href="/#jobbsokande" className="transition hover:text-zinc-900">
              Karriärcoaching
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">För företag</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/#foretag" className="transition hover:text-zinc-900">
              Våra tjänster
            </Link>
            <Link href="/#vara-tjanster" className="transition hover:text-zinc-900">
              Direktrekrytering
            </Link>
            <Link href="/#vara-tjanster" className="transition hover:text-zinc-900">
              Konsultuthyrning
            </Link>
            <Link href="/#vara-tjanster" className="transition hover:text-zinc-900">
              Rådgivning & Stöd
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900">Om Oss</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/#om-oss" className="transition hover:text-zinc-900">
              Om Dream Talent
            </Link>
            <Link href="/#vara-tjanster" className="transition hover:text-zinc-900">
              Hållbarhet
            </Link>
            <Link href="/kontakt" className="transition hover:text-zinc-900">
              Kontakt
            </Link>
            <Link href="/#jobbsokande" className="transition hover:text-zinc-900">
              Karriär hos oss
            </Link>
            <Link href="/admin/dashboard" className="text-zinc-500 transition hover:text-zinc-900">
              Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-xs text-zinc-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <a href="#" aria-label="LinkedIn" className="rounded-full border border-zinc-300 p-2 hover:bg-white">
              <span className="inline-block w-[14px] text-center text-[10px] font-semibold leading-[14px]">
                in
              </span>
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full border border-zinc-300 p-2 hover:bg-white">
              <span className="inline-block w-[14px] text-center text-[10px] font-semibold leading-[14px]">
                f
              </span>
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full border border-zinc-300 p-2 hover:bg-white">
              <span className="inline-block w-[14px] text-center text-[10px] font-semibold leading-[14px]">
                ig
              </span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span>Integritetspolicy</span>
            <span aria-hidden>•</span>
            <span>Användarvillkor</span>
            <span aria-hidden>•</span>
            <span>Cookie-policy</span>
          </div>

          <p>© {new Date().getFullYear()} Dream Talent. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
}
