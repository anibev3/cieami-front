export interface AssignmentType {
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

export interface AssignmentTypeCreate {
  code: string
  label: string
  description: string
}

export interface AssignmentTypeUpdate {
  code?: string
  label?: string
  description?: string
}

export interface AssignmentTypeFilters {
  search?: string
  status_id?: string
}

export interface AssignmentTypeApiResponse {
  data: AssignmentType[]
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