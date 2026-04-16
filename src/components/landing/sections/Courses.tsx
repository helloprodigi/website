import { HALL_OF_FAME_BY_YEAR, HALL_OF_FAME_YEARS } from "@/lib/hall-of-fame";

import Image from "next/image";
import Link from "next/link";
import SectionContainer from "@/components/landing/ui/SectionContainer";

export default function Courses() {
  const latestYear = HALL_OF_FAME_YEARS[0];
  const achievements = (HALL_OF_FAME_BY_YEAR[latestYear] ?? []).slice(0, 6);

  return (
    <section className="relative overflow-hidden pb-16 md:pb-20">
      <SectionContainer className="relative z-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-serif text-4xl text-[#1d1d1d]">Achievement</h3>
          <Link
            href="/hall-of-fame"
            className="rounded-sm bg-[#f7931d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d97f18]"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => (
            <article
              key={item.id}
              className="card-rise rounded-sm border border-black/10 bg-white p-3"
            >
              <div className="relative mb-3 aspect-16/10 overflow-hidden rounded-sm bg-[#eef2f2]">
                <Image
                  src={item.image}
                  alt={`${item.title} - ${item.competition}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#ffc91f]">
                {latestYear}
              </p>
              <h4 className="mt-2 font-serif text-2xl leading-tight text-[#1f1f1f]">
                {item.title}
              </h4>
              <p className="mt-1 text-sm text-black/70">{item.competition}</p>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
