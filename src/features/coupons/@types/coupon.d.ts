/**
 * Coupon feature type definitions.
 */

import type { PaginationParams } from "@/@types/api"

export type CouponDiscountType = "percentage" | "fixed"
export type CouponApplicablePeriod = "all" | "monthly" | "annual"

export interface CouponUsage {
  id: string
  coupon_id: string
  client_id: string
  license_id: string | null
  invoice_id: string | null
  discount_amount: number
  created_at: string
  client?: {
    id: string
    nama_pemilik: string
    email?: string | null
    nama_perusahaan?: string | null
  }
}

export interface Coupon {
  id: string
  code: string
  name: string
  description: string | null
  discount_type: CouponDiscountType
  discount_value: number
  max_discount_amount: number | null
  min_order_amount: number | null
  applicable_period: CouponApplicablePeriod | null
  required_addon_codes: string[] | null
  required_product_codes: string[] | null
  max_uses: number | null
  max_uses_per_client: number | null
  starts_at: string | null
  expires_at: string | null
  is_active: boolean
  usages_count?: number
  usages?: CouponUsage[]
  created_at: string
  updated_at: string
}

export interface CouponQueryParams extends PaginationParams {
  search?: string
  discount_type?: CouponDiscountType | "all"
  applicable_period?: CouponApplicablePeriod | "all"
  is_active?: boolean | "all"
}

export interface CreateCouponPayload {
  code: string
  name: string
  description?: string | null
  discount_type: CouponDiscountType
  discount_value: number
  max_discount_amount?: number | null
  min_order_amount?: number | null
  applicable_period?: CouponApplicablePeriod | null
  required_addon_codes?: string[] | null
  required_product_codes?: string[] | null
  max_uses?: number | null
  max_uses_per_client?: number | null
  starts_at?: string | null
  expires_at?: string | null
  is_active?: boolean
}

export interface UpdateCouponPayload {
  code?: string
  name?: string
  description?: string | null
  discount_type?: CouponDiscountType
  discount_value?: number
  max_discount_amount?: number | null
  min_order_amount?: number | null
  applicable_period?: CouponApplicablePeriod | null
  required_addon_codes?: string[] | null
  required_product_codes?: string[] | null
  max_uses?: number | null
  max_uses_per_client?: number | null
  starts_at?: string | null
  expires_at?: string | null
  is_active?: boolean
}
