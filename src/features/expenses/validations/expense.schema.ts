import { z } from "zod"

export const expenseSchema = z
  .object({
    cash_account_id: z
      .number({ error: "Akun kas wajib dipilih" })
      .min(1, "Akun kas wajib dipilih"),
    expense_category_id: z.number().optional().nullable(),
    category: z.string().max(100).optional().nullable(),
    amount: z
      .number({ error: "Nominal pengeluaran wajib diisi" })
      .min(1, "Nominal minimal Rp 1"),
    transaction_date: z.string().optional().nullable(),
    notes: z
      .string()
      .max(1000, "Catatan maksimal 1000 karakter")
      .optional()
      .nullable(),
  })
  .refine(
    (data) =>
      Boolean(data.expense_category_id) ||
      (typeof data.category === "string" && data.category.trim() !== ""),
    {
      message: "Kategori pengeluaran wajib dipilih",
      path: ["expense_category_id"],
    }
  )

export type ExpenseFormValues = z.infer<typeof expenseSchema>
