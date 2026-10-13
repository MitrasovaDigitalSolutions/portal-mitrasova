/**
 * Cash Transfer feature type definitions.
 */

import type { CashAccount } from "@/features/cash-accounts/@types/cash-account"

export interface CashTransferUser {
  id: number
  name: string
  email?: string
}

export interface CashTransfer {
  id: number
  transfer_number: string
  from_cash_account_id: number
  to_cash_account_id: number
  amount: number
  admin_fee: number
  transfer_date: string
  notes: string | null
  created_by?: number | null
  created_at: string
  updated_at: string
  from_account?: CashAccount
  fromAccount?: CashAccount
  to_account?: CashAccount
  toAccount?: CashAccount
  creator?: CashTransferUser | null
}

export interface CashTransferQueryParams {
  page?: number
  per_page?: number
  cash_account_id?: number | string
  date_from?: string
  date_to?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
}

export interface CreateCashTransferPayload {
  from_cash_account_id: number
  to_cash_account_id: number
  amount: number
  admin_fee?: number
  transfer_date?: string
  notes?: string | null
}
