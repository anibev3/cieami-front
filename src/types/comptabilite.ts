// Types communs
export interface Status {
  id: number
  code: string
  label: string
  description: string | null
  deleted_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface User {
  id: number
  hash_id: string
  email: string | null
  username: string | null
  name: string
  last_name: string | null
  first_name: string | null
  telephone: string | null
  photo_url: string
  pending_verification: boolean
  signature: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Assignment {
  id: number
  reference: string
  policy_number: string | null
  claim_number: string | null
  claim_starts_at: string | null
  claim_ends_at: string | null
  expertise_date: string | null
  expertise_place: string | null
  received_at: string
  insurer_id: number
  repairer_id: number
  administrator: string | null
  circumstance: string | null
  damage_declared: string | null
  observation: string | null
  point_noted: string | null
  seen_before_work_date: string | null
  seen_during_work_date: string | null
  seen_after_work_date: string | null
  contact_date: string | null
  assured_value: string | null
  salvage_value: string | null
  new_value: string | null
  depreciation_rate: string | null
  market_value: string | null
  work_duration: string | null
  expert_remark: string | null
  shock_amount_excluding_tax: string
  shock_amount_tax: string
  shock_amount: string
  other_cost_amount_excluding_tax: string
  other_cost_amount_tax: string
  other_cost_amount: string
  receipt_amount_excluding_tax: string
  receipt_amount_tax: string
  receipt_amount: string
  total_amount_excluding_tax: string
  total_amount_tax: string
  total_amount: string
  printed_at: string | null
  expertise_sheet: string | null
  expertise_report: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  closed_at: string | null
  cancelled_at: string | null
  edited_at: string | null
  realized_at: string | null
}

// Types de paiement
export interface PaymentType {
  id: number
  code: string
  label: string
  description: string | null
  status: Status
  created_by: User
  updated_by: User
  deleted_by: User | null
  created_at: string
  updated_at: string
}

export interface CreatePaymentTypeData {
  code: string
  label: string
  description?: string
}

export interface UpdatePaymentTypeData {
  code?: string
  label?: string
  description?: string
}

export interface PaymentTypeResponse {
  data: PaymentType[]
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

// Méthodes de paiement
export interface PaymentMethod {
  id: number
  code: string
  label: string
  description: string | null
  status: Status
  created_by: User
  updated_by: User
  deleted_by: User | null
  created_at: string
  updated_at: string
}

export interface CreatePaymentMethodData {
  code: string
  label: string
  description?: string
}

export interface UpdatePaymentMethodData {
  code?: string
  label?: string
  description?: string
}

export interface PaymentMethodResponse {
  data: PaymentMethod[]
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

// Banques
export interface Bank {
  id: number
  name: string
  code: string
  description: string | null
  status: Status
  created_by: User
  updated_by: User
  deleted_by: User | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateBankData {
  code: string
  name: string
  description?: string
}

export interface UpdateBankData {
  code?: string
  name?: string
  description?: string
}

export interface BankResponse {
  data: Bank[]
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

// Paiements
export interface Payment {
  id: number
  reference: string
  date: string
  amount: string
  assignment: Assignment
  payment_type: PaymentType
  payment_method: PaymentMethod
  status: Status
  created_by: User
  updated_by: User
  deleted_by: User | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface CreatePaymentData {
  assignment_id: string
  payment_type_id: string
  payment_method_id: string
  date: string
  amount: number
}

export interface UpdatePaymentData {
  assignment_id?: string
  payment_type_id?: string
  payment_method_id?: string
  date?: string
  amount?: number
}

export interface PaymentResponse {
  data: Payment[]
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

// Chèques
export interface Check {
  id: number
  reference: string
  date: string
  amount: string
  photo: string | null
  payment: Payment | null
  bank: Bank | null
  status: Status
  created_by: User
  updated_by: User
  deleted_by: User | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateCheckData {
  payment_id: string
  bank_id: string
  date: string
  amount: number
  photo?: File
}

export interface UpdateCheckData {
  payment_id?: string
  bank_id?: string
  date?: string
  amount?: number
  photo?: File
}

export interface CheckResponse {
  data: Check[]
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

// Filtres pour la recherche
export interface PaymentTypeFilters {
  search?: string
  page?: number
  per_page?: number
}

export interface PaymentMethodFilters {
  search?: string
  page?: number
  per_page?: number
}

export interface BankFilters {
  search?: string
  page?: number
  per_page?: number
}

export interface PaymentFilters {
  search?: string
  assignment_id?: string
  payment_type_id?: string
  payment_method_id?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export interface CheckFilters {
  search?: string
  payment_id?: string
  bank_id?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

// Statistiques et rapports
export interface AccountingStats {
  total_payments: number
  total_amount: number
  payments_this_month: number
  amount_this_month: number
  pending_checks: number
  total_checks: number
  checks_amount: number
}

export interface PaymentReport {
  date: string
  count: number
  amount: number
}

export interface CheckReport {
  date: string
  count: number
  amount: number
}

export interface TreasuryReport {
  date: string
  payments: number
  checks: number
  total: number
} 