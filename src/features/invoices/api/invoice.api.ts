import { apiClient } from "@/lib/axios"
import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import type {
  Invoice,
  InvoiceQueryParams,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  MarkPaidPayload,
} from "../@types/invoice"

export const invoiceApi = {
  /** Fetch paginated list of invoices with filters */
  getInvoices: async (
    params?: InvoiceQueryParams
  ): Promise<PaginatedResponse<Invoice>> => {
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
    if (params?.status && params.status !== "all") {
      cleanParams.status = params.status
    }
    if (params?.client_id) {
      cleanParams.client_id = params.client_id
    }

    const response = await apiClient.get<PaginatedResponse<Invoice>>(
      "/api/v1/admin/invoices",
      { params: cleanParams }
    )
    return response.data
  },

  /** Fetch single invoice detail by ID */
  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<ApiResponse<Invoice>>(
      `/api/v1/admin/invoices/${id}`
    )
    return response.data.data
  },

  /** Create a new invoice */
  createInvoice: async (payload: CreateInvoicePayload): Promise<Invoice> => {
    const response = await apiClient.post<ApiResponse<Invoice>>(
      "/api/v1/admin/invoices",
      payload
    )
    return response.data.data
  },

  /** Update an existing invoice */
  updateInvoice: async (
    id: string,
    payload: UpdateInvoicePayload
  ): Promise<Invoice> => {
    const response = await apiClient.put<ApiResponse<Invoice>>(
      `/api/v1/admin/invoices/${id}`,
      payload
    )
    return response.data.data
  },

  /** Mark invoice as paid with optional license extension */
  markInvoiceAsPaid: async (
    id: string,
    payload: MarkPaidPayload
  ): Promise<Invoice> => {
    const response = await apiClient.post<ApiResponse<Invoice>>(
      `/api/v1/admin/invoices/${id}/mark-paid`,
      payload
    )
    return response.data.data
  },

  /** Delete an invoice */
  deleteInvoice: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/invoices/${id}`)
  },
}
