import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900">Kontakt</h1>
      <p className="mt-4 text-zinc-600">
        Här kan du lägga kontaktformulär och uppgifter. Under tiden kan du gå tillbaka till
        startsidan.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-[#080b22] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#13183b]"
      >
        Till startsidan
      </Link>
    </main>
  );
}
