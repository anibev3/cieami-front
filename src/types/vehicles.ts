export interface Vehicle {
  id: number
  license_plate: string
  usage: string
  type: string
  option: string
  mileage: number
  serial_number: string
  first_entry_into_circulation_date: string | null
  technical_visit_date: string | null
  fiscal_power: number
  nb_seats: number
  new_market_value: number | null
  payload: number | null
  brand: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  vehicle_model: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  vehicle_genre: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  vehicle_energy: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  color: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  bodywork: {
    id: number
    code: string
    label: string
    description: string
    status: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    created_at: string
    updated_at: string
  }
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface VehicleCreate {
  license_plate: string
  usage?: string
  type: string | null | undefined
  option: string | null | undefined
  bodywork_id: string | null | undefined
  mileage: number | null | undefined
  serial_number: string | null | undefined
  first_entry_into_circulation_date?: string | null | undefined
  technical_visit_date?: string | null | undefined
  fiscal_power: number | null | undefined
  nb_seats: number | null | undefined
  new_market_value?: number | null | undefined
  payload?: number | null | undefined
  vehicle_model_id: string
  color_id: string | null | undefined
  vehicle_genre_id?: string | null | undefined
  vehicle_energy_id?: string | null | undefined
}

export interface VehicleUpdate {
  license_plate?: string
  usage?: string
  type?: string
  option?: string
  bodywork_id?: string
  mileage?: number
  serial_number?: string
  first_entry_into_circulation_date?: string
  technical_visit_date?: string
  fiscal_power?: number
  nb_seats?: number
  new_market_value?: number
  payload?: number
  vehicle_model_id?: string
  color_id?: string
  vehicle_genre_id?: string
  vehicle_energy_id?: string
}

export interface VehicleFilters {
  search?: string
  brand_id?: string
  vehicle_model_id?: string
  color_id?: string
  bodywork_id?: string
}

export interface VehicleApiResponse {
  data: Vehicle[]
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