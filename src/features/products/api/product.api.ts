import { apiClient } from "@/lib/axios"
import type { ApiResponse, PaginatedResponse } from "@/@types/api"
import type {
  Product,
  ProductAddon,
  ProductQueryParams,
  CreateProductPayload,
  UpdateProductPayload,
  CreateAddonPayload,
  UpdateAddonPayload,
} from "../@types/product"

export const productApi = {
  /** Fetch paginated list of products */
  getProducts: async (
    params?: ProductQueryParams
  ): Promise<PaginatedResponse<Product>> => {
    const cleanParams: Record<string, string | number> = {}
    if (params?.page) {
      cleanParams.page = params.page
    }
    if (params?.per_page) {
      cleanParams.per_page = params.per_page
    }
    if (params?.search && params.search.trim() !== "") {
      cleanParams.search = params.search.trim()
    }
    if (params?.status === "active") {
      cleanParams.is_active = 1
    } else if (params?.status === "inactive") {
      cleanParams.is_active = 0
    }

    const response = await apiClient.get<PaginatedResponse<Product>>(
      "/api/v1/admin/products",
      { params: cleanParams }
    )
    return response.data
  },

  /** Fetch single product by ID */
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/api/v1/admin/products/${id}`
    )
    return response.data.data
  },

  /** Create a new product */
  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      "/api/v1/admin/products",
      payload
    )
    return response.data.data
  },

  /** Update an existing product */
  updateProduct: async (
    id: string,
    payload: UpdateProductPayload
  ): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(
      `/api/v1/admin/products/${id}`,
      payload
    )
    return response.data.data
  },

  /** Delete a product */
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/products/${id}`)
  },

  // ─── Product Addons ──────────────────────────────────────────────────────────

  /** Fetch all addons for a product */
  getProductAddons: async (productId: string): Promise<ProductAddon[]> => {
    const response = await apiClient.get<ApiResponse<ProductAddon[]>>(
      `/api/v1/admin/products/${productId}/addons`
    )
    return response.data.data
  },

  /** Create an addon for a product */
  createProductAddon: async (
    productId: string,
    payload: CreateAddonPayload
  ): Promise<ProductAddon> => {
    const response = await apiClient.post<ApiResponse<ProductAddon>>(
      `/api/v1/admin/products/${productId}/addons`,
      payload
    )
    return response.data.data
  },

  /** Update an addon */
  updateProductAddon: async (
    productId: string,
    addonId: string,
    payload: UpdateAddonPayload
  ): Promise<ProductAddon> => {
    const response = await apiClient.put<ApiResponse<ProductAddon>>(
      `/api/v1/admin/products/${productId}/addons/${addonId}`,
      payload
    )
    return response.data.data
  },

  /** Delete an addon */
  deleteProductAddon: async (
    productId: string,
    addonId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/api/v1/admin/products/${productId}/addons/${addonId}`
    )
  },
}
