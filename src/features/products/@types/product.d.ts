/**
 * Product & Product Addon feature type definitions.
 */

export interface ProductAddon {
  id: string
  product_id: string
  code: string
  nama: string
  description: string | null
  harga_bulanan: number
  harga_tahunan: number
  is_active: boolean
  created_at: string
  updated_at: string
  product?: Product
}

export interface Product {
  id: string
  code: string
  nama: string
  description: string | null
  harga_bulanan?: number | null
  harga_tahunan?: number | null
  is_active: boolean
  addons?: ProductAddon[]
  addons_count?: number
  licenses_count?: number
  created_at: string
  updated_at: string
}

export interface ProductQueryParams {
  search?: string
  status?: "all" | "active" | "inactive"
  page?: number
  per_page?: number
}

export interface CreateProductPayload {
  code: string
  nama: string
  description?: string | null
  harga_bulanan?: number | null
  harga_tahunan?: number | null
  is_active?: boolean
}

export interface UpdateProductPayload {
  code?: string
  nama?: string
  description?: string | null
  harga_bulanan?: number | null
  harga_tahunan?: number | null
  is_active?: boolean
}

export interface CreateAddonPayload {
  code: string
  nama: string
  description?: string | null
  harga_bulanan: number
  harga_tahunan: number
  is_active?: boolean
}

export interface UpdateAddonPayload {
  code?: string
  nama?: string
  description?: string | null
  harga_bulanan?: number
  harga_tahunan?: number
  is_active?: boolean
}
