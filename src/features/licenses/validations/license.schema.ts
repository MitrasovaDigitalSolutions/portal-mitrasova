import { z } from "zod"

export const licenseFormSchema = z.object({
  client_id: z.string().min(1, "Klien wajib dipilih"),
  product_id: z.string().min(1, "Produk software wajib dipilih"),
  nama_instance: z
    .string()
    .min(2, "Nama instance minimal 2 karakter")
    .max(100, "Nama instance maksimal 100 karakter"),
  domain_instance: z
    .string()
    .max(255, "Domain instance maksimal 255 karakter")
    .optional(),
  subscription_type: z.enum(["trial", "monthly", "yearly", "lifetime"]),
  server_type: z
    .enum([
      "cloud",
      "cloud_dedicated",
      "cloud_shared",
      "self_hosted",
      "dedicated",
      "vps",
      "shared",
      "on_premise",
    ])
    .or(z.string().min(1)),
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
})

export type LicenseFormValues = z.infer<typeof licenseFormSchema>
