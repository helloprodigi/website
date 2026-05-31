import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import {
  activityGetAllSchema,
  activityGetBySlugSchema,
  activityGetLatestByCategorySchema,
  activityGetByIdSchema,
  activityCreateSchema,
  activityUpdateSchema,
  activityDeleteSchema,
} from "@/trpc/schemas/activities-schema";
import type { Prisma } from "../../../generated/prisma/edge";
import type { ActivityCategory, ActivityMeta } from "@/lib/activity-types";
import { generateSlug } from "@/lib/utils/slug";
import { remark } from "remark";
import html from "remark-html";

async function markdownToHtml(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  return result.toString();
}

async function makeUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.activity.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${++counter}`;
  }
  return slug;
}

function toActivityMeta(post: {
  id: string;
  slug: string;
  title: string;
  date: Date;
  category: string;
  excerpt: string;
  coverImage: string;
}): ActivityMeta {
  return {
    ...post,
    date: post.date.toISOString(),
    category: post.category as ActivityCategory,
  };
}



export const activitiesRouter = createTRPCRouter({
  getAll: baseProcedure
    .input(activityGetAllSchema)
    .query(async ({ input }) => {
      const { category, q, page, limit } = input;

      const where: Prisma.ActivityWhereInput = {};
      if (category) {
        where.category = category;
      }
      if (q) {
        where.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ];
      }

      const [rows, totalCount] = await Promise.all([
        prisma.activity.findMany({
          where,
          select: {
            id: true,
            slug: true,
            title: true,
            date: true,
            category: true,
            excerpt: true,
            coverImage: true,
          },
          orderBy: { date: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.activity.count({ where }),
      ]);

      return { posts: rows.map(toActivityMeta), totalCount };
    }),

  getBySlug: baseProcedure
    .input(activityGetBySlugSchema)
    .query(async ({ input }) => {
      const post = await prisma.activity.findUnique({
        where: { slug: input.slug },
      });
      if (!post) return null;
      return {
        ...post,
        date: post.date.toISOString(),
        category: post.category as ActivityCategory,
      };
    }),

  getLatestByCategory: baseProcedure
    .input(activityGetLatestByCategorySchema)
    .query(async ({ input }) => {
      const result = {} as Record<ActivityCategory, ActivityMeta[]>;
      const categories = await prisma.contentCategory.findMany({ orderBy: { order: "asc" } });
      const catNames = categories.map(c => c.name);

      await Promise.all(
        catNames.map(async (cat) => {
          const rows = await prisma.activity.findMany({
            where: { category: cat },
            select: {
              id: true,
              slug: true,
              title: true,
              date: true,
              category: true,
              excerpt: true,
              coverImage: true,
            },
            orderBy: { date: "desc" },
            take: input.limit,
          });
          result[cat] = rows.map(toActivityMeta);
        }),
      );
      return result;
    }),

  getById: baseProcedure
    .input(activityGetByIdSchema)
    .query(async ({ input }) => {
      const post = await prisma.activity.findUnique({ where: { id: input.id } });
      if (!post) return null;
      return {
        ...post,
        date: post.date.toISOString(),
        category: post.category as ActivityCategory,
      };
    }),

  create: adminProcedure
    .input(activityCreateSchema)
    .mutation(async ({ input }) => {
      const { title, excerpt, category, coverImage, contentMarkdown } = input;
      const baseSlug = generateSlug(title);
      const slug = await makeUniqueSlug(baseSlug);
      const contentHtml = await markdownToHtml(contentMarkdown);
      return prisma.activity.create({
        data: { title, excerpt, category, coverImage, contentHtml, slug, date: new Date() },
      });
    }),

  update: adminProcedure
    .input(activityUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, title, excerpt, category, coverImage, contentMarkdown } = input;
      const existing = await prisma.activity.findUniqueOrThrow({ where: { id } });
      const baseSlug = generateSlug(title);
      const slug =
        baseSlug !== generateSlug(existing.title)
          ? await makeUniqueSlug(baseSlug, id)
          : existing.slug;
      const contentHtml = await markdownToHtml(contentMarkdown);
      return prisma.activity.update({
        where: { id },
        data: { title, excerpt, category, coverImage, contentHtml, slug },
      });
    }),

  delete: adminProcedure
    .input(activityDeleteSchema)
    .mutation(({ input }) =>
      prisma.activity.delete({ where: { id: input.id } }),
    ),
});
