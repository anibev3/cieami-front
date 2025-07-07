export interface Assignment {
  id: number
  reference: string
  policy_number: string
  claim_number: string
  claim_starts_at: string
  claim_ends_at: string
  expertise_date: string
  expertise_place: string | null
  received_at: string
  insurer_id: number
  repairer_id: number
  administrator: string | null
  circumstance: string
  damage_declared: string
  observation: string | null
  point_noted: string | null
  seen_before_work_date: string | null
  seen_during_work_date: string | null
  seen_after_work_date: string | null
  contact_date: string | null
  assured_value: number | null
  salvage_value: number | null
  new_value: number | null
  depreciation_rate: number | null
  market_value: number | null
  work_duration: number | null
  expert_remark: string | null
  shock_amount_excluding_tax: string | null
  shock_amount_tax: string | null
  shock_amount: string | null
  other_cost_amount_excluding_tax: string | null
  other_cost_amount_tax: string | null
  other_cost_amount: string | null
  receipt_amount_excluding_tax: string | null
  receipt_amount_tax: string | null
  receipt_amount: string | null
  total_amount_excluding_tax: string | null
  total_amount_tax: string | null
  total_amount: string | null
  printed_at: string | null
  emails: string | null
  qr_codes: string | null
  expert_signature: string | null
  repairer_signature: string | null
  customer_signature: string | null
  edition_time_expire_at: string | null
  edition_status: string | null
  edition_per_cent: number | null
  recovery_time_expire_at: string | null
  recovery_status: string | null
  recovery_per_cent: number | null
  now: string | null
  validated_by?: {
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
    created_at: string
    updated_at: string
    signature?: string
  } | null
  validated_at?: string | null
  work_sheet_established_by?: {
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
    created_at: string
    updated_at: string
    signature?: string
  } | null
  work_sheet_established_at?: string | null
  insurer: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
    created_at: string
    updated_at: string
  }
  repairer: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
    created_at: string
    updated_at: string
  }
  vehicle: {
    id: number
    license_plate: string
    usage: string
    type: string
    option: string
    mileage: string
    serial_number: string
    first_entry_into_circulation_date: string | null
    technical_visit_date: string | null
    fiscal_power: number
    energy: string
    nb_seats: number
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  assignment_type: {
    id: number
    code: string
    label: string
    description: string
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
  expertise_type: {
    id: number
    code: string
    label: string
    description: string
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
  document_transmitted: {
    id: number
    code: string
    label: string
    description: string
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
  technical_conclusion: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  } | null
  general_state: {
    id: number
    code: string
    label: string
    description: string
    status: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
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
      created_at: string
      updated_at: string
    }
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
      created_at: string
      updated_at: string
    } | null
    created_at: string
    updated_at: string
  } | null
  shocks: Array<{
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
    workforces: Array<{
      id: number
      nb_hours: string
      work_fee: string
      discount: string
      amount_excluding_tax: string
      amount_tax: string
      amount: string
      workforce_type_label: string
      workforce_type: {
        id: number
        code: string
        label: string
        description: string
        deleted_at: string | null
        created_at: string
        updated_at: string
      }
      deleted_at: string | null
      created_at: string
      updated_at: string
    }>
    deleted_at: string | null
    created_at: string
    updated_at: string
  }>
  other_costs: Array<{
    id: number
    amount_excluding_tax: string
    amount_tax: string
    amount: string
    other_cost_type_label: string
    other_cost_type: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    deleted_at: string | null
    created_at: string
    updated_at: string
  }>
  receipts: Array<{
    id: number
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
    created_at: string
    updated_at: string
  }>
  client: {
    id: number
    name: string
    email: string
    phone_1: string | null
    phone_2: string | null
    address: string
    deleted_at: string | null
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
  experts: Array<{
    id: number
    date: string | null
    observation: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
  }>
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
    created_at: string
    updated_at: string
  }
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
    created_at: string
    updated_at: string
  } | null
  realized_by: {
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
    created_at: string
    updated_at: string
  } | null
  edited_by: {
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
    created_at: string
    updated_at: string
  } | null
  closed_by: {
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
    created_at: string
    updated_at: string
  } | null
  cancelled_by: {
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
    created_at: string
    updated_at: string
  } | null
  expertise_sheet: string
  expertise_report: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  closed_at: string | null
  cancelled_at: string | null
  edited_at: string | null
  realized_at: string | null
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

// Types pour les statistiques des assignations
export interface AssignmentStatistics {
  assignments_by_year_and_month_count: AssignmentCountByMonth[]
  assignments_by_year_and_month_amount: AssignmentAmountByMonth[]
}

export interface AssignmentCountByMonth {
  year: number
  month: number
  count: number
}

export interface AssignmentAmountByMonth {
  year: number
  month: number
  amount: string
}

export interface AssignmentStatisticsFilters {
  start_date: string
  end_date: string
  assignment_id?: number
} 