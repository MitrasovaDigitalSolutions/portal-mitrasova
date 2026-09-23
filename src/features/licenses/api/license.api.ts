import { apiClient } from "@/lib/axios"
import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import type { Invoice } from "@/features/invoices/@types/invoice"
import type {
  License,
  LicenseQueryParams,
  CreateLicensePayload,
  UpdateLicensePayload,
  ExtendLicensePayload,
  CreateLicenseOrderPayload,
  SyncLicenseAddonsPayload,
  RegenerateSecretResponse,
  CheckCouponPayload,
  CheckCouponResponse,
} from "../@types/license"

export const licenseApi = {
  /** Fetch paginated list of licenses with optional filters */
  getLicenses: async (
    params?: LicenseQueryParams
  ): Promise<PaginatedResponse<License>> => {
    const cleanParams: Record<string, string | number> = {}
    if (params?.page) {
      cleanParams.page = params.page
    }
    if (params?.per_page) {
      cleanParams.per_page = params.per_page
    }
    if (params?.search && params.search.trim() !== "") {
      cleanParams.search = params.search.trim()
    }
    if (params?.client_id) {
      cleanParams.client_id = params.client_id
    }
    if (params?.product_id) {
      cleanParams.product_id = params.product_id
    }
    if (params?.product_code) {
      cleanParams.product_code = params.product_code
    }
    if (params?.server_package_id) {
      cleanParams.server_package_id = params.server_package_id
    }
    if (params?.addon_code) {
      cleanParams.addon_code = params.addon_code
    }
    if (params?.expiring_days) {
      cleanParams.expiring_days = params.expiring_days
    }
    if (params?.expires_from) {
      cleanParams.expires_from = params.expires_from
    }
    if (params?.expires_to) {
      cleanParams.expires_to = params.expires_to
    }
    if (params?.created_from) {
      cleanParams.created_from = params.created_from
    }
    if (params?.created_to) {
      cleanParams.created_to = params.created_to
    }
    if (params?.sort_by) {
      cleanParams.sort_by = params.sort_by
    }
    if (params?.sort_order) {
      cleanParams.sort_order = params.sort_order
    }
    if (params?.status && params.status !== "all") {
      cleanParams.status = params.status
    }
    if (params?.subscription_type && params.subscription_type !== "all") {
      cleanParams.subscription_type = params.subscription_type
    }

    const response = await apiClient.get<PaginatedResponse<License>>(
      "/api/v1/admin/licenses",
      { params: cleanParams }
    )
    return response.data
  },

  /** Fetch single license detail by ID */
  getLicenseById: async (id: string): Promise<License> => {
    const response = await apiClient.get<ApiResponse<License>>(
      `/api/v1/admin/licenses/${id}`
    )
    return response.data.data
  },

  /** Create a new license */
  createLicense: async (payload: CreateLicensePayload): Promise<License> => {
    const response = await apiClient.post<ApiResponse<License>>(
      "/api/v1/admin/licenses",
      payload
    )
    return response.data.data
  },

  /** Update an existing license */
  updateLicense: async (
    id: string,
    payload: UpdateLicensePayload
  ): Promise<License> => {
    const response = await apiClient.put<ApiResponse<License>>(
      `/api/v1/admin/licenses/${id}`,
      payload
    )
    return response.data.data
  },

  /** Delete a license */
  deleteLicense: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/licenses/${id}`)
  },

  /** Regenerate license secret token */
  regenerateSecret: async (id: string): Promise<RegenerateSecretResponse> => {
    const response = await apiClient.post<ApiResponse<RegenerateSecretResponse>>(
      `/api/v1/admin/licenses/${id}/regenerate-secret`
    )
    return response.data.data
  },

  /** Reset domain & IP binding */
  resetDomainBinding: async (id: string): Promise<License> => {
    const response = await apiClient.post<ApiResponse<License>>(
      `/api/v1/admin/licenses/${id}/reset-domain`
    )
    return response.data.data
  },

  /** Sync addons for a license */
  syncAddons: async (
    id: string,
    payload: SyncLicenseAddonsPayload
  ): Promise<License> => {
    const response = await apiClient.post<ApiResponse<License>>(
      `/api/v1/admin/licenses/${id}/addons`,
      payload
    )
    return response.data.data
  },

  /** Extend license expiration */
  extendExpiry: async (
    id: string,
    payload: ExtendLicensePayload
  ): Promise<License> => {
    const cleanPayload: Record<string, string | number> = {}
    if (payload.days) {cleanPayload.days = payload.days}
    if (payload.months) {cleanPayload.months = payload.months}
    if (payload.years) {cleanPayload.years = payload.years}
    const exactDate = payload.exact_date ?? payload.expires_at
    if (exactDate) {cleanPayload.exact_date = exactDate}

    const response = await apiClient.post<ApiResponse<License>>(
      `/api/v1/admin/licenses/${id}/extend`,
      cleanPayload
    )
    return response.data.data
  },

  /** Create order / renew license or purchase addons via billing endpoint */
  createLicenseOrder: async (
    payload: CreateLicenseOrderPayload
  ): Promise<Invoice> => {
    const response = await apiClient.post<ApiResponse<Invoice>>(
      "/api/v1/license/orders",
      payload
    )
    return response.data.data
  },

  /** Check / validate coupon preview */
  checkCoupon: async (
    payload: CheckCouponPayload
  ): Promise<CheckCouponResponse> => {
    const response = await apiClient.post<ApiResponse<CheckCouponResponse>>(
      "/api/v1/license/coupons/check",
      payload
    )
    return response.data.data
  },
}
