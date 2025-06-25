export interface Assignment {
  id: number
  reference: string
  status: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  client: {
    id: number
    name: string
    email: string
    phone: string
    address: string
    created_at: string
    updated_at: string
  }
  vehicle: {
    id: number
    license_plate: string
    brand: {
      id: number
      code: string
      label: string
      description: string
    }
    vehicle_model: {
      id: number
      code: string
      label: string
      description: string
    }
    color: {
      id: number
      code: string
      label: string
      description: string
    }
  }
  assignment_type: {
    id: number
    code: string
    label: string
    description: string
  }
  expert: {
    id: number
    name: string
    email: string
  }
  amount: number
  receipts?: Receipt[]
  created_at: string
  updated_at: string
}

export interface Receipt {
  id: number
  assignment_id: number
  amount: number
  type: string
  reference: string
  description: string
  created_at: string
  updated_at: string
}

export interface AssignmentCreate {
  reference: string
  client_id: number
  vehicle_id: number
  assignment_type_id: number
  expert_id: number
  amount: number
  description?: string
}

export interface AssignmentUpdate {
  reference?: string
  client_id?: number
  vehicle_id?: number
  assignment_type_id?: number
  expert_id?: number
  amount?: number
  description?: string
  status_id?: number
}

export interface AssignmentFilters {
  search?: string
  status_code?: string
  client_id?: string
  expert_id?: string
  assignment_type_id?: string
  date_from?: string
  date_to?: string
}

export interface AssignmentApiResponse {
  data: Assignment[]
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
export interface StatusGroup {
  label: string
  value?: string
  items?: Array<{
    value: string
    label: string
  }>
}

export interface StatusTab {
  value: string
  label: string
}

// Types pour les quittances
export interface ReceiptCreate {
  assignment_id: number
  amount: number
  type: string
  reference: string
  description: string
}

export interface ReceiptUpdate {
  amount?: number
  type?: string
  reference?: string
  description?: string
} 