import { apiClient } from "@/lib/axios"
import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import type {
  Coupon,
  CouponQueryParams,
  CreateCouponPayload,
  UpdateCouponPayload,
} from "../@types/coupon"

export const couponApi = {
  /** Ambil daftar kupon dengan paginasi dan filter */
  getCoupons: async (
    params?: CouponQueryParams
  ): Promise<PaginatedResponse<Coupon>> => {
    const cleanParams: Record<string, string | number | boolean> = {}

    if (params?.page) {
      cleanParams.page = params.page
    }
    if (params?.per_page) {
      cleanParams.per_page = params.per_page
    }
    if (params?.search && params.search.trim() !== "") {
      cleanParams.search = params.search.trim()
    }
    if (params?.discount_type && params.discount_type !== "all") {
      cleanParams.discount_type = params.discount_type
    }
    if (params?.applicable_period && params.applicable_period !== "all") {
      cleanParams.applicable_period = params.applicable_period
    }
    if (params?.is_active !== undefined && params.is_active !== "all") {
      cleanParams.is_active = params.is_active
    }

    const response = await apiClient.get<PaginatedResponse<Coupon>>(
      "/api/v1/admin/coupons",
      { params: cleanParams }
    )
    return response.data
  },

  /** Ambil detail satu kupon beserta riwayat penggunaan */
  getCouponById: async (id: string): Promise<Coupon> => {
    const response = await apiClient.get<ApiResponse<Coupon>>(
      `/api/v1/admin/coupons/${id}`
    )
    return response.data.data
  },

  /** Buat kupon promo baru */
  createCoupon: async (payload: CreateCouponPayload): Promise<Coupon> => {
    const response = await apiClient.post<ApiResponse<Coupon>>(
      "/api/v1/admin/coupons",
      payload
    )
    return response.data.data
  },

  /** Perbarui data kupon promo */
  updateCoupon: async (
    id: string,
    payload: UpdateCouponPayload
  ): Promise<Coupon> => {
    const response = await apiClient.put<ApiResponse<Coupon>>(
      `/api/v1/admin/coupons/${id}`,
      payload
    )
    return response.data.data
  },

  /** Hapus kupon promo */
  deleteCoupon: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/coupons/${id}`)
  },
}
