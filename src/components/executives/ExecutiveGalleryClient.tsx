"use client";

import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { FaSearchPlus } from "react-icons/fa";
import Image from "next/image";
import { createPortal } from "react-dom";

type ExecutiveGalleryClientProps = {
  images: string[];
};

export default function ExecutiveGalleryClient({
  images,
}: ExecutiveGalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const hasImages = images.length > 0;

  const activeImage = useMemo(
    () => (hasImages ? images[activeIndex] : "/images/slide1.jpg"),
    [activeIndex, hasImages, images],
  );
  const portalTarget = typeof window !== "undefined" ? document.body : null;

  useEffect(() => {
    if (!hasImages || images.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [hasImages, images.length]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const scrollList = (direction: "left" | "right" | "up" | "down") => {
    const listElement = listRef.current;
    if (!listElement) {
      return;
    }

    if (direction === "left") {
      listElement.scrollBy({ left: -220, behavior: "smooth" });
      return;
    }

    if (direction === "right") {
      listElement.scrollBy({ left: 220, behavior: "smooth" });
      return;
    }

    if (direction === "up") {
      listElement.scrollBy({ top: -180, behavior: "smooth" });
      return;
    }

    listElement.scrollBy({ top: 180, behavior: "smooth" });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsZoomOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.touchAction = previousBodyTouchAction;
    };
  }, [isZoomOpen]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.65fr_0.55fr]">
      <section className="relative overflow-hidden rounded-sm border border-black/10 bg-white">
        <button
          type="button"
          className="group relative block w-full text-left"
          onClick={() => setIsZoomOpen(true)}
          aria-label="Zoom preview image"
        >
          <div className="relative aspect-video w-full">
            <Image
              src={activeImage}
              alt="Executive gallery preview"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
            <span className="absolute right-3 top-3 inline-flex items-center justify-center bg-white/90 p-2 text-black opacity-0 transition group-hover:opacity-100">
              <FaSearchPlus size={14} />
            </span>
          </div>
        </button>

        {hasImages && images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous gallery image"
              className="absolute left-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center bg-white/90 p-2 text-black transition hover:bg-[#ffc91f]"
            >
              <ArrowLeft2 size="18" color="currentColor" variant="Linear" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next gallery image"
              className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center bg-white/90 p-2 text-black transition hover:bg-[#ffc91f]"
            >
              <ArrowRight2 size="18" color="currentColor" variant="Linear" />
            </button>
          </>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-sm border border-black/10 bg-white p-3">
        <div className="mb-2 flex items-center justify-between lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/50">
            Photo List
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollList("left")}
              aria-label="Scroll photo list left"
              className="inline-flex items-center justify-center border border-black/15 p-1.5 text-black/70 transition hover:border-[#ffc91f] hover:text-black"
            >
              <ArrowLeft2 size="14" color="currentColor" variant="Linear" />
            </button>
            <button
              type="button"
              onClick={() => scrollList("right")}
              aria-label="Scroll photo list right"
              className="inline-flex items-center justify-center border border-black/15 p-1.5 text-black/70 transition hover:border-[#ffc91f] hover:text-black"
            >
              <ArrowRight2 size="14" color="currentColor" variant="Linear" />
            </button>
          </div>
        </div>

        <div className="mb-2 hidden items-center justify-between lg:flex">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/50">
            Photo List
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollList("up")}
              aria-label="Scroll photo list up"
              className="inline-flex items-center justify-center border border-black/15 p-1.5 text-black/70 transition hover:border-[#ffc91f] hover:text-black"
            >
              <ArrowLeft2
                size="14"
                color="currentColor"
                variant="Linear"
                className="rotate-90"
              />
            </button>
            <button
              type="button"
              onClick={() => scrollList("down")}
              aria-label="Scroll photo list down"
              className="inline-flex items-center justify-center border border-black/15 p-1.5 text-black/70 transition hover:border-[#ffc91f] hover:text-black"
            >
              <ArrowRight2
                size="14"
                color="currentColor"
                variant="Linear"
                className="rotate-90"
              />
            </button>
          </div>
        </div>

        <div
          ref={listRef}
          className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:max-h-96 lg:grid-cols-1 lg:gap-2 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0"
        >
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-video w-36 shrink-0 overflow-hidden border transition lg:w-full ${
                index === activeIndex
                  ? "border-[#ffb901] ring-2 ring-[#ffc91f]/70"
                  : "border-black/10 hover:border-[#ffc91f]"
              }`}
              aria-label={`Select gallery image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Executive gallery thumbnail ${index + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 36vw, 24vw"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      </section>

      {portalTarget && isZoomOpen
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Zoomed gallery image"
              className="fixed inset-0 z-200 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setIsZoomOpen(false)}
            >
              <div
                className="relative h-[88vh] w-full max-w-6xl"
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                  src={activeImage}
                  alt="Zoomed executive gallery preview"
                  fill
                  loading="lazy"
                  sizes="100vw"
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  aria-label="Close zoom preview"
                  className="absolute right-4 top-4 z-10 border border-white/30 bg-black/50 px-3 py-1 text-sm text-white transition hover:bg-black/70"
                >
                  Close
                </button>
              </div>
            </div>,
            portalTarget,
          )
        : null}
    </div>
  );
}
