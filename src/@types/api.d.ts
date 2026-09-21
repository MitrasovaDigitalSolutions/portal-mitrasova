/**
 * Shared API response and request type definitions.
 *
 * Conforms to the standard POS-MULTI-STORE and Laravel backend response shapes.
 */

// ─── Generic API Response Types ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  status?: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// ─── Request Types ──────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
}

// ─── Mutation Result ────────────────────────────────────────────────────────

export interface MutationResult<T = unknown> {
  success: boolean
  data?: T
  message?: string
}

// Backward-compatible alias
export type MutationResponse<T = unknown> = MutationResult<T>

// ─── Ambient Global Declarations ────────────────────────────────────────────

declare global {
  interface ApiResponse<T> {
    data: T
    message?: string
    status?: string
  }

  interface PaginationMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }

  interface PaginatedResponse<T> {
    data: T[]
    meta: PaginationMeta
  }

  interface ApiErrorResponse {
    message: string
    errors?: Record<string, string[]>
    status?: number
  }

  interface PaginationParams {
    page?: number
    per_page?: number
    search?: string
    sort_by?: string
    sort_order?: "asc" | "desc"
  }

  interface MutationResult<T = unknown> {
    success: boolean
    data?: T
    message?: string
  }

  type MutationResponse<T = unknown> = MutationResult<T>
}

