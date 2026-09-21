export interface AuthUser {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  token: string
  user: AuthUser
}

export interface MeResponse {
  user: AuthUser
}

export interface LogoutResponse {
  message: string
}
