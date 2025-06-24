import { Status } from './painting-prices'

export interface WorkforceType {
  id: number
  code: string
  label: string
  description: string
  status: Status
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface WorkforceTypeCreate {
  code: string
  label: string
  description: string
}

export interface WorkforceTypeUpdate {
  code?: string
  label?: string
  description?: string
}

export interface WorkforceTypesResponse {
  data: WorkforceType[]
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

export interface WorkforceTypeResponse {
  data: WorkforceType
} 