/**
 * Cash Ledger (Buku Kas) feature type definitions.
 */

import type { CashAccount } from "@/features/cash-accounts/@types/cash-account"

export type CashLedgerMutationType = "credit" | "debit"

export type CashLedgerType =
  | "inflow"
  | "outflow"
  | "transfer_in"
  | "transfer_out"
  | "adjustment_in"
  | "adjustment_out"

export type CashLedgerRefType =
  | "invoice"
  | "expense"
  | "cash_transfer"
  | "cash_transfer_admin_fee"
  | "manual_adjustment"
  | "opening_balance"
  | "expense_cancellation"

export interface CashLedgerCreator {
  id: number
  name: string
  email?: string
}

export interface CashLedger {
  id: number
  cash_account_id: number
  type: CashLedgerType | string
  mutation_type: CashLedgerMutationType
  amount: number
  balance_before: number
  balance_after: number
  reference_type: CashLedgerRefType | string | null
  reference_id: string | null
  description: string
  transaction_date: string
  created_by?: number | null
  created_at?: string
  updated_at?: string
  cashAccount?: CashAccount
  cash_account?: CashAccount
  creator?: CashLedgerCreator | null
}

export interface CashLedgerQueryParams {
  page?: number
  per_page?: number
  cash_account_id?: number | string
  type?: string
  mutation_type?: CashLedgerMutationType | "all"
  date_from?: string
  date_to?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
}
