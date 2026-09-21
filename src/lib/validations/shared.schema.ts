/**
 * Shared Zod validation schemas used across multiple features.
 *
 * Feature-specific schemas go in features/[name]/validations/.
 */

import { z } from "zod"

/** Reusable email field schema. */
export const emailSchema = z
  .string()
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid")

/** Reusable password field schema with minimum requirements. */
export const passwordSchema = z
  .string()
  .min(1, "Password wajib diisi")
  .min(8, "Password minimal 8 karakter")

/** Reusable pagination query params schema. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

/** Reusable ID parameter schema (numeric). */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("ID tidak valid"),
})
