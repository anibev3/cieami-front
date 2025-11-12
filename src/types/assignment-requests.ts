/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AssignmentRequest {
  id: string
  reference: string
  policy_number: string | null
  claim_number: string | null
  claim_date: string | null
  expertise_place: string | null
  new_market_value: string | null
  expert_firm: string | null
  insurer: {
    id: string
    code: string
    name: string
    prefix: string | null
    suffix: string | null
    email: string
    telephone: string | null
    address: string | null
    taxpayer_account_number: string | null
    service_description: string | null
    footer_description: string | null
    logo: string | null
    created_at: string
    updated_at: string
  }
  repairer: {
    id: string
    code: string
    name: string
    prefix: string | null
    suffix: string | null
    email: string
    telephone: string | null
    address: string | null
    taxpayer_account_number: string | null
    service_description: string | null
    footer_description: string | null
    logo: string | null
    created_at: string
    updated_at: string
  }
  client: {
    id: string
    name: string
    email: string
    phone_1: string | null
    phone_2: string | null
    address: string | null
    taxpayer_account_number: string | null
    relationships: any
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  vehicle: {
    id: string
    license_plate: string
    type: string
    option: string
    mileage: string
    serial_number: string
    first_entry_into_circulation_date: string | null
    technical_visit_date: string | null
    fiscal_power: number
    nb_seats: number
    new_market_value: string | null
    relationships: any
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  assignment_type: any | null
  expertise_type: any | null
  status: {
    id: string
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  created_by: {
    id: string
    code: string
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
    id: string
    code: string
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
  deleted_by: any | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface AssignmentRequestApiResponse {
  data: AssignmentRequest[]
  links: {
    first: string | null
    last: string | null
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
      page: number | null
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface AssignmentRequestFilters {
  search?: string
  status_code?: string
  insurer_id?: string | number
  repairer_id?: string | number
  client_id?: string | number
  vehicle_id?: string | number
  date_from?: string
  date_to?: string
  per_page?: number
}

export interface AssignmentRequestUpdate {
  policy_number?: string
  claim_number?: string
  claim_date?: string
  expertise_place?: string
  new_market_value?: string
  expert_firm?: string
  insurer_id?: string
  repairer_id?: string
  client_id?: string
  vehicle_id?: string
  assignment_type_id?: string
  expertise_type_id?: string
  status_id?: string
}

