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

    // Assignment request permissions
  VIEW_ASSIGNMENT_REQUEST = 'assignment_request.view',
  CREATE_ASSIGNMENT_REQUEST = 'assignment_request.create',
  UPDATE_ASSIGNMENT_REQUEST = 'assignment_request.update',
  DELETE_ASSIGNMENT_REQUEST = 'assignment_request.delete',
  ACCEPT_ASSIGNMENT_REQUEST = 'assignment_request.accept',
  REJECT_ASSIGNMENT_REQUEST = 'assignment_request.reject',
  CANCEL_ASSIGNMENT_REQUEST = 'assignment_request.cancel',

  // Assignment permissions
  VIEW_ASSIGNMENT = 'assignment.view',
  CREATE_ASSIGNMENT = 'assignment.create',
  UPDATE_ASSIGNMENT = 'assignment.update',
  REALIZE_ASSIGNMENT = 'assignment.realize',
  CREATE_WORKSHEET_ASSIGNMENT = 'assignment.create_worksheet',
  CREATE_QUOTE_ASSIGNMENT = 'assignment.create_quote',
  VALIDATE_QUOTE_ASSIGNMENT = 'assignment.validate_quote',
  CANCEL_QUOTE_ASSIGNMENT = 'assignment.cancel_quote',
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

  // Shock permissions
  VIEW_SHOCK = 'shock.view',
  CREATE_SHOCK = 'shock.create',
  UPDATE_SHOCK = 'shock.update',
  DELETE_SHOCK = 'shock.delete',

  // Shock work permissions
  VIEW_SHOCK_WORK = 'shock_work.view',
  CREATE_SHOCK_WORK = 'shock_work.create',
  UPDATE_SHOCK_WORK = 'shock_work.update',
  DELETE_SHOCK_WORK = 'shock_work.delete',

  // Shock point permissions
  VIEW_SHOCK_POINT = 'shock_point.view',
  CREATE_SHOCK_POINT = 'shock_point.create',
  UPDATE_SHOCK_POINT = 'shock_point.update',
  DELETE_SHOCK_POINT = 'shock_point.delete',

  // Workforce permissions
  VIEW_WORKFORCE = 'workforce.view',
  CREATE_WORKFORCE = 'workforce.create',
  UPDATE_WORKFORCE = 'workforce.update',
  DELETE_WORKFORCE = 'workforce.delete',

  // Workforce type permissions
  VIEW_WORKFORCE_TYPE = 'workforce_type.view',
  CREATE_WORKFORCE_TYPE = 'workforce_type.create',
  UPDATE_WORKFORCE_TYPE = 'workforce_type.update',
  DELETE_WORKFORCE_TYPE = 'workforce_type.delete',
  ENABLE_WORKFORCE_TYPE = 'workforce_type.enable',
  DISABLE_WORKFORCE_TYPE = 'workforce_type.disable',

  // Assignment type permissions
  VIEW_ASSIGNMENT_TYPE = 'assignment_type.view',
  CREATE_ASSIGNMENT_TYPE = 'assignment_type.create',
  UPDATE_ASSIGNMENT_TYPE = 'assignment_type.update',
  DELETE_ASSIGNMENT_TYPE = 'assignment_type.delete',
  ENABLE_ASSIGNMENT_TYPE = 'assignment_type.enable',
  DISABLE_ASSIGNMENT_TYPE = 'assignment_type.disable',

  // Expertise type permissions
  VIEW_EXPERTISE_TYPE = 'expertise_type.view',
  CREATE_EXPERTISE_TYPE = 'expertise_type.create',
  UPDATE_EXPERTISE_TYPE = 'expertise_type.update',
  DELETE_EXPERTISE_TYPE = 'expertise_type.delete',
  ENABLE_EXPERTISE_TYPE = 'expertise_type.enable',
  DISABLE_EXPERTISE_TYPE = 'expertise_type.disable',

  // General state permissions
  VIEW_GENERAL_STATE = 'general_state.view',
  CREATE_GENERAL_STATE = 'general_state.create',
  UPDATE_GENERAL_STATE = 'general_state.update',
  DELETE_GENERAL_STATE = 'general_state.delete',
  ENABLE_GENERAL_STATE = 'general_state.enable',
  DISABLE_GENERAL_STATE = 'general_state.disable',

  // Claim nature permissions
  VIEW_CLAIM_NATURE = 'claim_nature.view',
  CREATE_CLAIM_NATURE = 'claim_nature.create',
  UPDATE_CLAIM_NATURE = 'claim_nature.update',
  DELETE_CLAIM_NATURE = 'claim_nature.delete',
  ENABLE_CLAIM_NATURE = 'claim_nature.enable',
  DISABLE_CLAIM_NATURE = 'claim_nature.disable',

  // Technical conclusion permissions
  VIEW_TECHNICAL_CONCLUSION = 'technical_conclusion.view',
  CREATE_TECHNICAL_CONCLUSION = 'technical_conclusion.create',
  UPDATE_TECHNICAL_CONCLUSION = 'technical_conclusion.update',
  DELETE_TECHNICAL_CONCLUSION = 'technical_conclusion.delete',
  ENABLE_TECHNICAL_CONCLUSION = 'technical_conclusion.enable',
  DISABLE_TECHNICAL_CONCLUSION = 'technical_conclusion.disable',

  // Document transmitted permissions
  VIEW_DOCUMENT_TRANSMITTED = 'document_transmitted.view',
  CREATE_DOCUMENT_TRANSMITTED = 'document_transmitted.create',
  UPDATE_DOCUMENT_TRANSMITTED = 'document_transmitted.update',
  DELETE_DOCUMENT_TRANSMITTED = 'document_transmitted.delete',
  ENABLE_DOCUMENT_TRANSMITTED = 'document_transmitted.enable',
  DISABLE_DOCUMENT_TRANSMITTED = 'document_transmitted.disable',

  // Assignment document permissions
  VIEW_ASSIGNMENT_DOCUMENT = 'assignment_document.view',
  CREATE_ASSIGNMENT_DOCUMENT = 'assignment_document.create',
  UPDATE_ASSIGNMENT_DOCUMENT = 'assignment_document.update',
  DELETE_ASSIGNMENT_DOCUMENT = 'assignment_document.delete',
  ENABLE_ASSIGNMENT_DOCUMENT = 'assignment_document.enable',
  DISABLE_ASSIGNMENT_DOCUMENT = 'assignment_document.disable',

  // Status permissions
  VIEW_STATUS = 'status.view',
  CREATE_STATUS = 'status.create',
  UPDATE_STATUS = 'status.update',
  DELETE_STATUS = 'status.delete',
  ENABLE_STATUS = 'status.enable',
  DISABLE_STATUS = 'status.disable',

  // Role permissions
  VIEW_ROLE = 'role.view',
  CREATE_ROLE = 'role.create',
  UPDATE_ROLE = 'role.update',
  DELETE_ROLE = 'role.delete',

  // Permission permissions
  VIEW_PERMISSION = 'permission.view',
  CREATE_PERMISSION = 'permission.create',
  UPDATE_PERMISSION = 'permission.update',
  DELETE_PERMISSION = 'permission.delete',

  // Entity permissions
  VIEW_ENTITY = 'entity.view',
  CREATE_ENTITY = 'entity.create',
  UPDATE_ENTITY = 'entity.update',
  DELETE_ENTITY = 'entity.delete',
  ENABLE_ENTITY = 'entity.enable',
  DISABLE_ENTITY = 'entity.disable',

  // Entity type permissions
  VIEW_ENTITY_TYPE = 'entity_type.view',
  CREATE_ENTITY_TYPE = 'entity_type.create',
  UPDATE_ENTITY_TYPE = 'entity_type.update',
  DELETE_ENTITY_TYPE = 'entity_type.delete',
  ENABLE_ENTITY_TYPE = 'entity_type.enable',
  DISABLE_ENTITY_TYPE = 'entity_type.disable',

  // Vehicle permissions
  VIEW_VEHICLE = 'vehicle.view',
  CREATE_VEHICLE = 'vehicle.create',
  UPDATE_VEHICLE = 'vehicle.update',
  DELETE_VEHICLE = 'vehicle.delete',

  // Vehicle model permissions
  VIEW_VEHICLE_MODEL = 'vehicle_model.view',
  CREATE_VEHICLE_MODEL = 'vehicle_model.create',
  UPDATE_VEHICLE_MODEL = 'vehicle_model.update',
  DELETE_VEHICLE_MODEL = 'vehicle_model.delete',
  ENABLE_VEHICLE_MODEL = 'vehicle_model.enable',
  DISABLE_VEHICLE_MODEL = 'vehicle_model.disable',

  // Vehicle state permissions
  VIEW_VEHICLE_STATE = 'vehicle_state.view',
  CREATE_VEHICLE_STATE = 'vehicle_state.create',
  UPDATE_VEHICLE_STATE = 'vehicle_state.update',
  DELETE_VEHICLE_STATE = 'vehicle_state.delete',
  ENABLE_VEHICLE_STATE = 'vehicle_state.enable',
  DISABLE_VEHICLE_STATE = 'vehicle_state.disable',

  // Brand permissions
  VIEW_BRAND = 'brand.view',
  CREATE_BRAND = 'brand.create',
  UPDATE_BRAND = 'brand.update',
  DELETE_BRAND = 'brand.delete',
  ENABLE_BRAND = 'brand.enable',
  DISABLE_BRAND = 'brand.disable',

  // Color permissions
  VIEW_COLOR = 'color.view',
  CREATE_COLOR = 'color.create',
  UPDATE_COLOR = 'color.update',
  DELETE_COLOR = 'color.delete',
  ENABLE_COLOR = 'color.enable',
  DISABLE_COLOR = 'color.disable',

  // Number paint element permissions
  VIEW_NUMBER_PAINT_ELEMENT = 'number_paint_element.view',
  CREATE_NUMBER_PAINT_ELEMENT = 'number_paint_element.create',
  UPDATE_NUMBER_PAINT_ELEMENT = 'number_paint_element.update',
  DELETE_NUMBER_PAINT_ELEMENT = 'number_paint_element.delete',
  ENABLE_NUMBER_PAINT_ELEMENT = 'number_paint_element.enable',
  DISABLE_NUMBER_PAINT_ELEMENT = 'number_paint_element.disable',

  // Paint product price permissions
  VIEW_PAINT_PRODUCT_PRICE = 'paint_product_price.view',
  CREATE_PAINT_PRODUCT_PRICE = 'paint_product_price.create',
  UPDATE_PAINT_PRODUCT_PRICE = 'paint_product_price.update',
  DELETE_PAINT_PRODUCT_PRICE = 'paint_product_price.delete',
  ENABLE_PAINT_PRODUCT_PRICE = 'paint_product_price.enable',
  DISABLE_PAINT_PRODUCT_PRICE = 'paint_product_price.disable',

  // Other cost permissions
  VIEW_OTHER_COST = 'other_cost.view',
  CREATE_OTHER_COST = 'other_cost.create',
  UPDATE_OTHER_COST = 'other_cost.update',
  DELETE_OTHER_COST = 'other_cost.delete',
  ENABLE_OTHER_COST = 'other_cost.enable',
  DISABLE_OTHER_COST = 'other_cost.disable',

  // Other cost type permissions
  VIEW_OTHER_COST_TYPE = 'other_cost_type.view',
  CREATE_OTHER_COST_TYPE = 'other_cost_type.create',
  UPDATE_OTHER_COST_TYPE = 'other_cost_type.update',
  DELETE_OTHER_COST_TYPE = 'other_cost_type.delete',
  ENABLE_OTHER_COST_TYPE = 'other_cost_type.enable',
  DISABLE_OTHER_COST_TYPE = 'other_cost_type.disable',

  // Paint type permissions
  VIEW_PAINT_TYPE = 'paint_type.view',
  CREATE_PAINT_TYPE = 'paint_type.create',
  UPDATE_PAINT_TYPE = 'paint_type.update',
  DELETE_PAINT_TYPE = 'paint_type.delete',
  ENABLE_PAINT_TYPE = 'paint_type.enable',
  DISABLE_PAINT_TYPE = 'paint_type.disable',

  // Painting price permissions
  VIEW_PAINTING_PRICE = 'painting_price.view',
  CREATE_PAINTING_PRICE = 'painting_price.create',
  UPDATE_PAINTING_PRICE = 'painting_price.update',
  DELETE_PAINTING_PRICE = 'painting_price.delete',
  ENABLE_PAINTING_PRICE = 'painting_price.enable',
  DISABLE_PAINTING_PRICE = 'painting_price.disable',

  // Hourly rate permissions
  VIEW_HOURLY_RATE = 'hourly_rate.view',
  CREATE_HOURLY_RATE = 'hourly_rate.create',
  UPDATE_HOURLY_RATE = 'hourly_rate.update',
  DELETE_HOURLY_RATE = 'hourly_rate.delete',
  ENABLE_HOURLY_RATE = 'hourly_rate.enable',
  DISABLE_HOURLY_RATE = 'hourly_rate.disable',

  // Work fee permissions
  VIEW_WORK_FEE = 'work_fee.view',
  CREATE_WORK_FEE = 'work_fee.create',
  UPDATE_WORK_FEE = 'work_fee.update',
  DELETE_WORK_FEE = 'work_fee.delete',
  ENABLE_WORK_FEE = 'work_fee.enable',
  DISABLE_WORK_FEE = 'work_fee.disable',

  // Receipt permissions
  VIEW_RECEIPT = 'receipt.view',
  CREATE_RECEIPT = 'receipt.create',
  UPDATE_RECEIPT = 'receipt.update',
  DELETE_RECEIPT = 'receipt.delete',

  // Receipt type permissions
  VIEW_RECEIPT_TYPE = 'receipt_type.view',
  CREATE_RECEIPT_TYPE = 'receipt_type.create',
  UPDATE_RECEIPT_TYPE = 'receipt_type.update',
  DELETE_RECEIPT_TYPE = 'receipt_type.delete',
  ENABLE_RECEIPT_TYPE = 'receipt_type.enable',
  DISABLE_RECEIPT_TYPE = 'receipt_type.disable',

  // Supply permissions
  VIEW_SUPPLY = 'supply.view',
  CREATE_SUPPLY = 'supply.create',
  UPDATE_SUPPLY = 'supply.update',
  DELETE_SUPPLY = 'supply.delete',
  ENABLE_SUPPLY = 'supply.enable',
  DISABLE_SUPPLY = 'supply.disable',

  // Depreciation table permissions
  VIEW_DEPRECIATION_TABLE = 'depreciation_table.view',
  CREATE_DEPRECIATION_TABLE = 'depreciation_table.create',
  UPDATE_DEPRECIATION_TABLE = 'depreciation_table.update',
  DELETE_DEPRECIATION_TABLE = 'depreciation_table.delete',
  ENABLE_DEPRECIATION_TABLE = 'depreciation_table.enable',
  DISABLE_DEPRECIATION_TABLE = 'depreciation_table.disable',

  // Vehicle age permissions
  VIEW_VEHICLE_AGE = 'vehicle_age.view',
  CREATE_VEHICLE_AGE = 'vehicle_age.create',
  UPDATE_VEHICLE_AGE = 'vehicle_age.update',
  DELETE_VEHICLE_AGE = 'vehicle_age.delete',
  ENABLE_VEHICLE_AGE = 'vehicle_age.enable',
  DISABLE_VEHICLE_AGE = 'vehicle_age.disable',

  // Vehicle energy permissions
  VIEW_VEHICLE_ENERGY = 'vehicle_energy.view',
  CREATE_VEHICLE_ENERGY = 'vehicle_energy.create',
  UPDATE_VEHICLE_ENERGY = 'vehicle_energy.update',
  DELETE_VEHICLE_ENERGY = 'vehicle_energy.delete',
  ENABLE_VEHICLE_ENERGY = 'vehicle_energy.enable',
  DISABLE_VEHICLE_ENERGY = 'vehicle_energy.disable',

  // Vehicle genre permissions
  VIEW_VEHICLE_GENRE = 'vehicle_genre.view',
  CREATE_VEHICLE_GENRE = 'vehicle_genre.create',
  UPDATE_VEHICLE_GENRE = 'vehicle_genre.update',
  DELETE_VEHICLE_GENRE = 'vehicle_genre.delete',
  ENABLE_VEHICLE_GENRE = 'vehicle_genre.enable',
  DISABLE_VEHICLE_GENRE = 'vehicle_genre.disable',

  // Bodywork permissions
  VIEW_BODYWORK = 'bodywork.view',
  CREATE_BODYWORK = 'bodywork.create',
  UPDATE_BODYWORK = 'bodywork.update',
  DELETE_BODYWORK = 'bodywork.delete',
  ENABLE_BODYWORK = 'bodywork.enable',
  DISABLE_BODYWORK = 'bodywork.disable',

  // Ascertainment permissions
  VIEW_ASCERTAINMENT = 'ascertainment.view',
  CREATE_ASCERTAINMENT = 'ascertainment.create',
  UPDATE_ASCERTAINMENT = 'ascertainment.update',
  DELETE_ASCERTAINMENT = 'ascertainment.delete',

  // Ascertainment type permissions
  VIEW_ASCERTAINMENT_TYPE = 'ascertainment_type.view',
  CREATE_ASCERTAINMENT_TYPE = 'ascertainment_type.create',
  UPDATE_ASCERTAINMENT_TYPE = 'ascertainment_type.update',
  DELETE_ASCERTAINMENT_TYPE = 'ascertainment_type.delete',
  ENABLE_ASCERTAINMENT_TYPE = 'ascertainment_type.enable',
  DISABLE_ASCERTAINMENT_TYPE = 'ascertainment_type.disable',

  // Insurer relationship permissions
  VIEW_INSURER_RELATIONSHIP = 'insurer_relationship.view',
  CREATE_INSURER_RELATIONSHIP = 'insurer_relationship.create',
  UPDATE_INSURER_RELATIONSHIP = 'insurer_relationship.update',
  DELETE_INSURER_RELATIONSHIP = 'insurer_relationship.delete',
  ENABLE_INSURER_RELATIONSHIP = 'insurer_relationship.enable',
  DISABLE_INSURER_RELATIONSHIP = 'insurer_relationship.disable',

  // Repairer relationship permissions
  VIEW_REPAIRER_RELATIONSHIP = 'repairer_relationship.view',
  CREATE_REPAIRER_RELATIONSHIP = 'repairer_relationship.create',
  UPDATE_REPAIRER_RELATIONSHIP = 'repairer_relationship.update',
  DELETE_REPAIRER_RELATIONSHIP = 'repairer_relationship.delete',
  ENABLE_REPAIRER_RELATIONSHIP = 'repairer_relationship.enable',
  DISABLE_REPAIRER_RELATIONSHIP = 'repairer_relationship.disable',

  // Assignment message permissions
  ASSIGNMENT_MESSAGE = 'assignment_message.view',
  CREATE_ASSIGNMENT_MESSAGE = 'assignment_message.create',
  UPDATE_ASSIGNMENT_MESSAGE = 'assignment_message.update',
  DELETE_ASSIGNMENT_MESSAGE = 'assignment_message.delete',

  // Check permissions
  VIEW_CHECK = 'check.view',
  CREATE_CHECK = 'check.create',
  UPDATE_CHECK = 'check.update',
  DELETE_CHECK = 'check.delete',

  // Bank permissions
  VIEW_BANK = 'bank.view',
  CREATE_BANK = 'bank.create',
  UPDATE_BANK = 'bank.update',
  DELETE_BANK = 'bank.delete',
  ENABLE_BANK = 'bank.enable',
  DISABLE_BANK = 'bank.disable',

  // Payment type permissions
  VIEW_PAYMENT_TYPE = 'payment_type.view',
  CREATE_PAYMENT_TYPE = 'payment_type.create',
  UPDATE_PAYMENT_TYPE = 'payment_type.update',
  DELETE_PAYMENT_TYPE = 'payment_type.delete',
  ENABLE_PAYMENT_TYPE = 'payment_type.enable',
  DISABLE_PAYMENT_TYPE = 'payment_type.disable',

  // Payment method permissions
  VIEW_PAYMENT_METHOD = 'payment_method.view',
  CREATE_PAYMENT_METHOD = 'payment_method.create',
  UPDATE_PAYMENT_METHOD = 'payment_method.update',
  DELETE_PAYMENT_METHOD = 'payment_method.delete',
  ENABLE_PAYMENT_METHOD = 'payment_method.enable',
  DISABLE_PAYMENT_METHOD = 'payment_method.disable',

  // Client permissions
  VIEW_CLIENT = 'client.view',
  CREATE_CLIENT = 'client.create',
  UPDATE_CLIENT = 'client.update',
  DELETE_CLIENT = 'client.delete',
  ENABLE_CLIENT = 'client.enable',
  DISABLE_CLIENT = 'client.disable',

  // Photo permissions
  VIEW_PHOTO = 'photo.view',
  CREATE_PHOTO = 'photo.create',
  UPDATE_PHOTO = 'photo.update',
  DELETE_PHOTO = 'photo.delete',

  // Photo type permissions
  VIEW_PHOTO_TYPE = 'photo_type.view',
  CREATE_PHOTO_TYPE = 'photo_type.create',
  UPDATE_PHOTO_TYPE = 'photo_type.update',
  DELETE_PHOTO_TYPE = 'photo_type.delete',
  ENABLE_PHOTO_TYPE = 'photo_type.enable',
  DISABLE_PHOTO_TYPE = 'photo_type.disable',

  // QR code permissions
  VIEW_QR_CODE = 'qr_code.view',
  CREATE_QR_CODE = 'qr_code.create',
  UPDATE_QR_CODE = 'qr_code.update',
  DELETE_QR_CODE = 'qr_code.delete',
  ENABLE_QR_CODE = 'qr_code.enable',
  DISABLE_QR_CODE = 'qr_code.disable',

  // User action permissions
  VIEW_USER_ACTION = 'user_action.view',
  CREATE_USER_ACTION = 'user_action.create',
  UPDATE_USER_ACTION = 'user_action.update',
  DELETE_USER_ACTION = 'user_action.delete',

  // User action type permissions
  VIEW_USER_ACTION_TYPE = 'user_action_type.view',
  CREATE_USER_ACTION_TYPE = 'user_action_type.create',
  UPDATE_USER_ACTION_TYPE = 'user_action_type.update',
  DELETE_USER_ACTION_TYPE = 'user_action_type.delete',
  ENABLE_USER_ACTION_TYPE = 'user_action_type.enable',
  DISABLE_USER_ACTION_TYPE = 'user_action_type.disable',

  // Dashboard permissions
  DASHBOARD = 'dashboard.view',

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


