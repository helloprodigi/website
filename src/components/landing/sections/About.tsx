import { ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import SectionContainer from "@/components/landing/ui/SectionContainer";
import { aboutLinks } from "@/data/landing-content";

export default function About() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0">
        <Image
          src="/images/slide1.jpg"
          alt="Campus facade"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1b1f]/70 via-[#1a1b1f]/30 to-transparent" />
      </div>

      <SectionContainer className="relative z-10 flex justify-end">
        <article className="max-w-[580px] border border-white/25 bg-white/10 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <h3 className="mb-4 font-serif font-bold text-4xl text-white">
            Departements
          </h3>
          <p className="mb-6 text-sm font-medium leading-7 text-white/80">
            PRODIGI is a leading community in School of Computing Telkom
            University, seeking academic excellence with competition values to
            develop skilled talents.
          </p>
          <div className="divide-y divide-white/20 border border-white/20 bg-white/5 text-white">
            {aboutLinks.map((item) => (
              <a
                href="#"
                key={item}
                className="flex items-center justify-between px-4 py-3 text-sm transition hover:bg-white/10"
              >
                {item}
                <ArrowRight2 size="14" color="currentColor" variant="Linear" />
              </a>
            ))}
          </div>
        </article>
      </SectionContainer>
    </section>
  );
}
