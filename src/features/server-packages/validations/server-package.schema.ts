import { z } from "zod"

export const serverPackageSchema = z.object({
  code: z
    .string({ error: "Kode paket server wajib diisi" })
    .min(1, "Kode paket server wajib diisi")
    .min(2, "Kode paket server minimal 2 karakter")
    .max(50, "Kode paket server maksimal 50 karakter"),
  nama: z
    .string({ error: "Nama paket server wajib diisi" })
    .min(1, "Nama paket server wajib diisi")
    .min(2, "Nama paket server minimal 2 karakter")
    .max(255, "Nama paket server maksimal 255 karakter"),
  cpu: z
    .string()
    .max(100, "Spesifikasi CPU maksimal 100 karakter")
    .optional()
    .nullable(),
  ram: z
    .string()
    .max(100, "Spesifikasi RAM maksimal 100 karakter")
    .optional()
    .nullable(),
  storage: z
    .string()
    .max(100, "Spesifikasi Storage maksimal 100 karakter")
    .optional()
    .nullable(),
  description: z.string().optional().nullable(),
  harga_bulanan: z
    .number({ error: "Harga bulanan wajib diisi" })
    .min(0, "Harga bulanan minimal Rp 0"),
  harga_tahunan: z
    .number({ error: "Harga tahunan wajib diisi" })
    .min(0, "Harga tahunan minimal Rp 0"),
  is_active: z.boolean(),
})

export type ServerPackageFormValues = z.infer<typeof serverPackageSchema>
