import { Prisma } from "../../../generated/prisma/edge";
import { TRPCError } from "@trpc/server";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface PrismaErrorContext {
  /** ID record yang sedang diproses (untuk pesan error yang lebih informatif) */
  id?: number | string;
  /** Nama model/entitas (contoh: "HallOfFame", "User") */
  entity?: string;
  /** Nama field yang berkaitan dengan error (contoh: "email", "slug") */
  field?: string;
}

// ─────────────────────────────────────────────
// Helper: format nama entitas
// ─────────────────────────────────────────────

function entityLabel(entity?: string): string {
  return entity ?? "Entry";
}

// ─────────────────────────────────────────────
// Handler Utama
// ─────────────────────────────────────────────

/**
 * Menangkap semua kemungkinan error dari Prisma Client dan
 * mengubahnya menjadi TRPCError dengan pesan yang deskriptif.
 *
 * @param error  - Error yang dilempar oleh Prisma
 * @param ctx    - Konteks tambahan untuk pesan error (id, entity, field)
 *
 * @example
 * try {
 *   await prisma.hallOfFame.update({ where: { id }, data });
 * } catch (error) {
 *   handlePrismaError(error, { id, entity: "HallOfFame" });
 * }
 */
export function handlePrismaError(
  error: unknown,
  ctx: PrismaErrorContext = {},
): never {
  const { id, entity, field } = ctx;
  const label = entityLabel(entity);

  // ─────────────────────────────────────────
  // 1. PrismaClientKnownRequestError
  //    Error dari query/mutasi yang sudah diketahui Prisma
  // ─────────────────────────────────────────
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = error.meta as Record<string, unknown> | undefined;

    switch (error.code) {
      // ── Constraint & Relasi ──────────────────

      case "P2000":
        // Value terlalu panjang untuk tipe kolom
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Nilai yang dimasukkan terlalu panjang untuk kolom ${meta?.column_name ?? field ?? "yang dituju"}.`,
          cause: error,
        });

      case "P2001":
        // Record tidak ditemukan saat WHERE
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            id !== undefined
              ? `${label} dengan id ${id} tidak ditemukan.`
              : `${label} tidak ditemukan.`,
          cause: error,
        });

      case "P2002":
        // Unique constraint violation
        throw new TRPCError({
          code: "CONFLICT",
          message: `${label} dengan ${
            meta?.target
              ? (meta.target as string[]).join(", ")
              : (field ?? "nilai")
          } tersebut sudah ada.`,
          cause: error,
        });

      case "P2003":
        // Foreign key constraint violation
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Relasi tidak valid: data terkait pada field ${
            meta?.field_name ?? field ?? "foreign key"
          } tidak ditemukan.`,
          cause: error,
        });

      case "P2004":
        // Constraint pada database gagal
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Constraint database gagal dipenuhi. Periksa data yang dikirim.",
          cause: error,
        });

      case "P2005":
        // Nilai field tidak valid untuk tipe datanya
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Nilai tidak valid untuk field ${meta?.field_name ?? field ?? "yang dituju"} pada model ${meta?.model_name ?? label}.`,
          cause: error,
        });

      case "P2006":
        // Nilai yang diberikan tidak valid untuk field
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Nilai yang diberikan untuk field ${meta?.field_name ?? field ?? "yang dituju"} pada model ${meta?.model_name ?? label} tidak valid.`,
          cause: error,
        });

      case "P2007":
        // Data validation error
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Validasi data gagal. Periksa kembali data yang dikirim.",
          cause: error,
        });

      case "P2008":
        // Query gagal diparse
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Query tidak dapat diproses oleh server.",
          cause: error,
        });

      case "P2009":
        // Query validation error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Query tidak valid. Hubungi administrator.",
          cause: error,
        });

      case "P2010":
        // Raw query gagal
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Raw query gagal dieksekusi.",
          cause: error,
        });

      case "P2011":
        // Null constraint violation
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Field ${meta?.constraint ?? field ?? "yang dituju"} tidak boleh kosong (null).`,
          cause: error,
        });

      case "P2012":
        // Missing required value
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Nilai wajib tidak ditemukan: ${meta?.path ?? field ?? "field tidak diketahui"}.`,
          cause: error,
        });

      case "P2013":
        // Missing required argument
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Argumen wajib tidak ada: ${meta?.argument_name ?? "argument tidak diketahui"} pada field ${meta?.field_name ?? ""} model ${meta?.object_name ?? label}.`,
          cause: error,
        });

      case "P2014":
        // Relasi wajib akan rusak jika operasi dilanjutkan
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Operasi tidak dapat dilakukan karena akan merusak relasi antara model ${meta?.model_a_name ?? ""} dan ${meta?.model_b_name ?? ""}.`,
          cause: error,
        });

      case "P2015":
        // Record terkait tidak ditemukan
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Record terkait tidak ditemukan: ${meta?.details ?? "detail tidak tersedia"}.`,
          cause: error,
        });

      case "P2016":
        // Error interpretasi query
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan interpretasi query.",
          cause: error,
        });

      case "P2017":
        // Relasi tidak terhubung
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Relasi ${meta?.relation_name ?? ""} antara model ${meta?.parent_name ?? ""} dan ${meta?.child_name ?? ""} tidak terhubung.`,
          cause: error,
        });

      case "P2018":
        // Required connected records tidak ditemukan
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Record yang diperlukan untuk relasi tidak ditemukan.",
          cause: error,
        });

      case "P2019":
        // Input error
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Input tidak valid.",
          cause: error,
        });

      case "P2020":
        // Value out of range
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Nilai di luar jangkauan untuk tipe data pada field ${meta?.field_name ?? field ?? "yang dituju"}.`,
          cause: error,
        });

      case "P2021":
        // Table tidak ada di database
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Tabel ${meta?.table ?? ""} tidak ditemukan di database. Pastikan migrasi sudah dijalankan.`,
          cause: error,
        });

      case "P2022":
        // Column tidak ada di database
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Kolom ${meta?.column ?? ""} tidak ditemukan di database. Pastikan migrasi sudah dijalankan.`,
          cause: error,
        });

      case "P2023":
        // Inconsistent column data
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Data kolom tidak konsisten.",
          cause: error,
        });

      case "P2024":
        // Connection pool timeout
        throw new TRPCError({
          code: "TIMEOUT",
          message: "Koneksi database timeout. Coba lagi beberapa saat.",
          cause: error,
        });

      case "P2025":
        // Record tidak ditemukan (update/delete)
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            id !== undefined
              ? `${label} dengan id ${id} tidak ditemukan.`
              : `${label} tidak ditemukan.`,
          cause: error,
        });

      case "P2026":
        // Fitur query tidak didukung provider database
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Database provider tidak mendukung fitur yang digunakan: ${meta?.feature ?? "tidak diketahui"}.`,
          cause: error,
        });

      case "P2027":
        // Multiple error terjadi selama eksekusi
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Beberapa error terjadi selama eksekusi query.",
          cause: error,
        });

      case "P2028":
        // Transaction API error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan pada transaksi database.",
          cause: error,
        });

      case "P2030":
        // Fulltext index tidak ditemukan
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Fulltext index tidak ditemukan. Pastikan index sudah dibuat di schema Prisma.",
          cause: error,
        });

      case "P2033":
        // Number overflow (tidak muat di integer 64-bit)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Nilai angka terlalu besar untuk field ${meta?.field_name ?? field ?? "yang dituju"}.`,
          cause: error,
        });

      case "P2034":
        // Transaction conflict / deadlock (write conflict)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Transaksi gagal karena konflik data. Silakan coba lagi.",
          cause: error,
        });

      default:
        // Kode error Prisma yang tidak tercakup di atas
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Terjadi kesalahan database (kode: ${error.code}).`,
          cause: error,
        });
    }
  }

  // ─────────────────────────────────────────
  // 2. PrismaClientUnknownRequestError
  //    Error dari query yang tidak bisa diidentifikasi Prisma
  // ─────────────────────────────────────────
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan database yang tidak diketahui.",
      cause: error,
    });
  }

  // ─────────────────────────────────────────
  // 3. PrismaClientRustPanicError
  //    Error fatal di Prisma engine (Rust)
  // ─────────────────────────────────────────
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Terjadi kesalahan kritis pada database engine. Hubungi administrator.",
      cause: error,
    });
  }

  // ─────────────────────────────────────────
  // 4. PrismaClientInitializationError
  //    Gagal koneksi ke database saat inisialisasi
  // ─────────────────────────────────────────
  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Gagal terhubung ke database. Pastikan konfigurasi DATABASE_URL sudah benar.",
      cause: error,
    });
  }

  // ─────────────────────────────────────────
  // 5. PrismaClientValidationError
  //    Schema/query tidak valid sebelum dikirim ke DB
  // ─────────────────────────────────────────
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Data yang dikirim tidak sesuai dengan schema yang diharapkan.",
      cause: error,
    });
  }

  // ─────────────────────────────────────────
  // 6. TRPCError yang sudah dilempar sebelumnya
  //    Re-throw agar tidak ter-wrap dua kali
  // ─────────────────────────────────────────
  if (error instanceof TRPCError) {
    throw error;
  }

  // ─────────────────────────────────────────
  // 7. Fallback — error tidak dikenali sama sekali
  // ─────────────────────────────────────────
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Terjadi kesalahan yang tidak terduga pada server.",
    cause: error,
  });
}
