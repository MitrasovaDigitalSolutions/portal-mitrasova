import { z } from "zod"

export const expenseCategorySchema = z.object({
  name: z
    .string({ error: "Nama kategori wajib diisi" })
    .min(1, "Nama kategori wajib diisi")
    .min(2, "Nama kategori minimal 2 karakter")
    .max(255, "Nama kategori maksimal 255 karakter"),
  code: z
    .string()
    .max(50, "Kode kategori maksimal 50 karakter")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .nullable(),
  is_active: z.boolean(),
})

export type ExpenseCategoryFormValues = z.infer<typeof expenseCategorySchema>
