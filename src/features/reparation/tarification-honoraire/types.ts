export interface WorkFeeStatus {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface WorkFeeUser {
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

export interface WorkFee {
  id: number
  param_1: string
  param_2: string
  param_3: string
  param_4: string
  status: WorkFeeStatus
  created_by: WorkFeeUser
  updated_by: WorkFeeUser
  deleted_by: WorkFeeUser | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface WorkFeeApiResponse {
  data: WorkFee[]
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