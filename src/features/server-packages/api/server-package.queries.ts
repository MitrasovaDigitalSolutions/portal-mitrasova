import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { serverPackageApi } from "./server-package.api"
import type {
  ServerPackageQueryParams,
  CreateServerPackagePayload,
  UpdateServerPackagePayload,
} from "../@types/server-package"

export const serverPackageKeys = {
  all: ["server-packages"] as const,
  lists: () => [...serverPackageKeys.all, "list"] as const,
  list: (params?: ServerPackageQueryParams) =>
    [...serverPackageKeys.lists(), params] as const,
  details: () => [...serverPackageKeys.all, "detail"] as const,
  detail: (id: string) => [...serverPackageKeys.details(), id] as const,
}

export function useServerPackages(params?: ServerPackageQueryParams) {
  return useQuery({
    queryKey: serverPackageKeys.list(params),
    queryFn: () => serverPackageApi.getServerPackages(params),
    staleTime: 30_000,
  })
}

export function useServerPackage(id: string, enabled = true) {
  return useQuery({
    queryKey: serverPackageKeys.detail(id),
    queryFn: () => serverPackageApi.getServerPackageById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
  })
}

export function useCreateServerPackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateServerPackagePayload) =>
      serverPackageApi.createServerPackage(payload),
    onSuccess: () => {
      toast.success("Paket server berhasil ditambahkan")
      void queryClient.invalidateQueries({ queryKey: serverPackageKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambahkan paket server")
    },
  })
}

export function useUpdateServerPackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateServerPackagePayload
    }) => serverPackageApi.updateServerPackage(id, payload),
    onSuccess: () => {
      toast.success("Paket server berhasil diperbarui")
      void queryClient.invalidateQueries({ queryKey: serverPackageKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui paket server")
    },
  })
}

export function useDeleteServerPackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => serverPackageApi.deleteServerPackage(id),
    onSuccess: () => {
      toast.success("Paket server berhasil dihapus")
      void queryClient.invalidateQueries({ queryKey: serverPackageKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus paket server")
    },
  })
}
