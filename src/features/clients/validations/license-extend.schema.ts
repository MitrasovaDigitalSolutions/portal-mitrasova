import { z } from "zod"

export const licenseExtendSchema = z.object({
  extend_mode: z.enum(["days", "custom_date"]),
  days: z.number().int().min(1, "Minimal perpanjangan 1 hari").optional(),
  expires_at: z.string().optional(),
})

export type LicenseExtendValues = z.infer<typeof licenseExtendSchema>
