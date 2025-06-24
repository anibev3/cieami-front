export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  token_name: string
  expires_at: string
}

export interface Entity {
  id: number
  code: string
  name: string
  email: string
  telephone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export interface Role {
  name: string
  label: string
  description: string
}

export interface User {
  id: number
  hash_id: string
  email: string
  username: string
  name: string
  last_name: string
  first_name: string
  telephone: string
  entity: Entity
  photo_url: string
  pending_verification: boolean
  role: Role
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface UserResponse {
  status: number
  message: string | null
  data: User
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  getUserInfo: () => Promise<void>
  clearError: () => void
} 