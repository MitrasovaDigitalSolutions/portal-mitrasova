import { z } from "zod"

export const couponSchema = z.object({
  code: z
    .string()
    .min(2, "Kode kupon minimal 2 karakter")
    .max(50, "Kode kupon maksimal 50 karakter")
    .transform((val) => val.toUpperCase().trim()),
  name: z
    .string()
    .min(2, "Nama promo kupon minimal 2 karakter")
    .max(255, "Nama promo kupon maksimal 255 karakter"),
  description: z.string().optional().nullable(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().min(1, "Nilai diskon minimal 1"),
  max_discount_amount: z.number().min(0, "Maksimal diskon minimal Rp 0").optional().nullable(),
  min_order_amount: z.number().min(0, "Minimal order minimal Rp 0").optional().nullable(),
  applicable_period: z.enum(["all", "monthly", "annual"]),
  max_uses: z.number().int().min(1, "Batas penggunaan minimal 1 kali").optional().nullable(),
  max_uses_per_client: z.number().int().min(1, "Batas per klien minimal 1 kali").optional().nullable(),
  starts_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
  is_active: z.boolean(),
})

export type CouponFormValues = z.infer<typeof couponSchema>
