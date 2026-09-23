/**
 * Server Package feature type definitions.
 */

export interface ServerPackage {
  id: string
  code: string
  nama: string
  cpu: string | null
  ram: string | null
  storage: string | null
  description: string | null
  harga_bulanan: number
  harga_tahunan: number
  is_active: boolean
  licenses_count?: number
  created_at: string
  updated_at: string
}

export interface ServerPackageQueryParams {
  search?: string
  is_active?: boolean | "all"
  sort_by?: "nama" | "code" | "harga_bulanan" | "harga_tahunan" | "created_at"
  sort_order?: "asc" | "desc"
}

export interface CreateServerPackagePayload {
  code: string
  nama: string
  cpu?: string | null
  ram?: string | null
  storage?: string | null
  description?: string | null
  harga_bulanan: number
  harga_tahunan: number
  is_active?: boolean
}

export interface UpdateServerPackagePayload {
  code?: string
  nama?: string
  cpu?: string | null
  ram?: string | null
  storage?: string | null
  description?: string | null
  harga_bulanan?: number
  harga_tahunan?: number
  is_active?: boolean
}
