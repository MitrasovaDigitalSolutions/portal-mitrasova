import axios from "axios"
import { getSession, signOut } from "next-auth/react"
import { ROUTES } from "@/constants/routes"

/**
 * Configured Axios instance for all API requests.
 *
 * Features:
 * - Base URL from environment variable
 * - Automatic JSON content type
 * - Request interceptor: attaches auth token from NextAuth session
 * - Response interceptor: standardized error handling and 401 redirect
 *
 * @example
 * ```ts
 * import { apiClient } from "@/lib/axios"
 * const response = await apiClient.get<ApiResponse<User>>("/users/me")
 * ```
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15_000,
})

// ─── Request Interceptor ──────────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession()
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`
      }
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const errorData = error.response?.data
      let message = errorData?.message ?? "Terjadi kesalahan pada server."

      // Extract first validation error if present (e.g. 422 Unprocessable Entity)
      if (errorData?.errors && typeof errorData.errors === "object") {
        const firstKey = Object.keys(errorData.errors)[0]
        if (firstKey && errorData.errors[firstKey]?.[0]) {
          message = errorData.errors[firstKey][0]
        }
      }

      // Handle 401 Unauthorized globally
      if (error.response?.status === 401 && typeof window !== "undefined") {
        void signOut({ redirect: true, callbackUrl: ROUTES.LOGIN })
      }

      return Promise.reject(new Error(message))
    }

    return Promise.reject(
      new Error("Terjadi kesalahan jaringan. Silakan coba lagi.")
    )
  }
)
