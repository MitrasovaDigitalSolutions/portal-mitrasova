import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productApi } from "./product.api"
import type {
  Product,
  ProductQueryParams,
  CreateProductPayload,
  UpdateProductPayload,
  CreateAddonPayload,
  UpdateAddonPayload,
} from "../@types/product"
import type { PaginatedResponse } from "@/@types/api"
import { dashboardKeys } from "@/features/dashboard/api/dashboard.queries"

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: ProductQueryParams) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  addons: (productId: string) =>
    [...productKeys.all, "addons", productId] as const,
}

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
    staleTime: 30_000,
  })
}

/** Hook for infinite scrolling product list (used in FormSelect async dropdowns) */
export function useInfiniteProducts(params?: Omit<ProductQueryParams, "page">) {
  return useInfiniteQuery<PaginatedResponse<Product>>({
    queryKey: [...productKeys.lists(), "infinite", params ?? {}] as const,
    queryFn: ({ pageParam }) =>
      productApi.getProducts({
        ...params,
        page: pageParam as number,
        per_page: params?.per_page ?? 8,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta
      return current_page < last_page ? current_page + 1 : undefined
    },
    staleTime: 30_000,
  })
}

export function useProduct(id: string, enabled = true) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      productApi.createProduct(payload),
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan")
      void queryClient.invalidateQueries({ queryKey: productKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambahkan produk")
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateProductPayload
    }) => productApi.updateProduct(id, payload),
    onSuccess: () => {
      toast.success("Produk berhasil diperbarui")
      void queryClient.invalidateQueries({ queryKey: productKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui produk")
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      toast.success("Produk berhasil dihapus")
      void queryClient.invalidateQueries({ queryKey: productKeys.all })
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus produk")
    },
  })
}

// ─── Addon Queries & Mutations ───────────────────────────────────────────────

export function useProductAddons(productId: string, enabled = true) {
  return useQuery({
    queryKey: productKeys.addons(productId),
    queryFn: () => productApi.getProductAddons(productId),
    enabled: Boolean(productId) && enabled,
    staleTime: 30_000,
  })
}

export function useCreateProductAddon(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAddonPayload) =>
      productApi.createProductAddon(productId, payload),
    onSuccess: () => {
      toast.success("Addon berhasil ditambahkan")
      void queryClient.invalidateQueries({
        queryKey: productKeys.addons(productId),
      })
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambahkan addon")
    },
  })
}

export function useUpdateProductAddon(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      addonId,
      payload,
    }: {
      addonId: string
      payload: UpdateAddonPayload
    }) => productApi.updateProductAddon(productId, addonId, payload),
    onSuccess: () => {
      toast.success("Addon berhasil diperbarui")
      void queryClient.invalidateQueries({
        queryKey: productKeys.addons(productId),
      })
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui addon")
    },
  })
}

export function useDeleteProductAddon(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (addonId: string) =>
      productApi.deleteProductAddon(productId, addonId),
    onSuccess: () => {
      toast.success("Addon berhasil dihapus")
      void queryClient.invalidateQueries({
        queryKey: productKeys.addons(productId),
      })
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus addon")
    },
  })
}
