import {
  HALL_OF_FAME_BY_YEAR,
  HALL_OF_FAME_YEARS,
  type HallOfFameEntry,
  type HallOfFameYear,
} from "@/lib/hall-of-fame";
import { ArrowRight2, SearchNormal1 } from "iconsax-react";

import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Hall of Fame | Prodigi",
  description: "Daftar pencapaian prestasi Prodigi per tahun.",
};

type HallOfFamePageProps = {
  searchParams: Promise<{
    year?: string;
    q?: string;
  }>;
};

function isValidYear(year: string): year is HallOfFameYear {
  return HALL_OF_FAME_YEARS.includes(year as HallOfFameYear);
}

function matchesQuery(entry: HallOfFameEntry, query: string): boolean {
  if (!query) return true;

  const keyword = query.toLowerCase();
  const haystack = [entry.title, entry.competition].join(" ").toLowerCase();

  return haystack.includes(keyword);
}

export default async function HallOfFamePage({
  searchParams,
}: HallOfFamePageProps) {
  const params = await searchParams;
  const activeYear = isValidYear(params.year ?? "")
    ? (params.year as HallOfFameYear)
    : HALL_OF_FAME_YEARS[0];
  const searchQuery = (params.q ?? "").trim();

  const entries = HALL_OF_FAME_BY_YEAR[activeYear] ?? [];
  const filteredEntries = entries.filter((entry) =>
    matchesQuery(entry, searchQuery),
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
      <nav className="mb-5 flex items-center gap-2 text-sm text-black/50">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ArrowRight2 size="12" color="currentColor" variant="Linear" />
        <span className="text-black/70">Hall of Fame</span>
      </nav>

      <header className="mb-8">
        <h1 className="mt-2 text-5xl font-bold text-[#181818]">Hall of Fame</h1>
        <p className="mt-3 max-w-2xl text-sm text-black/65">
          Kumpulan pencapaian tim Prodigi dari berbagai kompetisi inovasi, data,
          dan teknologi.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {HALL_OF_FAME_YEARS.map((year) => {
            const isActive = activeYear === year;
            const nextParams = new URLSearchParams();

            nextParams.set("year", year);
            if (searchQuery) {
              nextParams.set("q", searchQuery);
            }

            return (
              <Link
                key={year}
                href={`/hall-of-fame?${nextParams.toString()}`}
                className={`rounded-sm border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-[#ffc91f] bg-[#ffc91f] text-black hover:bg-[#ffb901]"
                    : "border-black/15 bg-white text-black/70 hover:text-black"
                }`}
              >
                {year}
              </Link>
            );
          })}
        </div>

        <form
          action="/hall-of-fame"
          method="get"
          className="flex w-full max-w-sm items-center border border-black/15 bg-white px-3 py-2"
        >
          <input type="hidden" name="year" value={activeYear} />
          <SearchNormal1
            size="16"
            color="currentColor"
            variant="Linear"
            className="text-black/50"
          />
          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder="Cari title atau lomba..."
            className="w-full border-0 bg-transparent px-3 text-sm outline-none"
          />
        </form>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.map((entry) => (
          <article
            key={entry.id}
            className="group overflow-hidden rounded-sm border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#ffc91f]/80 hover:shadow-[0_14px_36px_rgba(10,20,40,0.12)]"
          >
            <div className="relative aspect-16/10 bg-[#f5f5f5]">
              <Image
                src={entry.image}
                alt={`${entry.title} - ${entry.competition}`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
              />
            </div>

            <div className="space-y-1 border-t border-[#ffc91f] p-4">
              <h2 className="text-3xl font-semibold leading-tight text-[#121212]">
                {entry.title}
              </h2>
              <p className="text-base leading-snug text-black/80">
                {entry.competition}
              </p>
            </div>
          </article>
        ))}
      </div>

      {filteredEntries.length === 0 ? (
        <p className="mt-8 text-sm text-black/60">
          Tidak ada pencapaian yang cocok dengan filter saat ini.
        </p>
      ) : null}
    </main>
  );
}
