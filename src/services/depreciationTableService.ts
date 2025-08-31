import axiosInstance from '@/lib/axios'

export interface VehicleGenre {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface VehicleAge {
  id: number
  value: number
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface DepreciationTable {
  id: number
  value: string
  vehicle_genre: VehicleGenre
  vehicle_age: VehicleAge
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

export interface DepreciationTableResponse {
  data: DepreciationTable[]
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

export interface CreateDepreciationTableData {
  vehicle_genre_id: string
  vehicle_age_id: string
  value: number
}

export interface UpdateDepreciationTableData {
  vehicle_genre_id?: string
  vehicle_age_id?: string
  value?: number
}

export interface DepreciationTableFilters {
  search?: string
  page?: number
  per_page?: number
  vehicle_genre_id?: number
  vehicle_age_id?: number
}

export interface TheoreticalValueCalculationData {
  first_entry_into_circulation_date: string
  expertise_date: string
  vehicle_genre_id: string
  vehicle_energy_id: string
  vehicle_new_value: number
  vehicle_mileage: number
}

export interface TheoreticalValueCalculationResult {
  expertise_date: string
  first_entry_into_circulation_date: string
  vehicle_new_value: number
  year_diff: number
  month_diff: number
  vehicle_age: number
  theorical_depreciation_rate: string
  theorical_vehicle_market_value: number
  is_up: boolean
  market_incidence_rate: number
  market_incidence: number
  kilometric_incidence: number
  vehicle_market_value: number
}

export interface TheoreticalValueCalculationResponse {
  status: number
  message: string
  data: TheoreticalValueCalculationResult
}

class DepreciationTableService {
  private baseUrl = '/depreciation-tables'

  /**
   * Récupérer tous les tableaux de dépréciation avec pagination
   */
  async getAll(filters?: DepreciationTableFilters): Promise<DepreciationTableResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('q', filters.search)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }
    if (filters?.vehicle_genre_id) {
      params.append('vehicle_genre_id', filters.vehicle_genre_id.toString())
    }
    if (filters?.vehicle_age_id) {
      params.append('vehicle_age_id', filters.vehicle_age_id.toString())
    }

    const response = await axiosInstance.get<DepreciationTableResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un tableau de dépréciation par ID
   */
  async getById(id: number): Promise<DepreciationTable> {
    const response = await axiosInstance.get<DepreciationTable>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau tableau de dépréciation
   */
  async create(data: CreateDepreciationTableData): Promise<DepreciationTable> {
    const response = await axiosInstance.post<DepreciationTable>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un tableau de dépréciation
   */
  async update(id: number, data: UpdateDepreciationTableData): Promise<DepreciationTable> {
    const response = await axiosInstance.put<DepreciationTable>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un tableau de dépréciation
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des tableaux de dépréciation
   */
  async search(query: string): Promise<DepreciationTableResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Calculer la valeur vénale théorique d'un véhicule
   */
  async calculateTheoreticalValue(data: TheoreticalValueCalculationData): Promise<TheoreticalValueCalculationResult> {
    const response = await axiosInstance.post<TheoreticalValueCalculationResponse>(
      `${this.baseUrl}/calculate-theoretical-market-value`,
      data
    )
    return response.data.data
  }
}

// Export d'une instance singleton
export const depreciationTableService = new DepreciationTableService()
export default depreciationTableService 