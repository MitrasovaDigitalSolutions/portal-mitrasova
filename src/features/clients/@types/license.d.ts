import type { PaginationParams } from "@/@types/api"
import type { Client } from "./client"

export type LicenseSubscriptionType =
  | "monthly"
  | "yearly"
  | "lifetime"
  | "trial"

export type LicenseServerType =
  | "cloud"
  | "self_hosted"
  | "dedicated"
  | "vps"
  | "shared"

export type LicenseStatus = "active" | "suspended" | "expired" | "trial"

export type LicenseAddonStatus = "active" | "inactive" | "expired"

export interface LicenseProductInfo {
  id: string
  code: string
  nama: string
  deskripsi?: string | null
}

export interface ProductAddonInfo {
  id: string
  product_id: string
  code: string
  nama: string
  harga: number
}

export interface LicenseAddon {
  id: string
  license_id: string
  product_addon_id: string
  status: LicenseAddonStatus
  expires_at: string | null
  created_at: string
  updated_at: string
  productAddon?: ProductAddonInfo
  product_addon?: ProductAddonInfo
}

export interface LicenseHandshakeLog {
  id: string
  license_id: string
  ip_address: string
  domain: string
  status: string
  payload?: Record<string, unknown> | null
  created_at: string
}

export interface License {
  id: string
  client_id: string
  product_id: string
  nama_instance: string
  domain_instance: string
  license_key: string
  license_secret?: string
  subscription_type: LicenseSubscriptionType
  server_type: LicenseServerType
  status: LicenseStatus
  expires_at: string | null
  grace_period_days: number
  last_heartbeat_at: string | null
  last_ip_address: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  client?: Client
  product?: LicenseProductInfo
  licenseAddons?: LicenseAddon[]
  license_addons?: LicenseAddon[]
  handshakeLogs?: LicenseHandshakeLog[]
}

export interface LicenseQueryParams extends PaginationParams {
  client_id?: string
  product_id?: string
  status?: LicenseStatus | "all"
  subscription_type?: LicenseSubscriptionType | "all"
  search?: string
}

export interface CreateLicensePayload {
  client_id: string
  product_id: string
  nama_instance: string
  domain_instance: string
  subscription_type: LicenseSubscriptionType
  server_type: LicenseServerType
  status?: LicenseStatus
  expires_at?: string | null
  grace_period_days?: number
  metadata?: Record<string, unknown>
}

export interface UpdateLicensePayload {
  product_id?: string
  nama_instance?: string
  domain_instance?: string
  subscription_type?: LicenseSubscriptionType
  server_type?: LicenseServerType
  status?: LicenseStatus
  expires_at?: string | null
  grace_period_days?: number
  metadata?: Record<string, unknown>
}

export interface ExtendLicensePayload {
  days?: number
  months?: number
  expires_at?: string | null
}

export interface SyncLicenseAddonItem {
  product_addon_id: string
  status: LicenseAddonStatus
  expires_at?: string | null
}

export interface SyncLicenseAddonsPayload {
  addons: SyncLicenseAddonItem[]
}

export interface RegenerateSecretResponse {
  license_secret: string
}
