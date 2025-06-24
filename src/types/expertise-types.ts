import { Status } from './painting-prices'

export interface ExpertiseType {
  id: number
  code: string
  label: string
  description: string
  status: Status
  created_at: string
  updated_at: string
}

export interface ExpertiseTypeCreate {
  code: string
  label: string
  description: string
}

export interface ExpertiseTypeUpdate {
  code?: string
  label?: string
  description?: string

}

export interface ExpertiseTypesResponse {
  data: ExpertiseType[]
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

export interface ExpertiseTypeResponse {
  data: ExpertiseType
} 