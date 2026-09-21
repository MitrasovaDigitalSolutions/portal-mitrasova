import { apiClient } from "@/lib/axios"
import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import type {
  License,
  LicenseQueryParams,
  CreateLicensePayload,
  UpdateLicensePayload,
  ExtendLicensePayload,
  SyncLicenseAddonsPayload,
  RegenerateSecretResponse,
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
    const response = await apiClient.post<ApiResponse<License>>(
      `/api/v1/admin/licenses/${id}/extend`,
      payload
    )
    return response.data.data
  },
}
