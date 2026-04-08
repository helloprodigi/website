"use client";

import type { ActivityCategory, ActivityMeta } from "@/lib/activities";
import { ArrowRight2, Calendar1 } from "iconsax-react";
import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

type UpdatesClientProps = {
  categories: ActivityCategory[];
  postsByCategory: Record<ActivityCategory, ActivityMeta[]>;
};

export default function UpdatesClient({
  categories,
  postsByCategory,
}: UpdatesClientProps) {
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>(
    categories[0],
  );

  const activePosts = useMemo(
    () => postsByCategory[activeCategory] ?? [],
    [activeCategory, postsByCategory],
  );

  const featuredPost = activePosts[0];

  return (
    <>
      <div className="mx-auto mb-6 flex w-full max-w-[860px] flex-wrap justify-center text-base">
        {categories.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveCategory(tab)}
            className={`flex min-w-[190px] items-center justify-center border border-white/15 px-6 py-3 font-semibold transition cursor-pointer ${
              tab === activeCategory
                ? "bg-[#ffc91f] text-black hover:bg-[#ffc91f]/90"
                : "bg-white/[0.02] text-white/80 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.1fr]">
        <article className="rounded-sm border border-white/10 bg-[#0b1235]/40 p-4">
          <div className="space-y-2">
            {activePosts.map((post, idx) => {
              const day = new Date(post.date).getDate();
              const month = new Date(post.date)
                .toLocaleString("en", { month: "short" })
                .toUpperCase();

              return (
                <Link
                  key={post.slug}
                  href={`/activities/${post.slug}`}
                  className={`flex items-center gap-4 border p-4 transition ${
                    idx === 0
                      ? "border-[#ffc91f]/70 bg-[#ffc91f]/20"
                      : "border-white/10 bg-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex h-12 w-12 flex-col items-center justify-center bg-white/10 text-[10px] font-semibold tracking-[0.08em] text-white/80">
                    <span className="text-sm leading-none">{day}</span>
                    <span>{month}</span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-white/90 md:text-base">
                    {post.title}
                  </p>
                  {idx === 0 ? (
                    <ArrowRight2
                      size="16"
                      color="currentColor"
                      variant="Linear"
                      className="ml-auto text-[#ffc91f]"
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <Link
            href="/activities"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85 underline-offset-4 hover:underline"
          >
            View all updates
            <ArrowRight2 size="14" color="currentColor" variant="Linear" />
          </Link>
        </article>

        <article className="rounded-sm border border-white/10 bg-[#0b1235]/40 p-4">
          <div className="relative h-80 overflow-hidden border border-white/10">
            <Image
              src={featuredPost?.coverImage ?? "/images/adikara-play.png"}
              alt={featuredPost?.title ?? "Featured activity"}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/70">
            <Calendar1 size="16" color="currentColor" variant="Linear" />
            <span>
              {featuredPost
                ? new Date(featuredPost.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
          <h4 className="mt-3 max-w-[560px] text-4xl font-semibold leading-tight text-white sm:text-3xl">
            {featuredPost?.title ?? "No update available yet"}
          </h4>
        </article>
      </div>
    </>
  );
}
