import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import { apiClient } from "@/lib/axios"
import type {
  Invoice,
  InvoiceQueryParams,
  MarkPaidPayload
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
    if (params?.license_id) {
      cleanParams.license_id = params.license_id
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

  /** Cancel an unpaid invoice */
  cancelInvoice: async (id: string): Promise<Invoice> => {
    const response = await apiClient.post<ApiResponse<Invoice>>(
      `/api/v1/admin/invoices/${id}/cancel`
    )
    return response.data.data
  },

  /** Download / stream invoice PDF */
  downloadPdf: async (id: string, invoiceNumber: string): Promise<void> => {
    const response = await apiClient.get(
      `/api/v1/admin/invoices/${id}/pdf`,
      { responseType: "blob" }
    )
    const blob = new Blob([response.data as BlobPart], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const safeNumber = invoiceNumber.replace(/\//g, "-")
    link.download = `Invoice-${safeNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  /** Delete an unpaid invoice */
  deleteInvoice: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/invoices/${id}`)
  },
}
