export interface Reparateur {
  id: number
  code: string
  name: string
  email: string
  telephone?: string | null
  address?: string | null
  status: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  entity_type: {
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

export interface ReparateurApiResponse {
  data: Reparateur[]
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

export interface ReparateurFilters {
  search?: string
  page?: number
  // per_page?: number
} 