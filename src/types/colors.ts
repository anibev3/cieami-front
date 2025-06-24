export interface Color {
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
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ColorCreate {
  code: string
  label: string
  description: string
}

export interface ColorUpdate {
  label?: string
  description?: string
}

export interface ColorFilters {
  search?: string
  status?: string
}

export interface ColorApiResponse {
  data: Color[]
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