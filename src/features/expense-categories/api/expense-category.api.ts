import { apiClient } from "@/lib/axios"
import type { ApiResponse } from "@/@types/api"
import type {
  CreateExpenseCategoryPayload,
  ExpenseCategory,
  ExpenseCategoryQueryParams,
  UpdateExpenseCategoryPayload,
} from "../@types/expense-category"

const EXPENSE_CATEGORIES_ENDPOINT = "/api/v1/admin/expense-categories"

export const expenseCategoryApi = {
  /** Ambil seluruh daftar kategori pengeluaran (non-paginated) */
  getExpenseCategories: async (
    params?: ExpenseCategoryQueryParams
  ): Promise<ApiResponse<ExpenseCategory[]>> => {
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

    const response = await apiClient.get<ApiResponse<ExpenseCategory[]>>(
      EXPENSE_CATEGORIES_ENDPOINT,
      { params: cleanParams }
    )
    return response.data
  },

  /** Ambil detail kategori pengeluaran */
  getExpenseCategoryById: async (id: number): Promise<ExpenseCategory> => {
    const response = await apiClient.get<ApiResponse<ExpenseCategory>>(
      `${EXPENSE_CATEGORIES_ENDPOINT}/${id}`
    )
    return response.data.data
  },

  /** Tambah kategori pengeluaran baru */
  createExpenseCategory: async (
    payload: CreateExpenseCategoryPayload
  ): Promise<ExpenseCategory> => {
    const response = await apiClient.post<ApiResponse<ExpenseCategory>>(
      EXPENSE_CATEGORIES_ENDPOINT,
      payload
    )
    return response.data.data
  },

  /** Perbarui kategori pengeluaran */
  updateExpenseCategory: async (
    id: number,
    payload: UpdateExpenseCategoryPayload
  ): Promise<ExpenseCategory> => {
    const response = await apiClient.put<ApiResponse<ExpenseCategory>>(
      `${EXPENSE_CATEGORIES_ENDPOINT}/${id}`,
      payload
    )
    return response.data.data
  },

  /** Hapus kategori pengeluaran (gagal 422 jika sudah dipakai transaksi pengeluaran) */
  deleteExpenseCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`${EXPENSE_CATEGORIES_ENDPOINT}/${id}`)
  },
}
