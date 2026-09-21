"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { invoiceApi } from "./invoice.api"
import type {
  InvoiceQueryParams,
  MarkPaidPayload,
} from "../@types/invoice"
import { dashboardKeys } from "@/features/dashboard/api/dashboard.queries"
import { clientKeys } from "@/features/clients/api/client.queries"
import { licenseKeys } from "@/features/licenses/api/license.queries"

export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (params?: InvoiceQueryParams) =>
    [...invoiceKeys.lists(), params] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
}

export function useInvoices(params?: InvoiceQueryParams) {
  return useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn: () => invoiceApi.getInvoices(params),
    staleTime: 30_000,
  })
}

export function useInvoice(id: string, enabled = true) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoiceApi.getInvoiceById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
  })
}

export function useMarkInvoiceAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MarkPaidPayload }) =>
      invoiceApi.markInvoiceAsPaid(id, payload),
    onSuccess: () => {
      toast.success("Invoice berhasil ditandai lunas")
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menandai invoice lunas")
    },
  })
}

export function useCancelInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => invoiceApi.cancelInvoice(id),
    onSuccess: () => {
      toast.success("Invoice berhasil dibatalkan")
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membatalkan invoice")
    },
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => invoiceApi.deleteInvoice(id),
    onSuccess: () => {
      toast.success("Invoice berhasil dihapus")
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus invoice")
    },
  })
}
