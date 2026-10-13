import { apiClient } from "@/lib/axios"
import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import type {
  CashTransfer,
  CashTransferQueryParams,
  CreateCashTransferPayload,
} from "../@types/cash-transfer"

const CASH_TRANSFERS_ENDPOINT = "/api/v1/admin/cash-transfers"

export const cashTransferApi = {
  /** Ambil riwayat transfer kas terpaginasi dengan filter */
  getCashTransfers: async (
    params?: CashTransferQueryParams
  ): Promise<PaginatedResponse<CashTransfer>> => {
    const cleanParams: Record<string, string | number> = {}

    if (params?.page) {
      cleanParams.page = params.page
    }
    if (params?.per_page) {
      cleanParams.per_page = params.per_page
    }
    if (params?.cash_account_id) {
      cleanParams.cash_account_id = params.cash_account_id
    }
    if (params?.date_from) {
      cleanParams.date_from = params.date_from
    }
    if (params?.date_to) {
      cleanParams.date_to = params.date_to
    }
    if (params?.sort_by) {
      cleanParams.sort_by = params.sort_by
    }
    if (params?.sort_order) {
      cleanParams.sort_order = params.sort_order
    }

    const response = await apiClient.get<PaginatedResponse<CashTransfer>>(
      CASH_TRANSFERS_ENDPOINT,
      { params: cleanParams }
    )
    return response.data
  },

  /** Ambil detail satu transaksi transfer kas */
  getCashTransferById: async (id: number): Promise<CashTransfer> => {
    const response = await apiClient.get<ApiResponse<CashTransfer>>(
      `${CASH_TRANSFERS_ENDPOINT}/${id}`
    )
    return response.data.data
  },

  /** Proses transfer antar akun kas */
  createCashTransfer: async (
    payload: CreateCashTransferPayload
  ): Promise<CashTransfer> => {
    const response = await apiClient.post<ApiResponse<CashTransfer>>(
      CASH_TRANSFERS_ENDPOINT,
      payload
    )
    return response.data.data
  },
}
