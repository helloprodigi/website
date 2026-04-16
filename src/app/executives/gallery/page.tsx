import {
  getExecutiveGalleryImages,
  getExecutiveGalleryYears,
} from "@/lib/executive-gallery";

import { ArrowRight2 } from "iconsax-react";
import ExecutiveGalleryClient from "@/components/executives/ExecutiveGalleryClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Executive Gallery | Prodigi",
  description: "Galeri dokumentasi kegiatan pengurus Prodigi.",
};

type ExecutiveGalleryPageProps = {
  searchParams: Promise<{
    year?: string;
  }>;
};

export default async function ExecutiveGalleryPage({
  searchParams,
}: ExecutiveGalleryPageProps) {
  const params = await searchParams;
  const years = getExecutiveGalleryYears();
  const hasYears = years.length > 0;
  const activeYear =
    params.year && years.includes(params.year) ? params.year : years[0];
  const images = activeYear ? getExecutiveGalleryImages(activeYear) : [];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
      <nav className="mb-5 flex items-center gap-2 text-sm text-black/50">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ArrowRight2 size="12" color="currentColor" variant="Linear" />
        <span className="text-black/70">Executive Gallery</span>
      </nav>

      <header className="mb-8">
        <h1 className="mt-2 text-5xl font-bold text-[#181818]">
          Executive Gallery
        </h1>
      </header>

      {hasYears ? (
        <section className="mb-6 flex flex-wrap gap-2">
          {years.map((year) => {
            const isActive = year === activeYear;

            return (
              <Link
                key={year}
                href={`/executives/gallery?year=${year}`}
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
        </section>
      ) : null}

      {images.length > 0 ? (
        <ExecutiveGalleryClient images={images} />
      ) : (
        <p className="rounded-sm border border-black/10 bg-white p-6 text-sm text-black/60">
          {hasYears
            ? "Belum ada foto galeri untuk tahun ini."
            : "Belum ada data galeri yang tersedia."}
        </p>
      )}
    </main>
  );
}
