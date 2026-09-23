export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  INVOICES: "/invoices",
  CLIENTS: "/clients",
  LICENSES: "/licenses",
  LICENSE_CREATE: "/licenses/create",
  PRODUCTS: "/products",
  SERVER_PACKAGES: "/server-packages",
  COUPONS: "/coupons",
  ADMIN: "/admin",
  SETTINGS: "/settings",
  USERS: "/users",
  PROFILE: "/profile",
} as const

export const PUBLIC_ROUTES = ["/api/auth"] as const

export const AUTH_ROUTES = [ROUTES.LOGIN] as const

export const DEFAULT_LOGIN_REDIRECT = ROUTES.DASHBOARD
