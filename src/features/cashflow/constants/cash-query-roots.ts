/**
 * Root query key seluruh data modul kas.
 * Dipakai bersama agar mutasi di satu fitur dapat menyegarkan fitur lain
 * (saldo akun, ledger, transfer, pengeluaran, dan laporan cashflow).
 */
export const CASH_QUERY_ROOTS = {
  accounts: "cash-accounts",
  ledgers: "cash-ledgers",
  transfers: "cash-transfers",
  expenses: "expenses",
  expenseCategories: "expense-categories",
  cashflow: "cashflow",
} as const
