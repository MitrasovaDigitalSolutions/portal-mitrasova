/**
 * Invoice feature type definitions.
 */

export type InvoiceStatus = "unpaid" | "paid" | "cancelled" | "expired"

export interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface InvoiceClientRelation {
  id: string
  nama_pemilik?: string
  nama_usaha?: string
  email?: string
  no_telepon?: string
}

export interface InvoiceProductRelation {
  id: string
  name: string
  code?: string
}

export interface InvoiceLicenseRelation {
  id: string
  nama_instance?: string
  domain_instance?: string
  license_key?: string
  subscription_type?: string
  server_type?: string
  status?: string
  expires_at?: string | null
  product?: InvoiceProductRelation
}

export interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  license_id: string | null
  total_amount: number
  status: InvoiceStatus
  payment_method: string | null
  due_date: string
  paid_at: string | null
  notes: string | null
  items: InvoiceItem[] | null
  created_at: string
  updated_at: string
  client?: InvoiceClientRelation
  license?: InvoiceLicenseRelation
}

export interface InvoiceQueryParams {
  search?: string
  status?: InvoiceStatus | "all"
  client_id?: string
  page?: number
  per_page?: number
}

export interface CreateInvoicePayload {
  client_id: string
  license_id?: string | null
  total_amount: number
  status: InvoiceStatus
  payment_method?: string | null
  due_date: string
  paid_at?: string | null
  notes?: string | null
  items?: InvoiceItem[] | null
}

export interface UpdateInvoicePayload {
  status?: InvoiceStatus
  payment_method?: string | null
  due_date?: string
  paid_at?: string | null
  notes?: string | null
  items?: InvoiceItem[] | null
}

export interface MarkPaidPayload {
  payment_method: string
  paid_at?: string | null
  extend_license?: boolean
  extend_months?: number
}
