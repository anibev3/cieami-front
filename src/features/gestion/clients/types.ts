export interface Client {
  id: number
  name: string
  email: string
  phone_1?: string | null
  phone_2?: string | null
  address?: string | null
  deleted_at?: string | null
  created_at: string
  updated_at: string
}

export interface ClientStatus {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ClientApiResponse {
  data: Client[]
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

export interface ClientFilters {
  search?: string
  page?: number
  per_page?: number
} 