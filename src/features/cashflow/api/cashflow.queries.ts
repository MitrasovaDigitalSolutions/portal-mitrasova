"use client"

import { useQuery } from "@tanstack/react-query"
import { CASH_QUERY_ROOTS } from "../constants/cash-query-roots"
import { cashflowApi } from "./cashflow.api"
import type { CashflowTrendParams } from "../@types/cashflow"

export const cashflowKeys = {
  all: [CASH_QUERY_ROOTS.cashflow] as const,
  summary: (month?: string) => [...cashflowKeys.all, "summary", month] as const,
  trend: (params?: CashflowTrendParams) =>
    [...cashflowKeys.all, "trend", params] as const,
}

export function useCashflowSummary(month?: string) {
  return useQuery({
    queryKey: cashflowKeys.summary(month),
    queryFn: () => cashflowApi.getSummary(month),
    staleTime: 30_000,
  })
}

export function useCashflowTrend(params?: CashflowTrendParams) {
  return useQuery({
    queryKey: cashflowKeys.trend(params),
    queryFn: () => cashflowApi.getTrend(params),
    staleTime: 30_000,
  })
}
