import { apiClient } from "@/lib/axios"
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  LogoutResponse,
} from "../@types/auth"

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/api/v1/admin/auth/login",
      payload
    )
    return response.data
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>("/api/v1/admin/auth/me")
    return response.data
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>(
      "/api/v1/admin/auth/logout"
    )
    return response.data
  },
}
