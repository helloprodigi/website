import Image from "next/image";
import Link from "next/link";
import SectionContainer from "@/components/landing/ui/SectionContainer";

export default function PartnersSection() {
  const partners = [
    {
      name: "Bandung Techno Park",
      logo: "/images/partner/btp.png",
    },
    {
      name: "CIMB Niaga",
      logo: "/images/partner/cimb.png",
    },
  ];
  const marqueePartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="relative overflow-hidden bg-[#f6f6f6] py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,201,31,0.16),transparent_34%)]" />

      <SectionContainer className="relative z-10">
        <div className="text-center">
          <span className="text-xs px-3 py-2 font-semibold uppercase tracking-[0.12em] bg-[#ffc91f] text-black">
            PRODIGI PARTNERS
          </span>
          <h3 className="mt-3 font-serif font-bold text-5xl leading-tight text-[#1d1d1d] md:text-6xl">
            Help Us Build The Next Talent
          </h3>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-black/70 md:text-base">
            Partner with us through sponsorships, mentorship, and program
            collaboration, your organization can help accelerate real projects,
            competitions, and future-ready talent development.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact?type=partnership"
              className="rounded-sm bg-[#ffc91f] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#ffb901]"
            >
              Become a Partner
            </Link>
            <Link
              href="/contact?type=sponsorship"
              className="rounded-sm border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black/80 transition hover:border-[#ffb901] hover:text-black"
            >
              Sponsor Our Program
            </Link>
          </div>

          <div className="relative mt-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-linear-to-r from-[#f6f6f6] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-l from-[#f6f6f6] to-transparent" />

            <div className="partner-marquee-track flex w-max gap-4">
              {marqueePartners.map((partner, index) => (
                <article
                  key={`${partner.name}-${index}`}
                  className="flex h-24 w-44 shrink-0 items-center justify-center mx-3"
                >
                  <div className="relative h-14 w-full">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <p className="mt-7 text-sm text-black/60">
            We are open for strategic partnerships, sponsorship initiatives,
            mentorship tracks, and collaborative student programs.
          </p>
        </div>
      </SectionContainer>
    </section>
  );
}
