/**
 * Expense feature type definitions.
 */

import type { CashAccount } from "@/features/cash-accounts/@types/cash-account"
import type { ExpenseCategory } from "@/features/expense-categories/@types/expense-category"

export interface ExpenseCreator {
  id: number
  name: string
  email?: string
}

export interface Expense {
  id: number
  cash_account_id: number
  expense_category_id: number | null
  expense_number: string
  category: string
  amount: number
  transaction_date: string
  notes: string | null
  receipt_path: string | null
  created_by?: number | null
  created_at?: string
  updated_at?: string
  cashAccount?: CashAccount
  cash_account?: CashAccount
  categoryRef?: ExpenseCategory
  category_ref?: ExpenseCategory
  creator?: ExpenseCreator | null
}

export interface ExpenseQueryParams {
  page?: number
  per_page?: number
  expense_category_id?: number | string
  category?: string
  cash_account_id?: number | string
  date_from?: string
  date_to?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
}

export interface CreateExpensePayload {
  cash_account_id: number
  expense_category_id?: number | null
  category?: string | null
  amount: number
  transaction_date?: string | null
  notes?: string | null
  receipt?: File | null
}
