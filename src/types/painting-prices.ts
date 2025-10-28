// Types pour les relations
export interface HourlyRate {
  id: number
  value: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface PaintType {
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
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Status {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

// Type principal pour PaintingPrice
export interface PaintingPrice {
  id: number
  code: string | null
  label: string | null
  description: string | null
  hourly_rate: HourlyRate
  paint_type: PaintType
  number_paint_element: NumberPaintElement
  status: Status
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface PaintingPriceCreate {
  hourly_rate_id: string | number
  paint_type_id: string | number
  number_paint_element_id: string | number
  param_1?: number
  param_2?: number
}

export interface PaintingPriceUpdate {
  hourly_rate_id?: string | number
  paint_type_id?: string | number
  number_paint_element_id?: string | number
  param_1?: number
  param_2?: number
}

export interface PaintingPricesResponse {
  data: PaintingPrice[]
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

export interface PaintingPriceResponse {
  data: PaintingPrice
} 