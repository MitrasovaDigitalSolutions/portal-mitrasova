/**
 * Expense Category feature type definitions.
 */

export interface ExpenseCategory {
  id: number
  name: string
  code: string
  description: string | null
  is_active: boolean
  expenses_count?: number
  created_at?: string
  updated_at?: string
}

export interface ExpenseCategoryQueryParams {
  search?: string
  is_active?: boolean
  sort_by?: string
  sort_order?: "asc" | "desc"
}

export interface CreateExpenseCategoryPayload {
  name: string
  code?: string | null
  description?: string | null
  is_active?: boolean
}

export interface UpdateExpenseCategoryPayload {
  name?: string
  code?: string | null
  description?: string | null
  is_active?: boolean
}
