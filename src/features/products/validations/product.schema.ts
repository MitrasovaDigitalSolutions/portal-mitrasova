import { z } from "zod"

export const productSchema = z.object({
  code: z
    .string({ error: "Kode produk wajib diisi" })
    .min(1, "Kode produk wajib diisi")
    .min(2, "Kode produk minimal 2 karakter")
    .max(50, "Kode produk maksimal 50 karakter"),
  nama: z
    .string({ error: "Nama produk wajib diisi" })
    .min(1, "Nama produk wajib diisi")
    .min(2, "Nama produk minimal 2 karakter")
    .max(150, "Nama produk maksimal 150 karakter"),
  description: z.string().optional().nullable(),
  harga_bulanan: z
    .number({ error: "Harga bulanan wajib diisi" })
    .min(0, "Harga bulanan minimal Rp 0"),
  harga_tahunan: z
    .number({ error: "Harga tahunan wajib diisi" })
    .min(0, "Harga tahunan minimal Rp 0"),
  is_active: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>
