import { z } from "zod"

export const clientFormSchema = z.object({
  nama_pemilik: z
    .string()
    .min(2, "Nama pemilik minimal 2 karakter")
    .max(100, "Nama pemilik maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format alamat email tidak valid"),
  telepon: z
    .string()
    .min(6, "Nomor telepon minimal 6 digit")
    .max(20, "Nomor telepon maksimal 20 digit"),
  nama_perusahaan: z
    .string()
    .min(2, "Nama perusahaan minimal 2 karakter")
    .max(100, "Nama perusahaan maksimal 100 karakter"),
  alamat: z
    .string()
    .min(3, "Alamat minimal 3 karakter")
    .max(500, "Alamat maksimal 500 karakter"),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>
