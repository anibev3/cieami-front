import axiosInstance from '@/lib/axios'

export interface VehicleGenre {
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

export interface VehicleGenreResponse {
  data: VehicleGenre[]
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

export interface CreateVehicleGenreData {
  code: string
  label: string
  description: string
}

export interface UpdateVehicleGenreData {
  label?: string
  description?: string
}

export interface VehicleGenreFilters {
  search?: string
  page?: number
  per_page?: number
}

class VehicleGenreService {
  private baseUrl = '/vehicle-genres'

  /**
   * Récupérer tous les genres de véhicules avec pagination
   */
  async getAll(filters?: VehicleGenreFilters): Promise<VehicleGenreResponse> {
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

    const response = await axiosInstance.get<VehicleGenreResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un genre de véhicule par ID
   */
  async getById(id: number): Promise<VehicleGenre> {
    const response = await axiosInstance.get<VehicleGenre>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau genre de véhicule
   */
  async create(data: CreateVehicleGenreData): Promise<VehicleGenre> {
    const response = await axiosInstance.post<VehicleGenre>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un genre de véhicule
   */
  async update(id: number, data: UpdateVehicleGenreData): Promise<VehicleGenre> {
    const response = await axiosInstance.put<VehicleGenre>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un genre de véhicule
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des genres de véhicules
   */
  async search(query: string): Promise<VehicleGenreResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const vehicleGenreService = new VehicleGenreService()
export default vehicleGenreService 