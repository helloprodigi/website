import {
  EXECUTIVES_BY_YEAR,
  EXECUTIVE_YEARS,
  type ExecutiveMember,
  type ExecutiveYear,
} from "@/lib/executives";
import { ArrowRight2, SearchNormal1 } from "iconsax-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Executive Members | Prodigi",
  description: "Daftar pengurus Prodigi per tahun.",
};

type ExecutivesPageProps = {
  searchParams: Promise<{
    year?: string;
    q?: string;
  }>;
};

function normalizeUrl(url: string): string {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function isValidYear(year: string): year is ExecutiveYear {
  return EXECUTIVE_YEARS.includes(year as ExecutiveYear);
}

function matchesQuery(member: ExecutiveMember, query: string): boolean {
  if (!query) return true;

  const keyword = query.toLowerCase();
  const haystack = [
    member.name,
    member.position,
    member.nim,
    member.prodi,
    member.angkatan,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(keyword);
}

export default async function ExecutivesPage({
  searchParams,
}: ExecutivesPageProps) {
  const params = await searchParams;
  const activeYear = isValidYear(params.year ?? "")
    ? (params.year as ExecutiveYear)
    : EXECUTIVE_YEARS[0];
  const searchQuery = (params.q ?? "").trim();

  const members = EXECUTIVES_BY_YEAR[activeYear] ?? [];
  const filteredMembers = members.filter((member) =>
    matchesQuery(member, searchQuery),
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
      <nav className="mb-5 flex items-center gap-2 text-sm text-black/50">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ArrowRight2 size="12" color="currentColor" variant="Linear" />
        <span className="text-black/70">Executive Members</span>
      </nav>

      <header className="mb-8">
        <h1 className="mt-2 text-5xl font-bold text-[#181818]">
          Executive Members
        </h1>
      </header>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {EXECUTIVE_YEARS.map((year) => {
            const isActive = activeYear === year;
            const nextParams = new URLSearchParams();

            nextParams.set("year", year);
            if (searchQuery) {
              nextParams.set("q", searchQuery);
            }

            return (
              <Link
                key={year}
                href={`/executives/members?${nextParams.toString()}`}
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
          action="/executives/members"
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
            placeholder="Search executives..."
            className="w-full border-0 bg-transparent px-3 text-sm outline-none"
          />
        </form>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {filteredMembers.map((member) => (
          <article
            key={member.id}
            className="group overflow-hidden rounded-sm border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#ffc91f]/80 hover:shadow-[0_14px_36px_rgba(10,20,40,0.12)]"
          >
            <div className="relative aspect-square bg-[#f5f5f5]">
              <span className="absolute right-3 top-0 z-10 bg-[#ffc91f] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-black">
                {member.position}
              </span>
              <Image
                src={member.image}
                alt={member.name}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
              />
            </div>

            <div className="space-y-2 p-4">
              <h2 className="text-lg font-semibold leading-tight text-[#1c1c1c]">
                {member.name}
              </h2>
              <p className="text-sm text-black/70">NIM: {member.nim}</p>
              <p className="text-sm text-black/70">
                {member.prodi} ({member.angkatan})
              </p>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={normalizeUrl(member.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn ${member.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black/70 transition hover:border-[#ffb901] hover:text-[#ffb901]"
                >
                  <FaLinkedinIn size={14} />
                </a>
                <a
                  href={normalizeUrl(member.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${member.name}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black/70 transition hover:border-[#ffb901] hover:text-[#ffb901]"
                >
                  <FaInstagram size={14} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredMembers.length === 0 ? (
        <p className="mt-8 text-sm text-black/60">
          Tidak ada pengurus yang cocok dengan filter saat ini.
        </p>
      ) : null}
    </main>
  );
}
