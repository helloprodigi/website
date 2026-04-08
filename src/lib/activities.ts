import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export const ACTIVITY_CATEGORIES = [
  "Event",
  "Information",
  "Articles",
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export type ActivityMeta = {
  slug: string;
  title: string;
  date: string;
  category: ActivityCategory;
  excerpt: string;
  coverImage: string;
};

export type ActivityPost = ActivityMeta & {
  contentHtml: string;
};

const activitiesDirectory = path.join(process.cwd(), "content", "activities");

const isValidCategory = (value: string): value is ActivityCategory =>
  ACTIVITY_CATEGORIES.includes(value as ActivityCategory);

const sortByDateDesc = (a: ActivityMeta, b: ActivityMeta) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export function getAllActivitiesMeta(): ActivityMeta[] {
  if (!fs.existsSync(activitiesDirectory)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(activitiesDirectory)
    .filter((name) => name.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(activitiesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const rawCategory = String(data.category ?? "Information");
    const category = isValidCategory(rawCategory) ? rawCategory : "Information";

    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? "1970-01-01"),
      category,
      excerpt: String(data.excerpt ?? ""),
      coverImage: String(data.coverImage ?? "/images/slide1.jpg"),
    } satisfies ActivityMeta;
  });

  return posts.sort(sortByDateDesc);
}

export async function getActivityPostBySlug(
  slug: string,
): Promise<ActivityPost | null> {
  const fullPath = path.join(activitiesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  const rawCategory = String(data.category ?? "Information");
  const category = isValidCategory(rawCategory) ? rawCategory : "Information";

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? "1970-01-01"),
    category,
    excerpt: String(data.excerpt ?? ""),
    coverImage: String(data.coverImage ?? "/images/slide1.jpg"),
    contentHtml,
  };
}

export function getLatestActivitiesByCategory(
  limit = 3,
): Record<ActivityCategory, ActivityMeta[]> {
  const grouped: Record<ActivityCategory, ActivityMeta[]> = {
    Event: [],
    Information: [],
    Articles: [],
  };

  const allPosts = getAllActivitiesMeta();

  allPosts.forEach((post) => {
    if (grouped[post.category].length < limit) {
      grouped[post.category].push(post);
    }
  });

  return grouped;
}
