import { z } from "zod"

export const cashTransferSchema = z
  .object({
    from_cash_account_id: z
      .number({ error: "Akun asal wajib dipilih" })
      .min(1, "Akun asal wajib dipilih"),
    to_cash_account_id: z
      .number({ error: "Akun tujuan wajib dipilih" })
      .min(1, "Akun tujuan wajib dipilih"),
    amount: z
      .number({ error: "Nominal transfer wajib diisi" })
      .min(1, "Nominal transfer minimal Rp 1"),
    admin_fee: z
      .number({ error: "Biaya admin harus berupa angka" })
      .min(0, "Biaya admin tidak boleh negatif"),
    transfer_date: z.string().optional().nullable(),
    notes: z
      .string()
      .max(1000, "Catatan transfer maksimal 1000 karakter")
      .optional()
      .nullable(),
  })
  .refine((data) => data.from_cash_account_id !== data.to_cash_account_id, {
    message: "Akun asal dan akun tujuan transfer tidak boleh sama",
    path: ["to_cash_account_id"],
  })

export type CashTransferFormValues = z.infer<typeof cashTransferSchema>
