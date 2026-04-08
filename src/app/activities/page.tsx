import { ACTIVITY_CATEGORIES, getAllActivitiesMeta } from "@/lib/activities";
import { ArrowRight2, SearchNormal1 } from "iconsax-react";

import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Activities | Prodigi",
  description: "News, information, events, and articles from Prodigi.",
};

type ActivitiesPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
};

const ITEMS_PER_PAGE = 9;

export default async function ActivitiesPage({
  searchParams,
}: ActivitiesPageProps) {
  const params = await searchParams;
  const posts = getAllActivitiesMeta();
  const activeCategory = ACTIVITY_CATEGORIES.includes(
    params.category as (typeof ACTIVITY_CATEGORIES)[number],
  )
    ? (params.category as (typeof ACTIVITY_CATEGORIES)[number])
    : "All";

  const searchQuery = (params.q ?? "").trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      activeCategory === "All" ? true : post.category === activeCategory;
    const textMatch = searchQuery
      ? `${post.title} ${post.excerpt}`.toLowerCase().includes(searchQuery)
      : true;

    return categoryMatch && textMatch;
  });

  const requestedPage = Number(params.page ?? "1");
  const normalizedPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / ITEMS_PER_PAGE),
  );
  const currentPage = Math.min(normalizedPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const buildPageHref = (page: number) => {
    const nextParams = new URLSearchParams();

    if (activeCategory !== "All") {
      nextParams.set("category", activeCategory);
    }

    if (params.q) {
      nextParams.set("q", params.q);
    }

    if (page > 1) {
      nextParams.set("page", String(page));
    }

    return `/activities${nextParams.toString() ? `?${nextParams.toString()}` : ""}`;
  };

  const categoryTabs = ["All", ...ACTIVITY_CATEGORIES] as const;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
      <nav className="mb-5 flex items-center gap-2 text-sm text-black/50">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ArrowRight2 size="12" color="currentColor" variant="Linear" />
        <span className="text-black/70">Activities</span>
      </nav>

      <header className="mb-8">
        <h1 className="mt-2 text-5xl font-bold text-[#181818]">Activities</h1>
      </header>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((category) => {
            const isActive = activeCategory === category;
            const nextParams = new URLSearchParams();
            if (category !== "All") {
              nextParams.set("category", category);
            }
            if (params.q) {
              nextParams.set("q", params.q);
            }

            return (
              <Link
                key={category}
                href={`/activities${nextParams.toString() ? `?${nextParams.toString()}` : ""}`}
                className={`rounded-sm border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-[#ffc91f] bg-[#ffc91f] text-black hover:bg-[#ffb901]"
                    : "border-black/15 bg-white text-black/70 hover:text-black"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>

        <form
          action="/activities"
          method="get"
          className="flex w-full max-w-sm items-center border border-black/15 bg-white px-3 py-2"
        >
          {activeCategory !== "All" ? (
            <input type="hidden" name="category" value={activeCategory} />
          ) : null}
          <SearchNormal1
            size="16"
            color="currentColor"
            variant="Linear"
            className="text-black/50"
          />
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search activities..."
            className="w-full border-0 bg-transparent px-3 text-sm outline-none"
          />
        </form>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {paginatedPosts.map((post) => (
          <article
            key={post.slug}
            className="overflow-hidden rounded-sm border border-black/10 bg-white"
          >
            <Link href={`/activities/${post.slug}`} className="block">
              <div className="relative h-56">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#ffc91f]">
                {post.category} •{" "}
                {new Date(post.date).toLocaleDateString("en-GB")}
              </p>
              <h2 className="text-2xl font-semibold leading-tight text-[#1c1c1c]">
                <Link href={`/activities/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-sm text-black/70">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="mt-8 text-sm text-black/60">
          No activities found for current filter.
        </p>
      ) : null}

      {filteredPosts.length > 0 && totalPages > 1 ? (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={buildPageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={`rounded-sm border px-3 py-2 text-sm font-semibold transition ${
              currentPage === 1
                ? "pointer-events-none border-black/10 text-black/30"
                : "border-black/15 text-black/70 hover:text-black"
            }`}
          >
            Prev
          </Link>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            return (
              <Link
                key={page}
                href={buildPageHref(page)}
                className={`rounded-sm border px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-[#ffc91f] bg-[#ffc91f] text-black"
                    : "border-black/15 text-black/70 hover:text-black"
                }`}
              >
                {page}
              </Link>
            );
          })}

          <Link
            href={buildPageHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={`rounded-sm border px-3 py-2 text-sm font-semibold transition ${
              currentPage === totalPages
                ? "pointer-events-none border-black/10 text-black/30"
                : "border-black/15 text-black/70 hover:text-black"
            }`}
          >
            Next
          </Link>
        </nav>
      ) : null}
    </main>
  );
}
