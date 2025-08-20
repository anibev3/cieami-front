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
  // Nouvelles propriétés de l'API
  new_market_value?: string | null
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
  payment_received: number
  payment_remains: number
  printed_at: string | null
  expert_signature: string | null
  repairer_signature: string | null
  customer_signature: string | null
  // Nouvelles propriétés de l'API
  expert_signature_url?: string | null
  repairer_signature_url?: string | null
  customer_signature_url?: string | null
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
  broker: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
    created_at: string
    updated_at: string
  } | null
  vehicle: {
    id: number
    license_plate: string
    usage?: string
    type: string | null
    option: string | null
    mileage: string | null
    serial_number: string
    first_entry_into_circulation_date: string | null
    technical_visit_date: string | null
    fiscal_power: number
    energy?: string
    nb_seats: number
    new_market_value?: string | null
    brand?: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    vehicle_model?: {
      id: number
      code: string
      label: string
      description: string | null
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    color?: {
      id: number
      code: string
      label: string
      description: string | null
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    bodywork?: {
      id: number
      code: string
      label: string
      description: string
      status?: {
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
    } | null
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
  document_transmitted: Array<{
    id: number
    code: string
    label: string
    description?: string
    status?: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    created_at?: string
    updated_at?: string
  }>
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
    with_tax: number
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
    shock_point: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    shock_works: Array<{
      id: number
      disassembly: boolean
      replacement: boolean
      repair: boolean
      paint: boolean
      obsolescence: boolean
      control: boolean
      comment: string | null
      amount: string
      obsolescence_rate: string
      obsolescence_amount_excluding_tax: string
      obsolescence_amount_tax: string
      obsolescence_amount: string
      recovery_amount_excluding_tax: string
      recovery_amount_tax: string
      recovery_amount: string
      discount: string
      discount_amount_excluding_tax: string
      discount_amount_tax: string
      discount_amount: string
      new_amount_excluding_tax: string
      new_amount_tax: string
      new_amount: string
      amount_excluding_tax: string | null
      amount_tax: string | null
      supply: {
        id: number
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
    workforces: Array<{
      id: number
      nb_hours: string
      work_fee: string
      with_tax: number
      discount: string
      amount_excluding_tax: string
      amount_tax: string
      amount: string
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
  work_sheet: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  closed_at: string | null
  cancelled_at: string | null
  edited_at: string | null
  realized_at: string | null
  // Nouvelles propriétés de l'API
  instructions?: string | null
  expert_work_sheet_remark?: string | null
  expert_report_remark?: string | null
  emails?: Array<{email: string}> | null
  qr_codes?: string | null
  evaluations?: {
    vehicle_age: number
    diff_year: number
    diff_month: number
    theorical_depreciation_rate: string
    theorical_vehicle_market_value: number
    market_incidence_rate: number | null
    less_value_work: number
    is_up: boolean
    kilometric_incidence: number
    market_incidence: number
    vehicle_market_value: number
  } | null
  ascertainments?: Array<{
    id: number
    ascertainment_type_id: number
    very_good: boolean
    good: boolean
    acceptable: boolean
    less_good: boolean
    bad: boolean
    very_bad: boolean
    comment: string | null
    created_at: string
    updated_at: string
  }>
  payments?: Array<{
    id: number
    amount: number
    payment_method_id: number
    payment_type_id: number
    reference: string
    description: string | null
    created_at: string
    updated_at: string
  }>
  invoices?: Array<{
    id: number
    amount: number
    invoice_number: string
    description: string | null
    created_at: string
    updated_at: string
  }>
  directed_by?: {
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
  is_selected?: boolean
  per_page?: number
  herself_per_page?: number
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
  id?: number
  label: string
  value?: string
  items?: Array<{
    id?: number
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

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AssignmentCountByMonth {
  year: number
  month: number
  count: number
  assignment_type?: any
  expertise_type?: any
  vehicle?: any
  repairer?: any
  client?: any
  insurer?: any
  status?: any
  created_by?: any
  realized_by?: any
  edited_by?: any
  validated_by?: any
  directed_by?: any
  claim_nature?: any
}

export interface AssignmentAmountByMonth {
  year: number
  month: number
  amount: string
  assignment_type?: any
  expertise_type?: any
  vehicle?: any
  repairer?: any
  client?: any
  insurer?: any
  status?: any
  created_by?: any
  realized_by?: any
  edited_by?: any
  validated_by?: any
  directed_by?: any
  claim_nature?: any
}

export interface AssignmentStatisticsFilters {
  start_date: string
  end_date: string
  assignment_id?: number
  // Filtres avancés
  vehicle_id?: number
  repairer_id?: number
  insurer_id?: number
  assignment_type_id?: number
  expertise_type_id?: number
  claim_nature_id?: number
  created_by?: number
  edited_by?: number
  realized_by?: number
  directed_by?: number
  validated_by?: number
  status_id?: number
}

// Types pour le calcul d'évaluation
export interface EvaluationCalculationRequest {
  vehicle_id: string
  expertise_date: string
  market_incidence_rate: number
  ascertainments: Array<{
    ascertainment_type_id: string
    very_good: boolean
    good: boolean
    acceptable: boolean
    less_good: boolean
    bad: boolean
    very_bad: boolean
    comment: string
  }>
  shocks: Array<{
    shock_point_id: number
    shock_works: Array<{
      supply_id: string
      disassembly: boolean
      replacement: boolean
      repair: boolean
      paint: boolean
      control: boolean
      comment: string
      obsolescence_rate: number
      recovery_amoun: number
      discount: number
      amount: number
    }>
    paint_type_id: number
    hourly_rate_id: number
    with_tax: boolean
    workforces: Array<{
      workforce_type_id: number
      amount: number
    }>
  }>
  other_costs: Array<{
    other_cost_type_id: number
    amount: number
  }>
}

export interface EvaluationCalculationResponse {
  status: number
  message: string
  data: {
    total_amount_excluding_tax: number
    total_amount_tax: number
    total_amount: number
    market_value: number
    salvage_value: number
    depreciation_amount: number
    final_amount: number
    calculations: {
      shocks: Array<{
        shock_point_id: number
        shock_works: Array<{
          supply_id: string
          amount_excluding_tax: number
          amount_tax: number
          amount: number
        }>
        workforces: Array<{
          workforce_type_id: number
          amount_excluding_tax: number
          amount_tax: number
          amount: number
        }>
        total_amount_excluding_tax: number
        total_amount_tax: number
        total_amount: number
      }>
      other_costs: Array<{
        other_cost_type_id: number
        amount_excluding_tax: number
        amount_tax: number
        amount: number
      }>
    }
  }
}

// Types pour la soumission d'évaluation
export interface EvaluationSubmissionRequest {
  market_incidence_rate: number
  ascertainments: Array<{
    ascertainment_type_id: string
    very_good: boolean
    good: boolean
    acceptable: boolean
    less_good: boolean
    bad: boolean
    very_bad: boolean
    comment: string
  }>
  shocks: Array<{
    shock_point_id: number
    shock_works: Array<{
      supply_id: string
      disassembly: boolean
      replacement: boolean
      repair: boolean
      paint: boolean
      control: boolean
      comment: string
      obsolescence_rate: number
      recovery_amoun: number
      discount: number
      amount: number
    }>
    workforces: Array<{
      workforce_type_id: number
      amount: number
    }>
  }>
  other_costs: Array<{
    other_cost_type_id: number
    amount: number
  }>
}

export interface EvaluationSubmissionResponse {
  status: number
  message: string
  data: {
    assignment_id: number
    evaluation_id: number
    total_amount: number
    market_value: number
    salvage_value: number
    created_at: string
  }
} 