import type { PaginationParams } from "@/@types/api"
import type { License } from "./license"

export interface Client {
  id: string
  nama_pemilik: string
  email: string
  telepon: string
  nama_perusahaan: string
  alamat: string
  created_at: string
  updated_at: string
  licenses_count?: number
  active_licenses_count?: number
  licenses?: License[]
}

export interface ClientQueryParams extends PaginationParams {
  search?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
}

export interface CreateClientPayload {
  nama_pemilik: string
  email: string
  telepon: string
  nama_perusahaan: string
  alamat: string
}

export interface UpdateClientPayload {
  nama_pemilik?: string
  email?: string
  telepon?: string
  nama_perusahaan?: string
  alamat?: string
}

export interface ClientMetrics {
  totalClients: number
  activeClients: number
  totalLicenses: number
  expiredLicenses: number
}
