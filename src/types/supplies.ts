import { Status } from './painting-prices'

export interface Supply {
  id: number
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

// Types pour les prix des fournitures
export interface SupplyPrice {
  id: number
  disassembly: boolean
  replacement: boolean
  repair: boolean
  paint: boolean
  control: boolean
  comment: string | null
  obsolescence_rate: string
  obsolescence_amount_excluding_tax: string
  obsolescence_amount_tax: string
  obsolescence_amount: string
  recovery_rate: string
  recovery_amount_excluding_tax: string
  recovery_amount_tax: string
  recovery_amount: string
  new_amount_excluding_tax: string
  new_amount_tax: string
  new_amount: string
  amount_excluding_tax: string | null
  amount_tax: string | null
  amount: string | null
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