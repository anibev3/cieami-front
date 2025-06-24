import axiosInstance from '@/lib/axios'
import { 
  EntityType, 
  EntityTypeResponse, 
  CreateEntityTypeData, 
  UpdateEntityTypeData,
  EntityTypeFilters 
} from '@/types/administration'

class EntityTypeService {
  private baseUrl = '/entity-types'

  /**
   * Récupérer tous les types d'entité avec pagination
   */
  async getAll(filters?: EntityTypeFilters): Promise<EntityTypeResponse> {
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

    const response = await axiosInstance.get<EntityTypeResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un type d'entité par ID
   */
  async getById(id: number): Promise<EntityType> {
    const response = await axiosInstance.get<EntityType>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau type d'entité
   */
  async create(data: CreateEntityTypeData): Promise<EntityType> {
    const response = await axiosInstance.post<EntityType>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un type d'entité
   */
  async update(id: number, data: UpdateEntityTypeData): Promise<EntityType> {
    const response = await axiosInstance.put<EntityType>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un type d'entité
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Activer un type d'entité
   */
  async enable(id: number): Promise<EntityType> {
    const response = await axiosInstance.put<EntityType>(`${this.baseUrl}/${id}/enable`)
    return response.data
  }

  /**
   * Désactiver un type d'entité
   */
  async disable(id: number): Promise<EntityType> {
    const response = await axiosInstance.put<EntityType>(`${this.baseUrl}/${id}/disable`)
    return response.data
  }

  /**
   * Rechercher des types d'entité
   */
  async search(query: string): Promise<EntityTypeResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const entityTypeService = new EntityTypeService()
export default entityTypeService 