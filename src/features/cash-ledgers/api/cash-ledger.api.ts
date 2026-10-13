import { apiClient } from "@/lib/axios"
import type { PaginatedResponse } from "@/@types/api"
import type { CashLedger, CashLedgerQueryParams } from "../@types/cash-ledger"

const CASH_LEDGERS_ENDPOINT = "/api/v1/admin/cash-ledgers"

export const cashLedgerApi = {
  /** Ambil mutasi buku kas terpaginasi dengan filter */
  getCashLedgers: async (
    params?: CashLedgerQueryParams
  ): Promise<PaginatedResponse<CashLedger>> => {
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
    if (params?.type && params.type !== "") {
      cleanParams.type = params.type
    }
    if (params?.mutation_type && params.mutation_type !== "all") {
      cleanParams.mutation_type = params.mutation_type
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

    const response = await apiClient.get<PaginatedResponse<CashLedger>>(
      CASH_LEDGERS_ENDPOINT,
      { params: cleanParams }
    )
    return response.data
  },
}
