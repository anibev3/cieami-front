export interface TechnicalConclusion {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface TechnicalConclusionCreate {
  label: string
  description: string
}

export interface TechnicalConclusionUpdate {
  label: string
  description: string
}

export interface TechnicalConclusionsResponse {
  data: TechnicalConclusion[]
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

export interface TechnicalConclusionResponse {
  data: TechnicalConclusion
} 