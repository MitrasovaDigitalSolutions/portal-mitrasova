"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { dashboardKeys } from "@/features/dashboard/api/dashboard.queries"
import { clientKeys } from "@/features/clients/api/client.queries"
import { licenseApi } from "./license.api"
import type {
  License,
  LicenseQueryParams,
  CreateLicensePayload,
  UpdateLicensePayload,
  ExtendLicensePayload,
  CreateLicenseOrderPayload,
  SyncLicenseAddonsPayload,
} from "../@types/license"
import type { PaginatedResponse } from "@/@types/api"

export const licenseKeys = {
  all: ["licenses"] as const,
  lists: () => [...licenseKeys.all, "list"] as const,
  list: (params?: LicenseQueryParams) =>
    [...licenseKeys.lists(), params ?? {}] as const,
  details: () => [...licenseKeys.all, "detail"] as const,
  detail: (id: string) => [...licenseKeys.details(), id] as const,
}

/** Hook to fetch paginated list of licenses */
export function useLicenses(params?: LicenseQueryParams) {
  return useQuery<PaginatedResponse<License>>({
    queryKey: licenseKeys.list(params),
    queryFn: () => licenseApi.getLicenses(params),
  })
}

/** Hook to fetch a single license by ID */
export function useLicense(id: string, enabled = true) {
  return useQuery<License>({
    queryKey: licenseKeys.detail(id),
    queryFn: () => licenseApi.getLicenseById(id),
    enabled: Boolean(id) && enabled,
  })
}

/** Hook to issue a new license */
export function useCreateLicense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLicensePayload) =>
      licenseApi.createLicense(payload),
    onSuccess: (newLicense) => {
      toast.success(
        `Lisensi instance "${newLicense.nama_instance}" berhasil diterbitkan`
      )
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: ["invoices"] })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menerbitkan lisensi baru")
    },
  })
}

/** Hook to update a license */
export function useUpdateLicense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateLicensePayload
    }) => licenseApi.updateLicense(id, payload),
    onSuccess: (updatedLicense) => {
      toast.success(
        `Lisensi instance "${updatedLicense.nama_instance}" berhasil diperbarui`
      )
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({
        queryKey: licenseKeys.detail(updatedLicense.id),
      })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui data lisensi")
    },
  })
}

/** Hook to delete a license */
export function useDeleteLicense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => licenseApi.deleteLicense(id),
    onSuccess: () => {
      toast.success("Lisensi berhasil dihapus")
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus lisensi")
    },
  })
}

/** Hook to regenerate secret token */
export function useRegenerateLicenseSecret() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => licenseApi.regenerateSecret(id),
    onSuccess: (_, id) => {
      toast.success("License secret baru berhasil digenerate")
      void queryClient.invalidateQueries({
        queryKey: licenseKeys.detail(id),
      })
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal generate secret baru")
    },
  })
}

/** Hook to reset domain/IP binding */
export function useResetLicenseDomain() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => licenseApi.resetDomainBinding(id),
    onSuccess: (_, id) => {
      toast.success("Domain binding instance berhasil di-reset")
      void queryClient.invalidateQueries({
        queryKey: licenseKeys.detail(id),
      })
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal me-reset domain binding")
    },
  })
}

/** Hook to sync addons of a license */
export function useSyncLicenseAddons() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: SyncLicenseAddonsPayload
    }) => licenseApi.syncAddons(id, payload),
    onSuccess: (_, { id }) => {
      toast.success("Modul addon lisensi berhasil diperbarui")
      void queryClient.invalidateQueries({
        queryKey: licenseKeys.detail(id),
      })
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menyinkronkan modul addon")
    },
  })
}

/** Hook to extend license expiry */
export function useExtendLicense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ExtendLicensePayload
    }) => licenseApi.extendExpiry(id, payload),
    onSuccess: (_, { id }) => {
      toast.success("Masa berlaku lisensi berhasil diperpanjang")
      void queryClient.invalidateQueries({
        queryKey: licenseKeys.detail(id),
      })
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperpanjang masa berlaku lisensi")
    },
  })
}

/** Hook to create order for license renewal or addon purchase via billing controller */
export function useCreateLicenseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLicenseOrderPayload) =>
      licenseApi.createLicenseOrder(payload),
    onSuccess: (invoice) => {
      toast.success(
        `Pesanan berhasil dibuat! Tagihan faktur ${invoice.invoice_number} telah diterbitkan.`
      )
      void queryClient.invalidateQueries({ queryKey: licenseKeys.all })
      void queryClient.invalidateQueries({ queryKey: ["invoices"] })
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat pesanan perpanjangan / add-on")
    },
  })
}
