/*
 * Fil: app/page.tsx
 * Syfte: Startsidan (landing page) för Dream Talent.
 * Vad koden gör: Renderar hero, sektioner för jobbsökande/företag och modaler (footer i layout).
 * Lär dig: Följ data-arrayerna högst upp och se hur de mappas till UI-komponenter.
 * Felsökning: Kontrollera först imports, CTA-action-flöden och komponentprops.
 */
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BriefcaseBusiness,
  FileText,
  Leaf,
  MessageCircle,
  Search,
  UserRound,
} from "lucide-react";
import { ConsultApplyButton } from "@/components/ConsultApplyButton";
import { ForetagSection } from "@/components/ForetagSection";
import { RegisterCvButton } from "@/components/RegisterCvButton";

type JobSeekerIconName = "cv" | "coach" | "match" | "growth";
type ServiceIconName =
  | "direct"
  | "consult"
  | "staffing"
  | "executive"
  | "advisory"
  | "sustainable";

// Innehållsdata för korten på startsidan.
const jobSeekerCards: { icon: JobSeekerIconName; title: string; text: string }[] = [
  {
    icon: "cv",
    title: "CV-granskning",
    text: "Få professionell feedback på ditt CV för att sticka ut i mängden.",
  },
  {
    icon: "coach",
    title: "Karriärcoaching",
    text: "Personlig vägledning för att nå dina karriärmål och utvecklas professionellt.",
  },
  {
    icon: "match",
    title: "Matchningstjänst",
    text: "Vi matchar dig med rätt tjänster baserat på dina kompetenser och önskemål.",
  },
  {
    icon: "growth",
    title: "Kompetensutveckling",
    text: "Tillgång till kurser och utbildningar för att stärka din kompetens.",
  },
];

// CTA-korten styr både text, länk och om en modal ska öppnas.
const jobSeekerCtas: {
  icon: JobSeekerIconName;
  title: string;
  text: string;
  button: string;
  href: string;
  action?: "consult-modal" | "cv-modal";
}[] = [
  {
    icon: "cv",
    title: "Registrera ditt CV",
    text: "Lägg in ditt CV så kontaktar vi dig när vi har matchande tjänster",
    button: "Ladda upp CV",
    href: "#",
    action: "cv-modal",
  },
  {
    icon: "match",
    title: "Sök lediga tjänster",
    text: "Hitta och ansök till spännande tjänster hos våra partner",
    button: "Se lediga jobb",
    href: "/lediga-tjanster",
  },
  {
    icon: "coach",
    title: "Bli konsult",
    text: "Jobba flexibelt som konsult hos oss med spännande uppdrag",
    button: "Ansök som konsult",
    href: "/#kontakt",
    action: "consult-modal",
  },
];

function JobSeekerIcon({
  name,
  className = "h-6 w-6",
}: {
  name: JobSeekerIconName;
  className?: string;
}) {
  switch (name) {
    case "cv":
      return <FileText className={className} strokeWidth={2} aria-hidden />;
    case "coach":
      return <UserRound className={className} strokeWidth={2} aria-hidden />;
    case "match":
      return <BriefcaseBusiness className={className} strokeWidth={2} aria-hidden />;
    case "growth":
      return <Award className={className} strokeWidth={2} aria-hidden />;
    default: {
      const _never: never = name;
      return _never;
    }
  }
}

function ServiceIcon({ name }: { name: ServiceIconName }) {
  const className = "h-5 w-5 text-zinc-900";

  switch (name) {
    case "direct":
      return <BriefcaseBusiness className={className} strokeWidth={2} aria-hidden />;
    case "consult":
      return <UserRound className={className} strokeWidth={2} aria-hidden />;
    case "staffing":
      return <FileText className={className} strokeWidth={2} aria-hidden />;
    case "executive":
      return <Search className={className} strokeWidth={2} aria-hidden />;
    case "advisory":
      return <MessageCircle className={className} strokeWidth={2} aria-hidden />;
    case "sustainable":
      return <Leaf className={className} strokeWidth={2} aria-hidden />;
    default: {
      const _never: never = name;
      return _never;
    }
  }
}

