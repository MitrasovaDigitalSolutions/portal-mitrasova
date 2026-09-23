import { apiClient } from "@/lib/axios"
import type { ApiResponse } from "@/@types/api"
import type {
  ServerPackage,
  ServerPackageQueryParams,
  CreateServerPackagePayload,
  UpdateServerPackagePayload,
} from "../@types/server-package"

export const serverPackageApi = {
  /** Ambil daftar seluruh paket server */
  getServerPackages: async (
    params?: ServerPackageQueryParams
  ): Promise<ApiResponse<ServerPackage[]>> => {
    const cleanParams: Record<string, string | number | boolean> = {}

    if (params?.search && params.search.trim() !== "") {
      cleanParams.search = params.search.trim()
    }
    if (params?.is_active !== undefined && params.is_active !== "all") {
      cleanParams.is_active = params.is_active
    }
    if (params?.sort_by) {
      cleanParams.sort_by = params.sort_by
    }
    if (params?.sort_order) {
      cleanParams.sort_order = params.sort_order
    }

    const response = await apiClient.get<ApiResponse<ServerPackage[]>>(
      "/api/v1/admin/server-packages",
      { params: cleanParams }
    )
    return response.data
  },

  /** Ambil detail satu paket server */
  getServerPackageById: async (id: string): Promise<ServerPackage> => {
    const response = await apiClient.get<ApiResponse<ServerPackage>>(
      `/api/v1/admin/server-packages/${id}`
    )
    return response.data.data
  },

  /** Tambah paket server baru */
  createServerPackage: async (
    payload: CreateServerPackagePayload
  ): Promise<ServerPackage> => {
    const response = await apiClient.post<ApiResponse<ServerPackage>>(
      "/api/v1/admin/server-packages",
      payload
    )
    return response.data.data
  },

  /** Perbarui data paket server */
  updateServerPackage: async (
    id: string,
    payload: UpdateServerPackagePayload
  ): Promise<ServerPackage> => {
    const response = await apiClient.put<ApiResponse<ServerPackage>>(
      `/api/v1/admin/server-packages/${id}`,
      payload
    )
    return response.data.data
  },

  /** Hapus paket server */
  deleteServerPackage: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/server-packages/${id}`)
  },
}
