"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CASH_QUERY_ROOTS } from "@/features/cashflow/constants/cash-query-roots"
import { invalidateCashQueries } from "@/features/cashflow/utils/invalidate-cash-queries"
import { cashTransferApi } from "./cash-transfer.api"
import type {
  CashTransferQueryParams,
  CreateCashTransferPayload,
} from "../@types/cash-transfer"

export const cashTransferKeys = {
  all: [CASH_QUERY_ROOTS.transfers] as const,
  lists: () => [...cashTransferKeys.all, "list"] as const,
  list: (params?: CashTransferQueryParams) =>
    [...cashTransferKeys.lists(), params] as const,
  details: () => [...cashTransferKeys.all, "detail"] as const,
  detail: (id: number) => [...cashTransferKeys.details(), id] as const,
}

export function useCashTransfers(params?: CashTransferQueryParams) {
  return useQuery({
    queryKey: cashTransferKeys.list(params),
    queryFn: () => cashTransferApi.getCashTransfers(params),
    staleTime: 30_000,
  })
}

export function useCashTransfer(id: number, enabled = true) {
  return useQuery({
    queryKey: cashTransferKeys.detail(id),
    queryFn: () => cashTransferApi.getCashTransferById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
  })
}

export function useCreateCashTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCashTransferPayload) =>
      cashTransferApi.createCashTransfer(payload),
    onSuccess: (data) => {
      toast.success(
        `Transfer kas ${data.transfer_number || ""} berhasil diproses`
      )
      invalidateCashQueries(queryClient)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memproses transfer kas")
    },
  })
}
