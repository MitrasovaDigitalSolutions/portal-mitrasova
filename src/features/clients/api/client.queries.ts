import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { dashboardKeys } from "@/features/dashboard/api/dashboard.queries"
import { clientApi } from "./client.api"
import type {
  Client,
  ClientQueryParams,
  CreateClientPayload,
  UpdateClientPayload,
} from "../@types/client"
import type { PaginatedResponse } from "@/@types/api"

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (params?: ClientQueryParams) =>
    [...clientKeys.lists(), params ?? {}] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
}

/** Hook to fetch paginated list of clients */
export function useClients(params?: ClientQueryParams) {
  return useQuery<PaginatedResponse<Client>>({
    queryKey: clientKeys.list(params),
    queryFn: () => clientApi.getClients(params),
  })
}

/** Hook for infinite scrolling client list (used in FormSelect async dropdowns) */
export function useInfiniteClients(params?: Omit<ClientQueryParams, "page">) {
  return useInfiniteQuery<PaginatedResponse<Client>>({
    queryKey: [...clientKeys.lists(), "infinite", params ?? {}] as const,
    queryFn: ({ pageParam }) =>
      clientApi.getClients({
        ...params,
        page: pageParam as number,
        per_page: params?.per_page ?? 8,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta
      return current_page < last_page ? current_page + 1 : undefined
    },
  })
}

/** Hook to fetch a single client by ID */
export function useClient(id: string, enabled = true) {
  return useQuery<Client>({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientApi.getClientById(id),
    enabled: Boolean(id) && enabled,
  })
}

/** Hook to create a new client */
export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateClientPayload) => clientApi.createClient(payload),
    onSuccess: (newClient) => {
      toast.success(`Klien "${newClient.nama_pemilik}" berhasil ditambahkan`)
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambahkan data klien")
    },
  })
}

/** Hook to update an existing client */
export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClientPayload }) =>
      clientApi.updateClient(id, payload),
    onSuccess: (updatedClient) => {
      toast.success(`Data klien "${updatedClient.nama_pemilik}" berhasil diperbarui`)
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({
        queryKey: clientKeys.detail(updatedClient.id),
      })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui data klien")
    },
  })
}

/** Hook to delete a client */
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => clientApi.deleteClient(id),
    onSuccess: () => {
      toast.success("Klien berhasil dihapus")
      void queryClient.invalidateQueries({ queryKey: clientKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus data klien")
    },
  })
}
