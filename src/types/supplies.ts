import { Status } from './painting-prices'

export interface Supply {
  id: number | string
  code?: string
  label: string
  description: string
  status: Status
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface SupplyCreate {
  code?: string
  label: string
  description: string
}

export interface SupplyUpdate {
  label?: string
  description?: string
}

export interface SuppliesResponse {
  data: Supply[]
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

export interface SupplyResponse {
  data: Supply
}

// Types pour les évaluations de l'assignation
export interface AssignmentEvaluation {
  vehicle_age: number
  diff_year: number
  diff_month: number
  theorical_depreciation_rate: string
  theorical_vehicle_market_value: number
  market_incidence_rate: number
  less_value_work: number
  is_up: boolean
  kilometric_incidence: number
  market_incidence: number
  vehicle_market_value: number
}

// Types pour les documents transmis
export interface DocumentTransmitted {
  id: number
  code: string
  label: string
}

// Types pour l'assignation dans le shock
export interface AssignmentInShock {
  id: number
  reference: string
  policy_number: string | null
  claim_number: string | null
  claim_starts_at: string | null
  claim_ends_at: string | null
  expertise_date: string
  expertise_place: string | null
  received_at: string
  insurer_id: number | null
  repairer_id: number | null
  administrator: string | null
  circumstance: string | null
  damage_declared: string | null
  observation: string | null
  point_noted: string
  seen_before_work_date: string | null
  seen_during_work_date: string | null
  seen_after_work_date: string | null
  contact_date: string | null
  assured_value: string | null
  salvage_value: string | null
  new_market_value: string
  depreciation_rate: string
  market_value: string
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
  emails: string | null
  qr_codes: string | null
  repairer: unknown | null
  document_transmitted: DocumentTransmitted[]
  evaluations: AssignmentEvaluation
  expertise_sheet: string
  expertise_report: string
  work_sheet: string
  expert_signature: string
  repairer_signature: string | null
  customer_signature: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  closed_at: string | null
  cancelled_at: string | null
  edited_at: string
  validated_at: string | null
  realized_at: string
  work_sheet_established_at: string | null
  edition_time_expire_at: string
  edition_status: string
  edition_per_cent: number
  recovery_time_expire_at: string
  recovery_status: string
  recovery_per_cent: number
}

// Types pour l'objet shock
export interface Shock {
  id: number
  obsolescence_amount_excluding_tax: string | null
  obsolescence_amount_tax: string | null
  obsolescence_amount: string | null
  recovery_amount_excluding_tax: string | null
  recovery_amount_tax: string | null
  recovery_amount: string | null
  new_amount_excluding_tax: string | null
  new_amount_tax: string | null
  new_amount: string | null
  workforce_amount_excluding_tax: string
  workforce_amount_tax: string
  workforce_amount: string
  amount_excluding_tax: string
  amount_tax: string
  amount: string
  assignment: AssignmentInShock
  deleted_at: string | null
  created_at: string
  updated_at: string
}

// Types pour les prix des fournitures
export interface SupplyPrice {
  id: number
  disassembly: boolean
  replacement: boolean
  repair: boolean
  paint: boolean
  control: boolean
  comment: string | null
  obsolescence_rate: string | null
  obsolescence_amount_excluding_tax: string | null
  obsolescence_amount_tax: string | null
  obsolescence_amount: string | null
  recovery_amoun: string | null
  recovery_amount_excluding_tax: string | null
  recovery_amount_tax: string | null
  recovery_amount: string | null
  discount: string | null
  new_amount_excluding_tax: string
  new_amount_tax: string
  new_amount: string
  amount_excluding_tax: string | null
  amount_tax: string | null
  amount: string | null
  shock: Shock
  supply: {
    id: number
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface SupplyPriceRequest {
  vehicle_model_id: string
  supply_id?: number | null
  date?: string | null
}

export interface SupplyPriceResponse {
  data: SupplyPrice[]
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

export interface SupplyPriceFilters {
  vehicle_model_id?: string
  supply_id?: number | null
  date?: string | null
  page?: number
  per_page?: number
} 