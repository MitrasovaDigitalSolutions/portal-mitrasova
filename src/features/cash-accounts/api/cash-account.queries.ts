"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CASH_QUERY_ROOTS } from "@/features/cashflow/constants/cash-query-roots"
import { invalidateCashQueries } from "@/features/cashflow/utils/invalidate-cash-queries"
import { cashAccountApi } from "./cash-account.api"
import type {
  CashAccountQueryParams,
  CashAdjustmentDirection,
  CashAdjustmentPayload,
  CreateCashAccountPayload,
  UpdateCashAccountPayload,
} from "../@types/cash-account"

export const cashAccountKeys = {
  all: [CASH_QUERY_ROOTS.accounts] as const,
  lists: () => [...cashAccountKeys.all, "list"] as const,
  list: (params: CashAccountQueryParams) =>
    [...cashAccountKeys.lists(), params] as const,
}

export function useCashAccounts(params: CashAccountQueryParams = {}) {
  return useQuery({
    queryKey: cashAccountKeys.list(params),
    queryFn: () => cashAccountApi.getCashAccounts(params),
    staleTime: 30_000,
  })
}

export function useCreateCashAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCashAccountPayload) =>
      cashAccountApi.createCashAccount(payload),
    onSuccess: () => {
      toast.success("Akun kas berhasil ditambahkan")
      invalidateCashQueries(queryClient)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambahkan akun kas")
    },
  })
}

export function useUpdateCashAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateCashAccountPayload
    }) => cashAccountApi.updateCashAccount(id, payload),
    onSuccess: () => {
      toast.success("Akun kas berhasil diperbarui")
      invalidateCashQueries(queryClient)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui akun kas")
    },
  })
}

export function useDeleteCashAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cashAccountApi.deleteCashAccount(id),
    onSuccess: () => {
      toast.success("Akun kas berhasil dihapus")
      invalidateCashQueries(queryClient)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus akun kas")
    },
  })
}

export function useAdjustCashAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      direction,
      payload,
    }: {
      id: number
      direction: CashAdjustmentDirection
      payload: CashAdjustmentPayload
    }) => cashAccountApi.adjustCashAccount(id, direction, payload),
    onSuccess: (_result, variables) => {
      toast.success(
        variables.direction === "credit"
          ? "Kredit kas berhasil dicatat"
          : "Debit kas berhasil dicatat"
      )
      invalidateCashQueries(queryClient)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mencatat penyesuaian kas")
    },
  })
}
