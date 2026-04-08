import { getActivityPostBySlug, getAllActivitiesMeta } from "@/lib/activities";

import { ArrowRight2 } from "iconsax-react";
import FloatingShare from "@/components/activities/FloatingShare";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ActivityDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllActivitiesMeta().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ActivityDetailPageProps) {
  const { slug } = await params;
  const post = await getActivityPostBySlug(slug);

  if (!post) {
    return { title: "Activity Not Found" };
  }

  return {
    title: `${post.title} | Activities`,
    description: post.excerpt,
  };
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { slug } = await params;
  const post = await getActivityPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-14 md:px-8">
      <FloatingShare title={post.title} />

      <nav className="mb-5 flex items-center gap-2 text-sm text-black/50">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ArrowRight2 size="12" color="currentColor" variant="Linear" />
        <Link href="/activities" className="hover:text-black">
          Activities
        </Link>
        <ArrowRight2 size="12" color="currentColor" variant="Linear" />
        <span className="line-clamp-1 text-black/70">{post.title}</span>
      </nav>

      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#ffc91f]">
        {post.category} • {new Date(post.date).toLocaleDateString("en-GB")}
      </p>
      <h1 className="text-5xl font-bold leading-tight text-[#191919]">
        {post.title}
      </h1>
      <p className="mt-4 text-base text-black/70">{post.excerpt}</p>

      <div className="relative mt-8 h-[360px] overflow-hidden rounded-sm border border-black/10">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover"
        />
      </div>

      <article
        className="prose prose-zinc mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </main>
  );
}
