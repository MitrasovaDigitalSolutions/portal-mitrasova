/**
 * Shared API response and request type definitions.
 *
 * All API calls must conform to these standard response shapes
 * for consistent error handling and data access across the app.
 */

/** Standard paginated API response. */
interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/** Pagination metadata returned by the API. */
interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

/** Standard single-item API response. */
interface ApiResponse<T> {
  data: T
  message: string
}

/** Standard API error response. */
interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

/** Standard mutation response (create, update, delete). */
interface MutationResponse<T = null> {
  data: T
  message: string
  success: boolean
}

/** Query parameters for paginated list endpoints. */
interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}
