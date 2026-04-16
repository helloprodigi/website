"use client";

import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useEffect, useState } from "react";

import Image from "next/image";
import SectionContainer from "@/components/landing/ui/SectionContainer";
import { leadMessages } from "@/data/landing-content";

export default function FindWay() {
  const [activeSlide, setActiveSlide] = useState(0);
  const hasLeadMessages = leadMessages.length > 0;

  useEffect(() => {
    if (leadMessages.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % leadMessages.length);
    }, 4500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const goPrev = () => {
    setActiveSlide(
      (prev) => (prev - 1 + leadMessages.length) % leadMessages.length,
    );
  };

  const goNext = () => {
    setActiveSlide((prev) => (prev + 1) % leadMessages.length);
  };

  return hasLeadMessages ? (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_16%,rgba(255,201,31,0.14),transparent_34%)]" />

      <SectionContainer className="relative z-10">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h3 className="font-serif text-4xl text-[#1c1c1c]">Leaders Board</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous lead message"
              className="rounded-sm border border-black/20 px-3 py-1 text-sm hover:bg-black hover:text-white"
            >
              <ArrowLeft2 size="14" color="currentColor" variant="Linear" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next lead message"
              className="rounded-sm border border-black/20 px-3 py-1 text-sm hover:bg-black hover:text-white"
            >
              <ArrowRight2 size="14" color="currentColor" variant="Linear" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {leadMessages.map((lead) => (
              <article
                key={`${lead.name}-${lead.label}`}
                className="card-rise min-w-full rounded-sm border border-black/10 bg-white p-4 sm:p-5"
              >
                <div className="grid grid-cols-[96px_1fr] items-center gap-4 sm:grid-cols-[140px_1fr] sm:gap-5">
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-[#e8ecef]">
                    <Image
                      src={
                        lead.photo
                          ? lead.photo
                          : "/images/profile-placeholder.webp"
                      }
                      alt={lead.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 96px, 140px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-h-full flex-col justify-center gap-3">
                    <p className="text-sm lg:text-xl leading-relaxed text-black/80 sm:text-base">
                      {lead.quote}
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-[#1c1c1c] sm:text-base">
                        {lead.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.08em] text-black/50 sm:text-sm">
                        {lead.label}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {leadMessages.map((lead, index) => (
            <button
              key={`${lead.name}-dot`}
              type="button"
              aria-label={`Go to lead message ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition ${
                activeSlide === index ? "w-8 bg-[#ffb901]" : "w-2 bg-black/25"
              }`}
            />
          ))}
        </div>
      </SectionContainer>
    </section>
  ) : null;
}
