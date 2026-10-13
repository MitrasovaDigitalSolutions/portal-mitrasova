import { apiClient } from "@/lib/axios"
import type { ApiResponse } from "@/@types/api"
import type {
  CashAccount,
  CashAccountQueryParams,
  CashAdjustmentDirection,
  CashAdjustmentPayload,
  CashAdjustmentResult,
  CreateCashAccountPayload,
  UpdateCashAccountPayload,
} from "../@types/cash-account"

const CASH_ACCOUNTS_ENDPOINT = "/api/v1/admin/cash-accounts"

export const cashAccountApi = {
  /** Ambil daftar akun kas (tidak dipaginasi oleh BE) */
  getCashAccounts: async (
    params?: CashAccountQueryParams
  ): Promise<ApiResponse<CashAccount[]>> => {
    const cleanParams: Record<string, string | boolean> = {}

    if (params?.search && params.search.trim() !== "") {
      cleanParams.search = params.search.trim()
    }
    if (params?.is_active !== undefined) {
      cleanParams.is_active = params.is_active
    }
    if (params?.sort_by) {
      cleanParams.sort_by = params.sort_by
    }
    if (params?.sort_order) {
      cleanParams.sort_order = params.sort_order
    }

    const response = await apiClient.get<ApiResponse<CashAccount[]>>(
      CASH_ACCOUNTS_ENDPOINT,
      { params: cleanParams }
    )
    return response.data
  },

  /** Tambah akun kas baru */
  createCashAccount: async (
    payload: CreateCashAccountPayload
  ): Promise<CashAccount> => {
    const response = await apiClient.post<ApiResponse<CashAccount>>(
      CASH_ACCOUNTS_ENDPOINT,
      payload
    )
    return response.data.data
  },

  /** Perbarui akun kas (saldo awal tidak dapat diubah) */
  updateCashAccount: async (
    id: number,
    payload: UpdateCashAccountPayload
  ): Promise<CashAccount> => {
    const response = await apiClient.put<ApiResponse<CashAccount>>(
      `${CASH_ACCOUNTS_ENDPOINT}/${id}`,
      payload
    )
    return response.data.data
  },

  /** Hapus akun kas (ditolak BE jika sudah punya mutasi) */
  deleteCashAccount: async (id: number): Promise<void> => {
    await apiClient.delete(`${CASH_ACCOUNTS_ENDPOINT}/${id}`)
  },

  /** Penyesuaian saldo manual: debit (kurangi) atau credit (tambah) */
  adjustCashAccount: async (
    id: number,
    direction: CashAdjustmentDirection,
    payload: CashAdjustmentPayload
  ): Promise<CashAdjustmentResult> => {
    const response = await apiClient.post<ApiResponse<CashAdjustmentResult>>(
      `${CASH_ACCOUNTS_ENDPOINT}/${id}/${direction}`,
      payload
    )
    return response.data.data
  },
}
