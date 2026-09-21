import { apiClient } from "@/lib/axios"
import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import type {
  Client,
  ClientQueryParams,
  CreateClientPayload,
  UpdateClientPayload,
} from "../@types/client"

export const clientApi = {
  /** Fetch paginated list of clients */
  getClients: async (
    params?: ClientQueryParams
  ): Promise<PaginatedResponse<Client>> => {
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
    if (params?.sort_by) {
      cleanParams.sort_by = params.sort_by
    }
    if (params?.sort_order) {
      cleanParams.sort_order = params.sort_order
    }

    const response = await apiClient.get<PaginatedResponse<Client>>(
      "/api/v1/admin/clients",
      { params: cleanParams }
    )
    return response.data
  },

  /** Fetch single client by ID */
  getClientById: async (id: string): Promise<Client> => {
    const response = await apiClient.get<ApiResponse<Client>>(
      `/api/v1/admin/clients/${id}`
    )
    return response.data.data
  },

  /** Create a new client */
  createClient: async (payload: CreateClientPayload): Promise<Client> => {
    const response = await apiClient.post<ApiResponse<Client>>(
      "/api/v1/admin/clients",
      payload
    )
    return response.data.data
  },

  /** Update an existing client */
  updateClient: async (
    id: string,
    payload: UpdateClientPayload
  ): Promise<Client> => {
    const response = await apiClient.put<ApiResponse<Client>>(
      `/api/v1/admin/clients/${id}`,
      payload
    )
    return response.data.data
  },

  /** Delete a client */
  deleteClient: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/clients/${id}`)
  },
}
