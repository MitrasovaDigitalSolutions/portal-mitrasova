/**
 * Dashboard feature type definitions.
 */

export interface DashboardOverview {
  total_clients: number
  total_products: number
  total_licenses: number
  active_licenses: number
  expired_licenses: number
  unpaid_invoices_count: number
  unpaid_invoices_amount: number
  revenue_this_month: number
}

export interface ExpiringLicenseItem {
  id: string
  client_id: string
  product_id: string
  nama_instance: string
  domain_instance: string
  license_key: string
  license_secret: string
  subscription_type: string
  server_type: string
  status: string
  expires_at: string
  grace_period_days: number
  last_heartbeat_at: string
  last_ip_address: string
  metadata?: unknown[]
  created_at: string
  updated_at: string
}

export interface DashboardMetricsData {
  overview: DashboardOverview
  expiring_soon: ExpiringLicenseItem[]
}

export interface DashboardMetricsResponse {
  status: string
  message: string
  data: DashboardMetricsData
}
