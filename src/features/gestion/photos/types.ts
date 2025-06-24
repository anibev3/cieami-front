export interface PhotoStatus {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Photo {
  id: number
  url: string
  label: string
  description?: string | null
  status: PhotoStatus
  entity_id?: number | null
  entity_type?: string | null
  created_at: string
  updated_at: string
}

export interface PhotoApiResponse {
  data: Photo[]
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

export interface PhotoFilters {
  search?: string
  page?: number
  per_page?: number
  entity_id?: number
  entity_type?: string
} 