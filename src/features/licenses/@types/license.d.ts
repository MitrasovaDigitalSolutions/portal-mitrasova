import type { PaginationParams } from "@/@types/api"
import type { Invoice } from "@/features/invoices/@types/invoice"
import type { Client } from "@/features/clients/@types/client"
import type { ServerPackage } from "@/features/server-packages/@types/server-package"

export type LicenseSubscriptionType =
  | "monthly"
  | "annual"
  | "lifetime"
  | "yearly"
  | "trial"

export type LicenseServerType =
  | "cloud"
  | "cloud_dedicated"
  | "cloud_shared"
  | "self_hosted"
  | "dedicated"
  | "vps"
  | "shared"
  | "on_premise"
  | (string & {})

export type LicenseStatus = "active" | "suspended" | "expired" | "trial"

export type LicenseAddonStatus = "active" | "inactive" | "disabled" | "expired"

export interface LicenseProductInfo {
  id: string
  code: string
  nama: string
  description?: string | null
  deskripsi?: string | null
  harga_bulanan?: number | null
  harga_tahunan?: number | null
}

export interface ProductAddonInfo {
  id: string
  product_id: string
  code: string
  nama: string
  description?: string | null
  harga_bulanan?: number
  harga_tahunan?: number
  harga?: number
  is_purchasable?: boolean
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
  server_package_id?: string | null
  server_notes?: string | null
  server_type?: LicenseServerType
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
  serverPackage?: ServerPackage | null
  server_package?: ServerPackage | null
  licenseAddons?: LicenseAddon[]
  license_addons?: LicenseAddon[]
  handshakeLogs?: LicenseHandshakeLog[]
  invoices?: Invoice[]
}

export interface LicenseQueryParams extends PaginationParams {
  client_id?: string
  product_id?: string
  product_code?: string
  status?: LicenseStatus | "all"
  subscription_type?: LicenseSubscriptionType | "all"
  server_package_id?: string
  addon_code?: string
  expiring_days?: number
  expires_from?: string
  expires_to?: string
  created_from?: string
  created_to?: string
  search?: string
  sort_by?: "created_at" | "expires_at" | "nama_instance" | "status"
  sort_order?: "asc" | "desc"
}

export interface CreateLicensePayload {
  client_id: string
  product_id: string
  nama_instance: string
  domain_instance?: string | null
  subscription_type: LicenseSubscriptionType
  server_package_id: string
  server_notes?: string | null
  server_type?: string
  status?: LicenseStatus
  expires_at?: string | null
  grace_period_days?: number
  addon_ids?: string[]
  create_invoice?: boolean
  billing_period?: "monthly" | "annual"
  discount_amount?: number | string | null
  discount_description?: string | null
  coupon_code?: string | null
  metadata?: Record<string, unknown>
}

export interface UpdateLicensePayload {
  product_id?: string
  nama_instance?: string
  domain_instance?: string | null
  subscription_type?: LicenseSubscriptionType
  server_package_id?: string
  server_notes?: string | null
  server_type?: LicenseServerType
  status?: LicenseStatus
  expires_at?: string | null
  grace_period_days?: number
  metadata?: Record<string, unknown>
}

export interface ExtendLicensePayload {
  days?: number
  months?: number
  years?: number
  exact_date?: string | null
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
  license_key?: string
  license_secret: string
}

export interface CreateLicenseOrderPayload {
  license_key: string
  billing_period: "monthly" | "annual"
  include_base_product?: boolean
  include_server?: boolean
  server_package_id?: string
  addon_ids?: string[]
  coupon_code?: string
}

export interface CheckCouponPayload {
  license_key: string
  coupon_code: string
  billing_period: "monthly" | "annual"
  include_base_product?: boolean
  include_server?: boolean
  server_package_id?: string
  addon_ids?: string[]
}

export interface CheckCouponResponse {
  valid: boolean
  coupon: {
    code: string
    name: string
    discount_type: string
    discount_value: number
    discount_amount: number
    formatted_discount: string
    subtotal: number
    final_amount: number
  }
}

export interface ToggleLicenseAddonPayload {
  status?: "active" | "disabled"
  is_enabled?: boolean
  product_addon_id?: string
  addon_id?: string
  addon_code?: string
}

export interface ToggleLicenseAddonResponse {
  license_addon_id: string
  product_addon_id: string
  addon_code: string
  addon_name: string
  status: LicenseAddonStatus
  is_enabled: boolean
  expires_at: string | null
  days_remaining: number | null
  active_addons: string[]
}

