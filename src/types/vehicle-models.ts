export interface VehicleModel {
  id: number
  code: string
  label: string
  description: string
  brand: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  status: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface VehicleModelCreate {
  code: string
  label: string
  description: string
  brand_id: string
}

export interface VehicleModelUpdate {
  label?: string
  description?: string
  brand_id?: string
}

export interface VehicleModelFilters {
  search?: string
  status?: string
  brand_id?: string
}

export interface VehicleModelApiResponse {
  data: VehicleModel[]
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