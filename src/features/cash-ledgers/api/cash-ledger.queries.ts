"use client"

import { useQuery } from "@tanstack/react-query"
import { CASH_QUERY_ROOTS } from "@/features/cashflow/constants/cash-query-roots"
import { cashLedgerApi } from "./cash-ledger.api"
import type { CashLedgerQueryParams } from "../@types/cash-ledger"

export const cashLedgerKeys = {
  all: [CASH_QUERY_ROOTS.ledgers] as const,
  lists: () => [...cashLedgerKeys.all, "list"] as const,
  list: (params?: CashLedgerQueryParams) =>
    [...cashLedgerKeys.lists(), params] as const,
}

export function useCashLedgers(params?: CashLedgerQueryParams) {
  return useQuery({
    queryKey: cashLedgerKeys.list(params),
    queryFn: () => cashLedgerApi.getCashLedgers(params),
    staleTime: 30_000,
  })
}
