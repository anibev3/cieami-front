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
  code: string
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

// Types pour le système ACL
export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  ADMIN = 'admin',
  CEO = 'ceo',
  EXPERT_MANAGER = 'expert_manager',
  EXPERT = 'expert',
  OPENER = 'opener',
  EDITOR = 'editor',
  VALIDATOR = 'validator',
  ACCOUNTANT = 'accountant',
  INSURER_ADMIN = 'insurer_admin',
  REPAIRER_ADMIN = 'repairer_admin',
  ACCOUNTANT_MANAGER = 'accountant_manager'
}

export enum Permission {
  // User permissions
  VIEW_USER = 'user.view',
  CREATE_USER = 'user.create',
  UPDATE_USER = 'user.update',
  DELETE_USER = 'user.delete',
  ENABLE_USER = 'user.enable',
  DISABLE_USER = 'user.disable',
  RESET_USER = 'user.reset',

  // Assignment permissions
  VIEW_ASSIGNMENT = 'assignment.view',
  CREATE_ASSIGNMENT = 'assignment.create',
  UPDATE_ASSIGNMENT = 'assignment.update',
  REALIZE_ASSIGNMENT = 'assignment.realize',
  EDIT_ASSIGNMENT = 'assignment.edit',
  VALIDATE_ASSIGNMENT = 'assignment.validate',
  CLOSE_ASSIGNMENT = 'assignment.close',
  CANCEL_ASSIGNMENT = 'assignment.cancel',
  GENERATE_ASSIGNMENT = 'assignment.generate',
  DELETE_ASSIGNMENT = 'assignment.delete',
  ASSIGNMENT_STATISTICS = 'assignment.statistics',

  // Invoice permissions
  VIEW_INVOICE = 'invoice.view',
  CREATE_INVOICE = 'invoice.create',
  UPDATE_INVOICE = 'invoice.update',
  CANCEL_INVOICE = 'invoice.cancel',
  GENERATE_INVOICE = 'invoice.generate',
  DELETE_INVOICE = 'invoice.delete',
  INVOICE_STATISTICS = 'invoice.statistics',

  // Payment permissions
  VIEW_PAYMENT = 'payment.view',
  CREATE_PAYMENT = 'payment.create',
  UPDATE_PAYMENT = 'payment.update',
  CANCEL_PAYMENT = 'payment.cancel',
  DELETE_PAYMENT = 'payment.delete',
  PAYMENT_STATISTICS = 'payment.statistics',

  // App permissions
  MANAGE_APP = 'app.manage'
}

export interface RolePermissions {
  [key: string]: Permission[]
}

export interface ACLState {
  userRole: UserRole | null
  userPermissions: Permission[]
  isInitialized: boolean
}

export interface ACLActions {
  setUserRole: (role: UserRole) => void
  setUserPermissions: (permissions: Permission[]) => void
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  hasAllRoles: (roles: UserRole[]) => boolean
  clearACL: () => void
  initializeACL: (user: User) => void
} 