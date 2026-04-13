import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Lediga tjänster</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        Här listar du kommande annonser. Koppla senare till databas eller CMS.
      </p>

      <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-600">Inga annonser publicerade ännu.</p>
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
      >
        ← Tillbaka till startsidan
      </Link>
    </main>
  );
}
