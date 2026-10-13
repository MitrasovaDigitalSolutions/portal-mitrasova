import type { QueryClient } from "@tanstack/react-query"
import { CASH_QUERY_ROOTS } from "../constants/cash-query-roots"

/**
 * Segarkan seluruh data yang bergantung pada saldo/ledger kas.
 * Panggil setelah mutasi yang mengubah saldo (mark-paid invoice, expense,
 * transfer, adjustment debit/kredit, dll).
 */
export function invalidateCashQueries(queryClient: QueryClient): void {
  const roots = [
    CASH_QUERY_ROOTS.accounts,
    CASH_QUERY_ROOTS.ledgers,
    CASH_QUERY_ROOTS.transfers,
    CASH_QUERY_ROOTS.expenses,
    CASH_QUERY_ROOTS.cashflow,
  ]

  roots.forEach((root) => {
    void queryClient.invalidateQueries({ queryKey: [root] })
  })
}