const services: { icon: ServiceIconName; title: string; text: string }[] = [
  {
    icon: "direct",
    title: "Direktrekrytering",
    text: "Vi hjälper er att hitta och anställa rätt kandidat för permanenta tjänster med gedigen screening och matchning.",
  },
  {
    icon: "consult",
    title: "Konsultuthyrning",
    text: "Snabb tillgång till kompetenta konsulter för era projekt och tillfälliga behov.",
  },
  {
    icon: "staffing",
    title: "Bemanningslösningar",
    text: "Flexibla bemanningslösningar anpassade efter era specifika behov och säsongsvariationer.",
  },
  {
    icon: "executive",
    title: "Executive Search",
    text: "Specialiserad rekrytering av ledare och nyckelpositioner med diskret och professionell hantering.",
  },
  {
    icon: "advisory",
    title: "Rådgivning & stöd",
    text: "Expertis inom rekryteringsprocess, employer branding och lönestrukturer.",
  },
  {
    icon: "sustainable",
    title: "Hållbar rekrytering",
    text: "Fokus på mångfald, inkludering och hållbara arbetsvillkor i varje rekrytering.",
  },
];

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero: första intrycket med huvudbudskap och primära knappar. */}
      <section className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Personer i ett möte om rekrytering"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center px-6 py-16 text-center">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Vi kopplar samman drömmar med talanger
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-100 sm:text-lg md:text-xl">
              Din partner för hållbar och framgångsrik rekrytering
            </p>

            <div className="mt-24 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/#jobbsokande"
                className="inline-flex min-w-[180px] items-center justify-center rounded-md bg-[#080b22] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111735]"
              >
                För jobbsökande
              </Link>
              <Link
                href="/#foretag"
                className="inline-flex min-w-[180px] items-center justify-center rounded-md border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                För företag
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* För jobbsökande: informationskort och CTA-flöden. */}
      <section
        id="jobbsokande"
        className="scroll-mt-24 border-b border-zinc-200 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              För jobbsökande
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
              Vi hjälper dig att hitta din drömkarriär och utvecklas professionellt
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {jobSeekerCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                  <JobSeekerIcon name={card.icon} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {jobSeekerCtas.map((cta) => (
              <div
                key={cta.title}
                className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50/60 p-6"
              >
                <div className="mb-4 text-zinc-900">
                  <JobSeekerIcon name={cta.icon} className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">{cta.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">
                  {cta.text}
                </p>
                {cta.action === "consult-modal" ? (
                  <ConsultApplyButton
                    label={cta.button}
                    className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#080b22] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13183b]"
                  />
                ) : cta.action === "cv-modal" ? (
                  <RegisterCvButton
                    label={cta.button}
                    className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#080b22] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13183b]"
                  />
                ) : (
                  <Link
                    href={cta.href}
                    className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#080b22] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13183b]"
                  >
                    {cta.button}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/5 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/bild1.jpg"
              alt="Professionellt möte i arbetsmiljö"
              width={1200}
              height={800}
              className="h-[260px] w-full object-cover sm:h-[320px]"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-black/10" />
            <div className="absolute inset-0 flex items-end p-5 sm:p-7">
              <p className="max-w-sm text-lg font-semibold leading-tight text-white sm:text-2xl">
                Vi ser potentialen bakom varje CV
              </p>
            </div>
          </div>
        </div>
      </section>

      <ForetagSection />

      {/* Våra tjänster: översikt av erbjudandet till företag. */}
      <section
        id="vara-tjanster"
        className="scroll-mt-24 border-b border-zinc-200 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Våra tjänster
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
              Skräddarsydda rekryteringslösningar för alla era behov
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                  <ServiceIcon name={s.icon} />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Om oss: personlig sektion om Sara och Dream Talent. */}
      <section
        id="om-oss"
        className="scroll-mt-24 border-b border-black/5 bg-gradient-to-b from-zinc-50 via-white to-zinc-100 py-16 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Om Dream Talent
            </h2>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#132452] via-[#1a2f66] to-[#223a78] p-8 shadow-[0_28px_64px_-18px_rgba(8,11,34,0.55)] ring-1 ring-white/5 sm:mt-14 sm:p-10 md:p-12 lg:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_20%,rgba(255,255,255,0.09),transparent_55%)]"
            />
            <div className="relative grid gap-12 md:grid-cols-[minmax(0,17rem)_1fr] md:items-start md:gap-14 lg:gap-16">
              <div className="flex justify-center md:justify-start md:pt-1">
                <div className="group relative">
                  <div
                    aria-hidden
                    className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/35 to-white/5 opacity-90 blur-sm transition group-hover:opacity-100"
                  />
                  <div className="relative h-52 w-52 overflow-hidden rounded-full shadow-[0_0_40px_rgba(255,255,255,0.15)] ring-[3px] ring-white/90 sm:h-[17rem] sm:w-[17rem]">
                    <Image
                      src="/saraSellerfors.jpg"
                      alt="Sara Sellerfors"
                      width={272}
                      height={272}
                      className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(min-width: 768px) 272px, 208px"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="min-w-0 max-w-prose text-left md:max-w-none">
                <h3 className="text-[1.35rem] font-semibold leading-snug tracking-tight text-white sm:text-2xl sm:leading-snug">
                  Sara Sellerfors – expert inom social hållbarhet och rekrytering
                </h3>
                <p className="mt-6 text-[15px] leading-[1.75] text-slate-200/95 sm:text-base">
                  DreamTalent drivs av Sara Sellerfors som har över 25 års erfarenhet inom social
                  hållbarhet och rekrytering. Hon har under sin karriär arbetat som chef och ledare
                  både inom offentlig sektor och näringslivet. Hennes arbetssätt har alltid varit
                  starkt präglat av affärsfokus och ett stort engagemang för människor – särskilt för
                  att ge dem som inte alltid passar in i den traditionella mallen en chans på
                  arbetsmarknaden.
                </p>
                <p className="mt-5 text-[15px] leading-[1.75] text-slate-200/95 sm:text-base">
                  Sara har tidigare varit VD för IKEAs första sociala företag och har lett
                  banbrytande initiativ där affärsnytta kombineras med samhällsansvar. Med djup
                  förståelse för både rekrytering, social hållbarhet och ledarskap hjälper hon idag
                  arbetsgivare att bygga inkluderande och hållbara team.
                </p>
                <blockquote className="mt-8 border-l-[3px] border-amber-300/90 pl-5 text-[15px] font-medium leading-[1.75] text-white sm:text-base">
                  Hon brinner för att skapa arbetsplatser där människor får växa – även de som inte
                  alltid passar in i den traditionella normen.
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt: sista CTA innan den gemensamma footern (layout). */}
      <section
        id="kontakt"
        className="scroll-mt-24 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Kontakt
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Vill du veta mer? Hör av dig så återkommer vi.
          </p>
          <Link
            href="/kontakt"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#080b22] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13183b]"
          >
            Gå till kontaktformulär
          </Link>
        </div>
      </section>
    </main>
  );
}
