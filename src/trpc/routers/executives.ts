import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import type { Prisma } from "../../../generated/prisma/edge";
import { TRPCError } from "@trpc/server";
import {
  executiveMemberCreateSchema,
  executiveMemberUpdateSchema,
  executiveMemberGetAllSchema,
  executiveMemberIdSchema,
} from "@/trpc/schemas/executive-schema";

export const executivesRouter = createTRPCRouter({
  // Ambil semua tahun yang tersedia (distinct)
  getYears: baseProcedure.query(async () => {
    const rows = await prisma.executiveMember.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });
    return rows.map((r) => r.year);
  }),

  // Ambil semua member dengan filter & pagination
  getAll: baseProcedure
    .input(executiveMemberGetAllSchema)
    .query(async ({ input }) => {
      const year = input?.year;
      const q = input?.q;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const skip = (page - 1) * limit;

      const where: Prisma.ExecutiveMemberWhereInput = {};
      if (year) where.year = year;
      if (q) {
        where.OR = [
          { name: { contains: q, mode: "insensitive" } },
          { nim: { contains: q, mode: "insensitive" } },
          { position: { contains: q, mode: "insensitive" } },
          { prodi: { contains: q, mode: "insensitive" } },
        ];
      }

      const [members, total] = await Promise.all([
        prisma.executiveMember.findMany({
          where,
          orderBy: [{ year: "desc" }, { id: "asc" }],
          skip,
          take: limit,
        }),
        prisma.executiveMember.count({ where }),
      ]);

      return {
        members,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Ambil satu member by ID
  getById: baseProcedure
    .input(executiveMemberIdSchema)
    .query(async ({ input }) => {
      const member = await prisma.executiveMember.findUnique({
        where: { id: input.id },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Member dengan id ${input.id} tidak ditemukan`,
        });
      }
      return member;
    }),

  // Tambah member baru (admin only)
  create: adminProcedure
    .input(executiveMemberCreateSchema)
    .mutation(async ({ input }) => {
      // Cek duplikat NIM per tahun
      const existing = await prisma.executiveMember.findUnique({
        where: { nim_year: { nim: input.nim, year: input.year } },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `NIM ${input.nim} sudah terdaftar untuk tahun ${input.year}`,
        });
      }
      return prisma.executiveMember.create({ data: input });
    }),

  // Update member (admin only)
  update: adminProcedure
    .input(executiveMemberUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const existing = await prisma.executiveMember.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Member dengan id ${id} tidak ditemukan`,
        });
      }
      return prisma.executiveMember.update({ where: { id }, data });
    }),

  // Hapus member (admin only)
  delete: adminProcedure
    .input(executiveMemberIdSchema)
    .mutation(async ({ input }) => {
      const existing = await prisma.executiveMember.findUnique({
        where: { id: input.id },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Member dengan id ${input.id} tidak ditemukan`,
        });
      }
      await prisma.executiveMember.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
