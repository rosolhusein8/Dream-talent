import Image from "next/image";
import Link from "next/link";
import { ForetagSection } from "@/components/ForetagSection";

{/* Data for the homepage. In a real app this would likely come from a CMS or API, but hardcoded for now. */}
const jobSeekerCards = [
  {
    title: "CV-granskning",
    text: "Få professionell feedback på ditt CV för att sticka ut i mängden.",
  },
  {
    title: "Karriärcoaching",
    text: "Personlig vägledning för att nå dina karriärmål och utvecklas professionellt.",
  },
  {
    title: "Matchningstjänst",
    text: "Vi matchar dig med rätt tjänster baserat på dina kompetenser och önskemål.",
  },
  {
    title: "Kompetensutveckling",
    text: "Tillgång till kurser och utbildningar för att stärka din kompetens.",
  },
];
{/* CTA-sektionerna för jobbsökande. */}
const jobSeekerCtas = [
  {
    title: "Registrera ditt CV",
    text: "Lägg in ditt CV så kontaktar vi dig när vi har matchande tjänster",
    button: "Ladda upp CV",
    href: "/#kontakt",
  },
  {
    title: "Sök lediga tjänster",
    text: "Hitta och ansök till spännande tjänster hos våra partner",
    button: "Se lediga jobb",
    href: "/lediga-tjanster",
  },
  {
    title: "Bli konsult",
    text: "Jobba flexibelt som konsult hos oss med spännande uppdrag",
    button: "Ansök som konsult",
    href: "/#kontakt",
  },
];

const services = [
  {
    title: "Direktrekrytering",
    text: "Vi hjälper er att hitta och anställa rätt kandidat för permanenta tjänster med gedigen screening och matchning.",
  },
  {
    title: "Konsultuthyrning",
    text: "Snabb tillgång till kompetenta konsulter för era projekt och tillfälliga behov.",
  },
  {
    title: "Bemanningslösningar",
    text: "Flexibla bemanningslösningar anpassade efter era specifika behov och säsongsvariationer.",
  },
  {
    title: "Executive Search",
    text: "Specialiserad rekrytering av ledare och nyckelpositioner med diskret och professionell hantering.",
  },
  {
    title: "Rådgivning & stöd",
    text: "Expertis inom rekryteringsprocess, employer branding och lönestrukturer.",
  },
  {
    title: "Hållbar rekrytering",
    text: "Fokus på mångfald, inkludering och hållbara arbetsvillkor i varje rekrytering.",
  },
];

export default function Home() {
  return (
    <main className="w-full">
      <section className="relative min-h-[78vh] w-full overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Personer i ett möte om rekrytering"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl items-center justify-center px-6 py-16 text-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Vi kopplar samman drömmar med talanger
            </h1>
            <p className="mt-5 text-base text-zinc-100 sm:text-lg md:text-xl">
              Din partner för hållbar och framgångsrik rekrytering
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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

      <section
        id="jobbsokande"
        className="scroll-mt-24 border-b border-zinc-200 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
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
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
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
                <h3 className="text-lg font-semibold text-zinc-900">{cta.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">
                  {cta.text}
                </p>
                <Link
                  href={cta.href}
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-[#080b22] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#13183b]"
                >
                  {cta.button}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ForetagSection />

      <section
        id="vara-tjanster"
        className="scroll-mt-24 border-b border-zinc-200 bg-zinc-50 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Våra tjänster</h2>
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
                <h3 className="text-lg font-semibold text-zinc-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="om-oss"
        className="scroll-mt-24 border-b border-black/5 bg-gradient-to-b from-[#b9c9ba] via-[#b0c4b1] to-[#a5b6a6] py-16 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Om oss
            </h2>
          </div>

          <div className="mt-12 rounded-[2rem] border border-white/50 bg-[#f2f6f4]/95 p-8 shadow-[0_28px_60px_-20px_rgba(15,23,42,0.22)] backdrop-blur-[2px] sm:mt-14 sm:p-10 md:p-12 lg:p-14">
            <div className="grid gap-12 md:grid-cols-[minmax(0,17rem)_1fr] md:items-start md:gap-14 lg:gap-16">
              <div className="flex justify-center md:justify-start md:pt-1">
                <div className="group relative">
                  <div
                    aria-hidden
                    className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/80 to-white/20 opacity-80 blur-sm transition group-hover:opacity-100"
                  />
                  <div className="relative h-52 w-52 overflow-hidden rounded-full shadow-[0_24px_48px_-16px_rgba(15,23,42,0.35)] ring-[3px] ring-white sm:h-[17rem] sm:w-[17rem]">
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
                <h3 className="text-[1.35rem] font-semibold leading-snug tracking-tight text-zinc-950 sm:text-2xl sm:leading-snug">
                  Sara Sellerfors – expert inom social hållbarhet och rekrytering
                </h3>
                <p className="mt-6 text-[15px] leading-[1.75] text-zinc-600 sm:text-base">
                  DreamTalent drivs av Sara Sellerfors som har över 25 års erfarenhet inom social
                  hållbarhet och rekrytering. Hon har under sin karriär arbetat som chef och ledare
                  både inom offentlig sektor och näringslivet. Hennes arbetssätt har alltid varit
                  starkt präglat av affärsfokus och ett stort engagemang för människor – särskilt för
                  att ge dem som inte alltid passar in i den traditionella mallen en chans på
                  arbetsmarknaden.
                </p>
                <p className="mt-5 text-[15px] leading-[1.75] text-zinc-600 sm:text-base">
                  Sara har tidigare varit VD för IKEAs första sociala företag och har lett
                  banbrytande initiativ där affärsnytta kombineras med samhällsansvar. Med djup
                  förståelse för både rekrytering, social hållbarhet och ledarskap hjälper hon idag
                  arbetsgivare att bygga inkluderande och hållbara team.
                </p>
                <blockquote className="mt-8 border-l-[3px] border-[#080b22] pl-5 text-[15px] font-medium leading-[1.75] text-zinc-900 sm:text-base">
                  Hon brinner för att skapa arbetsplatser där människor får växa – även de som inte
                  alltid passar in i den traditionella normen.
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="kontakt"
        className="scroll-mt-24 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Kontakt</h2>
          <p className="mt-4 text-lg text-zinc-600">
            Vill du veta mer? Hör av dig så återkommer vi.
          </p>
          <Link
            href="/kontakt"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-[#080b22] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#13183b]"
          >
            Gå till kontaktformulär
          </Link>
        </div>
      </section>
    </main>
  );
}
