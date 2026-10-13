import { z } from "zod"

export const cashAccountSchema = z.object({
  name: z
    .string({ error: "Nama akun kas wajib diisi" })
    .min(1, "Nama akun kas wajib diisi")
    .min(2, "Nama akun kas minimal 2 karakter")
    .max(255, "Nama akun kas maksimal 255 karakter"),
  type: z.enum(["bank", "cash", "payment_gateway", "other"], {
    error: "Tipe akun kas wajib dipilih",
  }),
  account_number: z
    .string()
    .max(100, "Nomor rekening maksimal 100 karakter")
    .optional()
    .nullable(),
  opening_balance: z
    .number({ error: "Saldo awal wajib diisi" })
    .min(0, "Saldo awal minimal Rp 0"),
  is_default: z.boolean(),
  is_active: z.boolean(),
})

export const cashAdjustmentSchema = z.object({
  amount: z
    .number({ error: "Nominal wajib diisi" })
    .min(1, "Nominal minimal Rp 1"),
  description: z
    .string({ error: "Keterangan wajib diisi" })
    .min(1, "Keterangan wajib diisi")
    .min(3, "Keterangan minimal 3 karakter")
    .max(500, "Keterangan maksimal 500 karakter"),
  transaction_date: z.string().optional().nullable(),
})

export type CashAccountFormValues = z.infer<typeof cashAccountSchema>
export type CashAdjustmentFormValues = z.infer<typeof cashAdjustmentSchema>
