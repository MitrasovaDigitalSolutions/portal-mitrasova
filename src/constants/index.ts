/**
 * Global application constants.
 *
 * All magic numbers/strings used across multiple features must be defined here.
 * Feature-specific constants go in features/[name]/constants/.
 */

/** Default pagination configuration. */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
} as const

/** HTTP status codes used for response handling. */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const

/** Local storage / session storage keys. */
export const STORAGE_KEYS = {
  TOKEN: "portal_mitrasova_token",
  REFRESH_TOKEN: "portal_mitrasova_refresh_token",
  THEME: "portal_mitrasova_theme",
} as const

/** Query stale times (in milliseconds) for TanStack Query. */
export const STALE_TIMES = {
  /** 1 minute — for frequently changing data. */
  SHORT: 1 * 60 * 1000,
  /** 5 minutes — default for most data. */
  DEFAULT: 5 * 60 * 1000,
  /** 30 minutes — for rarely changing data. */
  LONG: 30 * 60 * 1000,
  /** 24 hours — for static/reference data. */
  STATIC: 24 * 60 * 60 * 1000,
} as const
