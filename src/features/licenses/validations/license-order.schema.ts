import { z } from "zod"

export const licenseOrderSchema = z
  .object({
    license_key: z.string().min(1, "License key wajib diisi"),
    billing_period: z.enum(["monthly", "annual"], {
      message: "Pilih periode penagihan",
    }),
    include_base_product: z.boolean(),
    addon_ids: z.array(z.string()),
  })
  .refine(
    (data) => data.include_base_product || data.addon_ids.length > 0,
    {
      message: "Pilih setidaknya perpanjangan lisensi atau minimal 1 modul add-on",
      path: ["include_base_product"],
    }
  )

export type LicenseOrderValues = z.infer<typeof licenseOrderSchema>
