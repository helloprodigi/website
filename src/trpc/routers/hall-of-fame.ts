import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import {
  getAllSchema,
  hallOfFameCreateSchema,
  hallOfFameUpdateSchema,
  hallOfFameGetByYearSchema,
  hallOfFameIdSchema,
  hofPeriodCreateSchema,
} from "@/trpc/schemas/hallOfFame-schema";
import prisma from "@/lib/prisma";
import { Prisma } from "../../../generated/prisma/edge";
import { TRPCError } from "@trpc/server";

export const hallOfFameRouter = createTRPCRouter({
  getAll: baseProcedure.input(getAllSchema).query(async ({ input }) => {
    const year = input?.year;
    const q = input?.q;
    const limit = input?.limit ?? 6;
    const page = input?.page ?? 1;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.HallOfFameWhereInput = {};
    if (year) {
      whereClause.year = year;
    }
    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { competition: { contains: q, mode: "insensitive" } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.hallOfFame.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      }),
      prisma.hallOfFame.count({ where: whereClause }),
    ]);

    return {
      entries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }),

  getYears: baseProcedure.query(async () => {
    const [hofYears, periodYears] = await Promise.all([
      prisma.hallOfFame.findMany({
        select: { year: true },
        distinct: ["year"],
      }),
      prisma.hofPeriod.findMany({
        select: { year: true },
      }),
    ]);
    const all = new Set([
      ...hofYears.map((r) => r.year),
      ...periodYears.map((r) => r.year),
    ]);
    return Array.from(all).sort((a, b) => b.localeCompare(a));
  }),

  getByYear: baseProcedure
    .input(hallOfFameGetByYearSchema)
    .query(({ input }) =>
      prisma.hallOfFame.findMany({
        where: { year: input.year },
        orderBy: { createdAt: "desc" },
      }),
    ),

  getById: baseProcedure
    .input(hallOfFameIdSchema)
    .query(async ({ input }) => {
      const entry = await prisma.hallOfFame.findUnique({
        where: { id: input.id },
      });

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `data dengan id ${input.id} tidak ditemukan`,
        });
      }

      return entry;
    }),

  create: adminProcedure
    .input(hallOfFameCreateSchema)
    .mutation(({ input }) => prisma.hallOfFame.create({ data: input })),

  update: adminProcedure
    .input(hallOfFameUpdateSchema)
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return prisma.hallOfFame.update({ where: { id }, data });
    }),

  delete: adminProcedure
    .input(hallOfFameIdSchema)
    .mutation(({ input }) =>
      prisma.hallOfFame.delete({ where: { id: input.id } }),
    ),

  createPeriod: adminProcedure
    .input(hofPeriodCreateSchema)
    .mutation(({ input }) =>
      prisma.hofPeriod.upsert({
        where: { year: input.year },
        create: { year: input.year },
        update: {},
      }),
    ),
});
