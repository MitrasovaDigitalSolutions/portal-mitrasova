/**
 * Cashflow reporting feature type definitions.
 */

export interface CashflowSummaryAccount {
  id: number
  name: string
  type: string
  account_number: string | null
  current_balance: number
  is_default: boolean
  is_active: boolean
}

export interface CashflowSummary {
  month: string
  total_balance: number
  total_inflow_month: number
  total_outflow_month: number
  net_cashflow_month: number
  accounts: CashflowSummaryAccount[]
}

export interface CashflowTrendPoint {
  period: string
  inflow: number
  outflow: number
  net: number
}

export interface CashflowTrendParams {
  date_from?: string
  date_to?: string
  group_by?: "date" | "month"
}
