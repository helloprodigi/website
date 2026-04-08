import { courseFilters, courses } from "@/data/landing-content";

import Image from "next/image";
import SectionContainer from "@/components/landing/ui/SectionContainer";

export default function Courses() {
  return (
    <section className="relative overflow-hidden pb-16 md:pb-20">
      <SectionContainer className="relative z-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-serif text-4xl text-[#1d1d1d]">
            Search for a course
          </h3>
          <button
            type="button"
            className="rounded-sm bg-[#f7931d] px-4 py-2 text-sm font-semibold text-white"
          >
            Find Course
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 text-sm">
          {courseFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className="rounded-sm border border-black/15 px-3 py-1.5 transition hover:bg-black hover:text-white"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <article
              key={course}
              className="card-rise rounded-sm border border-black/10 bg-white p-3"
            >
              <div className="relative mb-3 aspect-16/10 overflow-hidden rounded-sm bg-[#eef2f2]">
                <Image
                  src={`https://images.unsplash.com/photo-${index % 2 === 0 ? "1503676260728-1c00da094a0b" : "1523050854058-8df90110c9f1"}?auto=format&fit=crop&w=900&q=80`}
                  alt={course}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#ffc91f]">
                {index % 2 ? "Bachelor" : "Master"}
              </p>
              <h4 className="mt-2 font-serif text-2xl leading-tight text-[#1f1f1f]">
                {course}
              </h4>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
