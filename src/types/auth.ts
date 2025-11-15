export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  token_name: string
  expires_at: string
}

export interface EntityType {
  id: string
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Status {
  id: string
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Entity {
  id: string
  code: string
  name: string
  prefix: string | null | undefined
  suffix: string | null | undefined
  email: string
  telephone: string | null | undefined
  address: string | null | undefined
  taxpayer_account_number: string | null | undefined
  service_description: string | null | undefined
  footer_description: string | null | undefined
  description: string | null | undefined
  logo: string | null | undefined
  entity_type: EntityType
  created_at: string | null | undefined
  updated_at: string | null | undefined
}

export interface Role {
  name: string
  label: string
  description: string
}

export interface User {
  id: string
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
  signature: string | null
  status: Status
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
  EXPERT_ADMIN = 'expert_admin',
  CEO = 'ceo',
  EXPERT_MANAGER = 'expert_manager',
  EXPERT = 'expert',
  OPENER = 'opener',
  EDITOR_MANAGER = 'editor_manager',
  EDITOR = 'editor',
  VALIDATOR = 'validator',
  ACCOUNTANT_MANAGER = 'accountant_manager',
  ACCOUNTANT = 'accountant',
  BUSINESS_DEVELOPER = 'business_developer',
  INSURER_ADMIN = 'insurer_admin',
  INSURER_STANDARD_USER = 'insurer_standard_user',
  REPAIRER_ADMIN = 'repairer_admin',
  REPAIRER_STANDARD_USER = 'repairer_standard_user',
  CLIENT = 'client',
  UNASSIGNED = 'unassigned'
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
  CREATE_WORKSHEET = 'assignment.create_worksheet',
  CREATE_QUOTE = 'assignment.create_quote',
  VALIDATE_QUOTE = 'assignment.validate_quote',
  CANCEL_QUOTE = 'assignment.cancel_quote',

  // Assignment request permissions
  VIEW_ASSIGNMENT_REQUEST = 'assignment_request.view',
  ACCEPT_ASSIGNMENT_REQUEST = 'assignment_request.accept',
  REJECT_ASSIGNMENT_REQUEST = 'assignment_request.reject',

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
  userEntityType: string | null
  isInitialized: boolean
}

export interface ACLActions {
  setUserRole: (role: UserRole) => void
  setUserPermissions: (permissions: Permission[]) => void
  setUserEntityType: (entityType: string) => void
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  hasAllRoles: (roles: UserRole[]) => boolean
  hasEntityType: (entityType: string) => boolean
  hasAnyEntityType: (entityTypes: string[]) => boolean
  clearACL: () => void
  initializeACL: (user: User) => void
} 


