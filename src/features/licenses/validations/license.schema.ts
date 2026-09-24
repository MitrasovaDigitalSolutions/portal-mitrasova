import { z } from "zod"

export const licenseFormSchema = z.object({
  client_id: z.string().min(1, "Klien wajib dipilih"),
  product_id: z.string().min(1, "Produk software wajib dipilih"),
  nama_instance: z
    .string()
    .min(2, "Nama instance minimal 2 karakter")
    .max(255, "Nama instance maksimal 255 karakter"),
  domain_instance: z
    .string()
    .max(255, "Domain instance maksimal 255 karakter")
    .optional()
    .nullable(),
  subscription_type: z.enum(["monthly", "annual", "lifetime", "yearly", "trial"]),
  server_package_id: z.string().min(1, "Paket server wajib dipilih"),
  server_notes: z.string().optional().nullable(),
  server_type: z.string().optional(),
  status: z.enum(["active", "suspended", "expired", "trial"]),
  expires_at: z.string().nullable().optional(),
  grace_period_days: z
    .number()
    .int("Grace period harus bilangan bulat")
    .min(0, "Grace period minimal 0 hari")
    .max(90, "Grace period maksimal 90 hari"),
  addon_ids: z.array(z.string()).optional(),
  create_invoice: z.boolean().optional(),
  billing_period: z.enum(["monthly", "annual"]).optional(),
  discount_amount: z.union([z.number(), z.string()]).optional().nullable(),
  discount_description: z.string().max(255).optional().nullable(),
  coupon_code: z.string().optional().nullable(),
})

export type LicenseFormValues = z.infer<typeof licenseFormSchema>

export const licenseEditSchema = z.object({
  nama_instance: z
    .string()
    .min(2, "Nama instance minimal 2 karakter")
    .max(255, "Nama instance maksimal 255 karakter"),
  domain_instance: z
    .string()
    .max(255, "Domain instance maksimal 255 karakter")
    .optional()
    .nullable(),
  subscription_type: z.enum(["monthly", "annual", "lifetime", "yearly", "trial"]),
  server_package_id: z.string().min(1, "Paket server wajib dipilih"),
  server_notes: z.string().optional().nullable(),
  status: z.enum(["active", "suspended", "expired", "trial"]),
  expires_at: z.string().nullable().optional(),
  grace_period_days: z
    .number()
    .int("Grace period harus bilangan bulat")
    .min(0, "Grace period minimal 0 hari")
    .max(90, "Grace period maksimal 90 hari"),
})

export type LicenseEditValues = z.infer<typeof licenseEditSchema>
