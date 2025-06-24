export interface PaintType {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface PaintTypeCreate {
  code: string
  label: string
  description: string
}

export interface PaintTypeUpdate {
  code?: string
  label?: string
  description?: string
}

export interface PaintTypesResponse {
  data: PaintType[]
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

export interface PaintTypeResponse {
  data: PaintType
} 