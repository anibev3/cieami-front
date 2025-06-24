export interface Status {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface NumberPaintElement {
  id: number
  value: number
  label: string
  description: string
  status: Status
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface NumberPaintElementCreate {
  value: number
  label: string
  description: string
}

export interface NumberPaintElementUpdate {
  value?: number
  label?: string
  description?: string
}

export interface NumberPaintElementsResponse {
  data: NumberPaintElement[]
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

export interface NumberPaintElementResponse {
  data: NumberPaintElement
} 