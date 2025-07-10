import axiosInstance from '@/lib/axios'

export interface VehicleEnergy {
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
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface VehicleEnergyResponse {
  data: VehicleEnergy[]
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

export interface CreateVehicleEnergyData {
  label: string
  description: string
}

export interface UpdateVehicleEnergyData {
  label?: string
  description?: string
}

export interface VehicleEnergyFilters {
  search?: string
  page?: number
  per_page?: number
}

class VehicleEnergyService {
  private baseUrl = '/vehicle-energies'

  /**
   * Récupérer toutes les énergies de véhicules avec pagination
   */
  async getAll(filters?: VehicleEnergyFilters): Promise<VehicleEnergyResponse> {
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

    const response = await axiosInstance.get<VehicleEnergyResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer une énergie de véhicule par ID
   */
  async getById(id: number): Promise<VehicleEnergy> {
    const response = await axiosInstance.get<VehicleEnergy>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer une nouvelle énergie de véhicule
   */
  async create(data: CreateVehicleEnergyData): Promise<VehicleEnergy> {
    const response = await axiosInstance.post<VehicleEnergy>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour une énergie de véhicule
   */
  async update(id: number, data: UpdateVehicleEnergyData): Promise<VehicleEnergy> {
    const response = await axiosInstance.put<VehicleEnergy>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer une énergie de véhicule
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des énergies de véhicules
   */
  async search(query: string): Promise<VehicleEnergyResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const vehicleEnergyService = new VehicleEnergyService()
export default vehicleEnergyService 