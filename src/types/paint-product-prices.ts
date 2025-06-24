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

export interface PaintProductPrice {
  id: number
  code: string | null
  label: string | null
  description: string | null
  paint_type: PaintType
  number_paint_element: NumberPaintElement
  status: Status
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface PaintProductPriceCreate {
  value: number
  paint_type_id: string | number
  number_paint_element_id: string | number
}

export interface PaintProductPriceUpdate {
  value?: number
  paint_type_id?: string | number
  number_paint_element_id?: string | number
}

export interface PaintProductPricesResponse {
  data: PaintProductPrice[]
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

export interface PaintProductPriceResponse {
  data: PaintProductPrice
} 