import { z } from "zod"

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Deskripsi item wajib diisi"),
  quantity: z.number().min(1, "Jumlah minimal 1"),
  unit_price: z.number().min(0, "Harga satuan tidak boleh negatif"),
  amount: z.number().min(0, "Nominal tidak boleh negatif"),
})

export const createInvoiceSchema = z.object({
  client_id: z.string().min(1, "Klien wajib dipilih"),
  license_id: z.string().optional().nullable(),
  total_amount: z.number().min(0, "Total tagihan minimal 0"),
  status: z.enum(["unpaid", "paid", "cancelled", "expired"]),
  payment_method: z.string().optional().nullable(),
  due_date: z.string().min(1, "Tanggal jatuh tempo wajib diisi"),
  paid_at: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).optional().nullable(),
})

export const updateInvoiceSchema = z.object({
  status: z.enum(["unpaid", "paid", "cancelled", "expired"]).optional(),
  payment_method: z.string().optional().nullable(),
  due_date: z.string().min(1, "Tanggal jatuh tempo wajib diisi").optional(),
  paid_at: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).optional().nullable(),
})

export const markPaidSchema = z.object({
  payment_method: z.string().min(1, "Metode pembayaran wajib diisi"),
  paid_at: z.string().optional().nullable(),
  extend_license: z.boolean(),
  extend_months: z
    .number()
    .min(1, "Durasi perpanjangan minimal 1 bulan")
    .optional(),
})

export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceFormValues = z.infer<typeof updateInvoiceSchema>
export type MarkPaidFormValues = z.infer<typeof markPaidSchema>
