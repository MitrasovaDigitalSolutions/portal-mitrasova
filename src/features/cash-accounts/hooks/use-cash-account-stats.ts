"use client"

import { useMemo } from "react"
import { useCashAccounts } from "../api/cash-account.queries"
import type { CashAccountStats } from "../@types/cash-account"

/** Ringkasan seluruh akun kas (tanpa filter) untuk kartu metrik. */
export function useCashAccountStats(): {
  stats: CashAccountStats
  isLoading: boolean
} {
  const { data, isLoading } = useCashAccounts({})

  const stats = useMemo<CashAccountStats>(() => {
    const accounts = data?.data ?? []
    const activeAccounts = accounts.filter((account) => account.is_active)
    const defaultAccount = accounts.find((account) => account.is_default)

    return {
      totalBalance: activeAccounts.reduce(
        (sum, account) => sum + Number(account.current_balance),
        0
      ),
      activeCount: activeAccounts.length,
      totalCount: accounts.length,
      defaultAccountName: defaultAccount?.name ?? null,
    }
  }, [data?.data])

  return { stats, isLoading }
}
