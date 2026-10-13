import { apiClient } from "@/lib/axios"
import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import type {
  CreateExpensePayload,
  Expense,
  ExpenseQueryParams,
} from "../@types/expense"

const EXPENSES_ENDPOINT = "/api/v1/admin/expenses"

export const expenseApi = {
  /** Ambil daftar pengeluaran kas terpaginasi dengan filter */
  getExpenses: async (
    params?: ExpenseQueryParams
  ): Promise<PaginatedResponse<Expense>> => {
    const cleanParams: Record<string, string | number> = {}

    if (params?.page) {
      cleanParams.page = params.page
    }
    if (params?.per_page) {
      cleanParams.per_page = params.per_page
    }
    if (params?.expense_category_id) {
      cleanParams.expense_category_id = params.expense_category_id
    }
    if (params?.category) {
      cleanParams.category = params.category
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

    const response = await apiClient.get<PaginatedResponse<Expense>>(
      EXPENSES_ENDPOINT,
      { params: cleanParams }
    )
    return response.data
  },

  /** Ambil detail satu catatan pengeluaran kas */
  getExpenseById: async (id: number): Promise<Expense> => {
    const response = await apiClient.get<ApiResponse<Expense>>(
      `${EXPENSES_ENDPOINT}/${id}`
    )
    return response.data.data
  },

  /** Catat pengeluaran kas baru (mendukung upload struk/bukti) */
  createExpense: async (payload: CreateExpensePayload): Promise<Expense> => {
    const formData = new FormData()
    formData.append("cash_account_id", String(payload.cash_account_id))

    if (payload.expense_category_id) {
      formData.append(
        "expense_category_id",
        String(payload.expense_category_id)
      )
    }
    if (payload.category) {
      formData.append("category", payload.category)
    }
    formData.append("amount", String(payload.amount))

    if (payload.transaction_date) {
      formData.append("transaction_date", payload.transaction_date)
    }
    if (payload.notes) {
      formData.append("notes", payload.notes)
    }
    if (payload.receipt) {
      formData.append("receipt", payload.receipt)
    }

    const response = await apiClient.post<ApiResponse<Expense>>(
      EXPENSES_ENDPOINT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return response.data.data
  },

  /** Hapus pengeluaran kas (mengembalikan saldo akun kas dan menghapus file struk) */
  deleteExpense: async (id: number): Promise<void> => {
    await apiClient.delete(`${EXPENSES_ENDPOINT}/${id}`)
  },
}
