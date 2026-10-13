import { apiClient } from "@/lib/axios"
import type { ApiResponse } from "@/@types/api"
import type {
  CashflowSummary,
  CashflowTrendParams,
  CashflowTrendPoint,
} from "../@types/cashflow"

export const cashflowApi = {
  /** Ambil ringkasan arus kas per bulan (default bulan berjalan) */
  getSummary: async (month?: string): Promise<CashflowSummary> => {
    const params: Record<string, string> = {}
    if (month) {
      params.month = month
    }

    const response = await apiClient.get<ApiResponse<CashflowSummary>>(
      "/api/v1/admin/cashflow/summary",
      { params }
    )
    return response.data.data
  },

  /** Ambil tren arus kas harian atau bulanan */
  getTrend: async (
    params?: CashflowTrendParams
  ): Promise<CashflowTrendPoint[]> => {
    const cleanParams: Record<string, string> = {}
    if (params?.date_from) {
      cleanParams.date_from = params.date_from
    }
    if (params?.date_to) {
      cleanParams.date_to = params.date_to
    }
    if (params?.group_by) {
      cleanParams.group_by = params.group_by
    }

    const response = await apiClient.get<ApiResponse<CashflowTrendPoint[]>>(
      "/api/v1/admin/cashflow/trend",
      { params: cleanParams }
    )
    return response.data.data
  },
}
