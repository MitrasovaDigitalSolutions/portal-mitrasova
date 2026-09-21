import { z } from "zod"

export const addonSchema = z.object({
  code: z
    .string()
    .min(2, "Kode addon minimal 2 karakter")
    .max(50, "Kode addon maksimal 50 karakter"),
  nama: z
    .string()
    .min(2, "Nama addon minimal 2 karakter")
    .max(150, "Nama addon maksimal 150 karakter"),
  description: z.string().optional().nullable(),
  harga_bulanan: z.number().min(0, "Harga bulanan minimal Rp 0"),
  harga_tahunan: z.number().min(0, "Harga tahunan minimal Rp 0"),
  is_active: z.boolean(),
})

export type AddonFormValues = z.infer<typeof addonSchema>
