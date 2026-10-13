"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CASH_QUERY_ROOTS } from "@/features/cashflow/constants/cash-query-roots"
import { expenseCategoryApi } from "./expense-category.api"
import type {
  CreateExpenseCategoryPayload,
  ExpenseCategoryQueryParams,
  UpdateExpenseCategoryPayload,
} from "../@types/expense-category"

export const expenseCategoryKeys = {
  all: [CASH_QUERY_ROOTS.expenseCategories] as const,
  lists: () => [...expenseCategoryKeys.all, "list"] as const,
  list: (params?: ExpenseCategoryQueryParams) =>
    [...expenseCategoryKeys.lists(), params] as const,
  details: () => [...expenseCategoryKeys.all, "detail"] as const,
  detail: (id: number) => [...expenseCategoryKeys.details(), id] as const,
}

export function useExpenseCategories(params?: ExpenseCategoryQueryParams) {
  return useQuery({
    queryKey: expenseCategoryKeys.list(params),
    queryFn: () => expenseCategoryApi.getExpenseCategories(params),
    staleTime: 30_000,
  })
}

export function useExpenseCategory(id: number, enabled = true) {
  return useQuery({
    queryKey: expenseCategoryKeys.detail(id),
    queryFn: () => expenseCategoryApi.getExpenseCategoryById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
  })
}

export function useCreateExpenseCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateExpenseCategoryPayload) =>
      expenseCategoryApi.createExpenseCategory(payload),
    onSuccess: (data) => {
      toast.success(`Kategori pengeluaran "${data.name}" berhasil dibuat`)
      void queryClient.invalidateQueries({ queryKey: expenseCategoryKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat kategori pengeluaran")
    },
  })
}

export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateExpenseCategoryPayload
    }) => expenseCategoryApi.updateExpenseCategory(id, payload),
    onSuccess: (data) => {
      toast.success(`Kategori "${data.name}" berhasil diperbarui`)
      void queryClient.invalidateQueries({ queryKey: expenseCategoryKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui kategori pengeluaran")
    },
  })
}

export function useDeleteExpenseCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => expenseCategoryApi.deleteExpenseCategory(id),
    onSuccess: () => {
      toast.success("Kategori pengeluaran berhasil dihapus")
      void queryClient.invalidateQueries({ queryKey: expenseCategoryKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus kategori pengeluaran")
    },
  })
}
