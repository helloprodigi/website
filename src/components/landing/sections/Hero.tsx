"use client";

import {
  Calendar,
  Copyright,
  Flag2,
  Instagram,
  SearchNormal1,
  TagUser,
} from "iconsax-react";
import { heroActions, heroSlides } from "@/data/landing-content";
import { useEffect, useMemo, useState } from "react";

import { FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const iconMap = {
  Flag2,
  Instagram,
  Calendar,
  SearchNormal1,
  TagUser,
} as const;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(170);

  const heroHeight = useMemo(
    () => `calc(100vh - ${headerHeight}px)`,
    [headerHeight],
  );

  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement = document.getElementById("landing-header");
      setHeaderHeight(headerElement?.offsetHeight ?? 170);
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className="relative overflow-hidden border-b border-black/10 bg-[#efeeeb]"
      style={{ minHeight: heroHeight }}
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,244,241,0.90)_0%,rgba(245,244,241,0.78)_40%,rgba(245,244,241,0.45)_63%,rgba(245,244,241,0.05)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.35),transparent_38%)]" />

      <div
        className="relative z-10 mx-auto flex w-full max-w-[1480px] items-center px-5 py-12 md:px-8 lg:px-10"
        style={{ minHeight: heroHeight }}
      >
        <div className="max-w-[620px]">
          <h1 className="text-5xl leading-[1.5] tracking-tight text-[#191919] sm:text-6xl lg:text-[84px] font-bold">
            PRODIGI
          </h1>
          <h2 className="mb-4 text-sm font-medium tracking-[0.01em] text-[#3a3a3a] sm:text-base">
            PRODIGI is a community of competitive & innovative student in
            Faculty of Informatics, under Digital Talent Centre (DTC)
            Laboratory.
          </h2>

          <div className="mt-10 gap-2 grid max-w-[580px] grid-cols-2 overflow-hidden shadow-[0_16px_36px_rgba(12,16,28,0.08)]">
            {heroActions.map((action, index) => {
              const ActionIcon = iconMap[action.icon as keyof typeof iconMap];

              return (
                <Link
                  key={action.label}
                  type="button"
                  href={action.href}
                  className={`flex items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium transition sm:text-base ${
                    index === 0
                      ? "bg-[#ffc91f] text-black hover:bg-[#ffb901]"
                      : "bg-white text-[#171717] hover:bg-[#f6f6f6]"
                  } ${index % 2 === 0 ? "border-r border-black/10" : ""} ${index < 2 ? "border-b border-black/10" : ""}`}
                >
                  <ActionIcon size="18" color="currentColor" variant="Linear" />
                  <span className="flex-1">{action.label}</span>
                  {index == 0 && (
                    <FaExternalLinkAlt size="14" color="currentColor" />
                  )}
                </Link>
              );
            })}
          </div>

          <p className="mt-10 text-xs text-black/60">
            <span className="inline-flex items-center gap-1.5">
              <Copyright size="14" color="currentColor" variant="Linear" />S I N
              C E &nbsp; &nbsp;2 0 2 4
            </span>
          </p>
        </div>

        <div className="absolute bottom-6 right-5 z-20 flex items-center gap-2 md:bottom-8 md:right-8">
          {heroSlides.map((slide, index) => (
            <button
              key={`dot-${slide.src}`}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition cursor-pointer ${
                activeSlide === index ? "bg-white px-6" : "bg-white/55"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
