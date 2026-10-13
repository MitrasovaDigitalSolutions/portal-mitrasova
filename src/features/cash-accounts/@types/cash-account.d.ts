/**
 * Cash Account (Akun Kas) feature type definitions.
 */

export type CashAccountType = "bank" | "cash" | "payment_gateway" | "other"

export type CashAccountStatusFilter = "all" | "active" | "inactive"

export type CashAdjustmentDirection = "debit" | "credit"

export interface CashAccount {
  id: number
  name: string
  type: CashAccountType
  account_number: string | null
  opening_balance: number
  current_balance: number
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CashAccountQueryParams {
  search?: string
  is_active?: boolean
  sort_by?: string
  sort_order?: "asc" | "desc"
}

export interface CreateCashAccountPayload {
  name: string
  type: CashAccountType
  account_number?: string | null
  opening_balance?: number
  is_default?: boolean
  is_active?: boolean
}

/** `opening_balance` tidak dapat diubah setelah akun dibuat. */
export interface UpdateCashAccountPayload {
  name?: string
  type?: CashAccountType
  account_number?: string | null
  is_default?: boolean
  is_active?: boolean
}

export interface CashAdjustmentPayload {
  amount: number
  description: string
  transaction_date?: string | null
}

export interface CashAdjustmentResult {
  cash_account: CashAccount
}

export interface CashAccountStats {
  totalBalance: number
  activeCount: number
  totalCount: number
  defaultAccountName: string | null
}
