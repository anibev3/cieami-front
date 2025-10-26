export interface EntityLite {
  id: number
  hash_id?: string
  code?: string
  name: string
}

export interface StatusLite {
  id: number
  code: string
  label: string
  description?: string | null
  deleted_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface RepairerRelationship {
  id: number
  repairer: EntityLite
  expert_firm: EntityLite
  status: StatusLite
  created_by: number | null
  created_at: string
  updated_at: string
  enabled_at: string | null
  disabled_at: string | null
  deleted_at: string | null
}

export interface RepairerRelationshipsResponse {
  data: RepairerRelationship[]
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
      page: number | null
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateRepairerRelationshipBody {
  repairer_id: string | number
}


