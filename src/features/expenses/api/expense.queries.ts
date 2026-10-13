"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CASH_QUERY_ROOTS } from "@/features/cashflow/constants/cash-query-roots"
import { invalidateCashQueries } from "@/features/cashflow/utils/invalidate-cash-queries"
import { expenseApi } from "./expense.api"
import type {
  CreateExpensePayload,
  ExpenseQueryParams,
} from "../@types/expense"

export const expenseKeys = {
  all: [CASH_QUERY_ROOTS.expenses] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (params?: ExpenseQueryParams) =>
    [...expenseKeys.lists(), params] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: number) => [...expenseKeys.details(), id] as const,
}

export function useExpenses(params?: ExpenseQueryParams) {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => expenseApi.getExpenses(params),
    staleTime: 30_000,
  })
}

export function useExpense(id: number, enabled = true) {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseApi.getExpenseById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateExpensePayload) =>
      expenseApi.createExpense(payload),
    onSuccess: (data) => {
      toast.success(
        `Pengeluaran kas ${data.expense_number || ""} berhasil dicatat`
      )
      invalidateCashQueries(queryClient)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mencatat pengeluaran kas")
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => expenseApi.deleteExpense(id),
    onSuccess: () => {
      toast.success(
        "Pengeluaran berhasil dihapus & saldo kas telah dikembalikan"
      )
      invalidateCashQueries(queryClient)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus catatan pengeluaran")
    },
  })
}
