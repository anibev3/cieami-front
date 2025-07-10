import axiosInstance from '@/lib/axios'

export interface VehicleAge {
  id: number
  value: number
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
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface VehicleAgeResponse {
  data: VehicleAge[]
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

export interface CreateVehicleAgeData {
  value: number
  label: string
  description: string
}

export interface UpdateVehicleAgeData {
  value?: number
  label?: string
  description?: string
}

export interface VehicleAgeFilters {
  search?: string
  page?: number
  per_page?: number
}

class VehicleAgeService {
  private baseUrl = '/vehicle-ages'

  /**
   * Récupérer tous les âges de véhicules avec pagination
   */
  async getAll(filters?: VehicleAgeFilters): Promise<VehicleAgeResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<VehicleAgeResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un âge de véhicule par ID
   */
  async getById(id: number): Promise<VehicleAge> {
    const response = await axiosInstance.get<VehicleAge>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouvel âge de véhicule
   */
  async create(data: CreateVehicleAgeData): Promise<VehicleAge> {
    const response = await axiosInstance.post<VehicleAge>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un âge de véhicule
   */
  async update(id: number, data: UpdateVehicleAgeData): Promise<VehicleAge> {
    const response = await axiosInstance.put<VehicleAge>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un âge de véhicule
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des âges de véhicules
   */
  async search(query: string): Promise<VehicleAgeResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const vehicleAgeService = new VehicleAgeService()
export default vehicleAgeService 