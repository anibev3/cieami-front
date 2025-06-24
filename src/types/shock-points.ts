import { Status } from './painting-prices'

export interface ShockPoint {
  id: number
  code: string
  label: string
  description: string
  status: Status
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ShockPointCreate {
  code: string
  label: string
  description: string
}

export interface ShockPointUpdate {
  label?: string
  description?: string
}

export interface ShockPointsResponse {
  data: ShockPoint[]
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

export interface ShockPointResponse {
  data: ShockPoint
} 