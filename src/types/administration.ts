// Types pour les documents transmis
export interface DocumentTransmitted {
  id: number
  code: string
  label: string
  description: string
  status: Status
  created_at: string
  updated_at: string
}

export interface DocumentTransmittedResponse {
  data: DocumentTransmitted[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

// Types pour les utilisateurs (users)
export interface UserRole {
  name: string
  label: string
  description: string
}

export interface UserEntity {
  id: number
  code: string
  name: string
  email: string
  telephone: string | null
  address: string | null
  created_at: string
  updated_at: string
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
  entity: UserEntity
  photo_url: string
  pending_verification: boolean
  role: UserRole
  status: Status
  signature: string | null
  code: string
  created_at: string
  updated_at: string
}

export interface UserResponse {
  data: User[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateUserData {
  email: string
  username: string
  first_name: string
  last_name: string
  telephone: string
  entity_id: number
  role: string
  code: string
}

export interface UpdateUserData {
  email?: string
  username?: string
  first_name?: string
  last_name?: string
  telephone?: string
  entity_id?: number
  role?: string
  code?: string
}

export interface UserFilters {
  search?: string
  entity?: string
  role?: string
  page?: number
  per_page?: number
}

export interface UserActions {
  create: (data: CreateUserData) => Promise<void>
  update: (id: number, data: UpdateUserData) => Promise<void>
  delete: (id: number) => Promise<void>
  getById: (id: number) => Promise<User>
  getAll: (filters?: UserFilters) => Promise<UserResponse>
}

// Types pour les états généraux
export interface GeneralState {
  id: number
  code: string
  label: string
  description: string
  status: Status
  created_by: User
  updated_by: User
  deleted_by: User | null
  created_at: string
  updated_at: string
}

export interface GeneralStateResponse {
  data: GeneralState[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

// Types pour les statuts
export interface Status {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface StatusResponse {
  data: Status[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateStatusData {
  code: string
  label: string
  description: string
}

export interface UpdateStatusData {
  label?: string
  description?: string
}

export interface StatusFilters {
  search?: string
  page?: number
  per_page?: number
}

export interface StatusActions {
  create: (data: CreateStatusData) => Promise<void>
  update: (id: number, data: UpdateStatusData) => Promise<void>
  delete: (id: number) => Promise<void>
  getById: (id: number) => Promise<Status>
  getAll: (filters?: StatusFilters) => Promise<StatusResponse>
}

// Types pour les entités (entities)
export interface Entity {
  id: number
  code: string
  name: string
  email: string
  telephone: string | null
  address: string | null
  status: Status
  entity_type: EntityType
  created_at: string
  updated_at: string
}

export interface EntityResponse {
  data: Entity[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateEntityData {
  code: string
  name: string
  address?: string
  email: string
  telephone?: string
  entity_type_code?: string
}

export interface UpdateEntityData {
  name?: string
  address?: string
  email?: string
  telephone?: string
}

export interface EntityFilters {
  search?: string
  status?: string
  entity_type?: string
  page?: number
  per_page?: number
}

export interface EntityActions {
  create: (data: CreateEntityData) => Promise<void>
  update: (id: number, data: UpdateEntityData) => Promise<void>
  delete: (id: number) => Promise<void>
  enable: (id: number) => Promise<void>
  disable: (id: number) => Promise<void>
  getById: (id: number) => Promise<Entity>
  getAll: (filters?: EntityFilters) => Promise<EntityResponse>
}

// Types pour les types d'entité
export interface EntityType {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface EntityTypeResponse {
  data: EntityType[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateEntityTypeData {
  code: string
  label: string
  description: string
}

export interface UpdateEntityTypeData {
  label?: string
  description?: string
}

export interface EntityTypeFilters {
  search?: string
  page?: number
  per_page?: number
}

export interface EntityTypeActions {
  create: (data: CreateEntityTypeData) => Promise<void>
  update: (id: number, data: UpdateEntityTypeData) => Promise<void>
  delete: (id: number) => Promise<void>
  enable: (id: number) => Promise<void>
  disable: (id: number) => Promise<void>
  getById: (id: number) => Promise<EntityType>
  getAll: (filters?: EntityTypeFilters) => Promise<EntityTypeResponse>
}

// Types pour les formulaires
export interface CreateDocumentTransmittedData {
  code: string
  label: string
  description: string
}

export interface UpdateDocumentTransmittedData {
  label?: string
  description?: string
}

export interface CreateGeneralStateData {
  code: string
  label: string
  description: string
}

export interface UpdateGeneralStateData {
  label?: string
  description?: string
}

// Types pour les filtres et recherche
export interface DocumentTransmittedFilters {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export interface GeneralStateFilters {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

// Types pour les actions
export interface DocumentTransmittedActions {
  create: (data: CreateDocumentTransmittedData) => Promise<void>
  update: (id: number, data: UpdateDocumentTransmittedData) => Promise<void>
  delete: (id: number) => Promise<void>
  getById: (id: number) => Promise<DocumentTransmitted>
  getAll: (filters?: DocumentTransmittedFilters) => Promise<DocumentTransmittedResponse>
}

export interface GeneralStateActions {
  create: (data: CreateGeneralStateData) => Promise<void>
  update: (id: number, data: UpdateGeneralStateData) => Promise<void>
  delete: (id: number) => Promise<void>
  getById: (id: number) => Promise<GeneralState>
  getAll: (filters?: GeneralStateFilters) => Promise<GeneralStateResponse>
}

// Types pour les types d'autres coûts (OtherCostType)
export interface OtherCostType {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface OtherCostTypeResponse {
  data: OtherCostType[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateOtherCostTypeData {
  code: string
  label: string
  description: string
}

export interface UpdateOtherCostTypeData {
  code?: string
  label?: string
  description?: string
}

export interface OtherCostTypeFilters {
  search?: string
  page?: number
  per_page?: number
}

export interface OtherCostTypeActions {
  create: (data: CreateOtherCostTypeData) => Promise<void>
  update: (id: number, data: UpdateOtherCostTypeData) => Promise<void>
  delete: (id: number) => Promise<void>
  getById: (id: number) => Promise<OtherCostType>
  getAll: (filters?: OtherCostTypeFilters) => Promise<OtherCostTypeResponse>
}

// Types pour les réponses API des opérations CRUD des types de coût
export interface OtherCostTypeCreateResponse {
  status: number
  message: string
  data: OtherCostType
}

export interface OtherCostTypeUpdateResponse {
  status: number
  message: string
  data: OtherCostType
}

export interface OtherCostTypeDeleteResponse {
  status: number
  message: string
  data?: any
}

// Types pour les autres coûts (OtherCost)
export interface OtherCost {
  id: number
  amount_excluding_tax: string
  amount_tax: string
  amount: string
  other_cost_type_label: string
  other_cost_type: OtherCostType
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface OtherCostResponse {
  data: OtherCost[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateOtherCostData {
  other_cost_type_id: number
  amount_excluding_tax: number
  amount_tax?: number
  amount: number
}

export interface UpdateOtherCostData {
  other_cost_type_id?: number
  amount_excluding_tax?: number
  amount_tax?: number
  amount?: number
}

export interface OtherCostFilters {
  search?: string
  other_cost_type_id?: number
  page?: number
  per_page?: number
}

// Types pour les réponses API des opérations CRUD des autres coûts
export interface OtherCostCreateResponse {
  status: number
  message: string
  data: OtherCost
}

export interface OtherCostUpdateResponse {
  status: number
  message: string
  data: OtherCost
}

export interface OtherCostDeleteResponse {
  status: number
  message: string
  data?: any
}

// Types pour les quittances (Receipt)
export interface Receipt {
  id: number
  assignment_id?: number
  amount_excluding_tax: string
  amount_tax: string
  amount: string
  receipt_type: {
    id: number
    code: string
    label: string
    description: string
    created_at: string
    updated_at: string
  }
  status: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  created_at: string
  updated_at: string
}

export interface ReceiptResponse {
  data: Receipt[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateReceiptData {
  assignment_id: number
  receipt_type_id: number
  amount: number
}

export interface CreateMultipleReceiptsData {
  assignment_id: number
  receipts: Array<{
    receipt_type_id: number
    amount: number
  }>
}

export interface UpdateReceiptData {
  assignment_id?: number
  receipt_type_id?: number
  amount?: number
}

export interface ReceiptFilters {
  search?: string
  receipt_type_id?: number
  status_id?: number
  assignment_id?: number
  page?: number
  per_page?: number
}

// Types pour les réponses API des opérations CRUD des quittances
export interface ReceiptCreateResponse {
  status: number
  message: string
  data: Receipt
}

export interface ReceiptUpdateResponse {
  status: number
  message: string
  data: Receipt
}

export interface ReceiptDeleteResponse {
  status: number
  message: string
  data?: any
}

// Types pour les types de quittances (ReceiptType)  
export interface ReceiptType {
  id: number
  code: string
  label: string
  description: string
  created_at: string
  updated_at: string
}

export interface ReceiptTypeResponse {
  data: ReceiptType[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateReceiptTypeData {
  code: string
  label: string
  description: string
}

export interface UpdateReceiptTypeData {
  code?: string
  label?: string
  description?: string
}

export interface ReceiptTypeFilters {
  search?: string
  page?: number
  per_page?: number
}

export interface ReceiptTypeActions {
  create: (data: CreateReceiptTypeData) => Promise<void>
  update: (id: number | string, data: UpdateReceiptTypeData) => Promise<void>
  delete: (id: number | string) => Promise<void>
  getById: (id: number | string) => Promise<ReceiptType>
  getAll: (filters?: ReceiptTypeFilters) => Promise<ReceiptTypeResponse>
}

// Types pour les tableaux de dépréciation
export interface DepreciationTable {
  id: number
  value: string
  vehicle_genre: VehicleGenre
  vehicle_age: VehicleAge
  status: Status
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface DepreciationTableResponse {
  data: DepreciationTable[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateDepreciationTableData {
  vehicle_genre_id: string
  vehicle_age_id: string
  value: number
}

export interface UpdateDepreciationTableData {
  vehicle_genre_id?: string
  vehicle_age_id?: string
  value?: number
}

export interface DepreciationTableFilters {
  search?: string
  page?: number
  per_page?: number
  vehicle_genre_id?: number
  vehicle_age_id?: number
}

export interface TheoreticalValueCalculationData {
  first_entry_into_circulation_date: string
  expertise_date: string
  vehicle_genre_id: string
  vehicle_energy_id: string
  vehicle_new_value: number
  vehicle_mileage: number
}

export interface TheoreticalValueCalculationResult {
  expertise_date: string
  first_entry_into_circulation_date: string
  vehicle_new_value: number
  vehicle_age: number
  theorical_depreciation_rate: string
  theorical_vehicle_market_value: number
}

export interface TheoreticalValueCalculationResponse {
  status: number
  message: string
  data: TheoreticalValueCalculationResult
}

// Types pour les genres de véhicules
export interface VehicleGenre {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

// Types pour les âges de véhicules
export interface VehicleAge {
  id: number
  value: number
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
} 

// Types pour les natures de sinistres
export interface ClaimNature {
  id: number
  code: string
  label: string
  description: string
  status: {
    id: number
    code: string
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  created_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  }
  updated_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  } | null
  deleted_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  } | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CreateClaimNatureData {
  code: string
  label: string
  description: string
}

export interface UpdateClaimNatureData {
  code: string
  label: string
  description: string
}

export interface ClaimNatureResponse {
  data: ClaimNature[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

// Types pour les remarques
export interface Remark {
  id: number
  label: string
  description: string
  status: {
    id: number
    code: string | null
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  created_at: string
  updated_at: string
}

export interface CreateRemarkData {
  label: string
  description: string
}

export interface UpdateRemarkData {
  label: string
  description: string
}

export interface RemarkResponse {
  data: Remark[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
} 