import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

import Image from "next/image";
import SectionContainer from "@/components/landing/ui/SectionContainer";
import { wayCards } from "@/data/landing-content";

export default function FindWay() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_16%,rgba(255,201,31,0.14),transparent_34%)]" />

      <SectionContainer className="relative z-10">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h3 className="font-serif text-4xl text-[#1c1c1c]">Find your way</h3>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-sm border border-black/20 px-3 py-1 text-sm hover:bg-black hover:text-white"
            >
              <ArrowLeft2 size="14" color="currentColor" variant="Linear" />
            </button>
            <button
              type="button"
              className="rounded-sm border border-black/20 px-3 py-1 text-sm hover:bg-black hover:text-white"
            >
              <ArrowRight2 size="14" color="currentColor" variant="Linear" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {wayCards.map((item, index) => (
            <article
              key={item}
              className={`card-rise rounded-sm border border-black/10 bg-white p-4 ${
                index === 2 ? "ring-2 ring-[#ffc91f]/70" : ""
              }`}
            >
              <div className="relative mb-4 aspect-4/3 overflow-hidden rounded-sm bg-[#e8ecef]">
                <Image
                  src={`https://images.unsplash.com/photo-${index % 2 === 0 ? "1547425260-76bcadfb4f2c" : "1500648767791-00dcc994a43e"}?auto=format&fit=crop&w=700&q=80`}
                  alt={item}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  className="object-cover"
                />
              </div>
              <p className="text-sm font-medium">{item}</p>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
