import axiosInstance from '@/lib/axios'
import { 
  Entity, 
  EntityResponse, 
  CreateEntityData, 
  UpdateEntityData,
  EntityFilters 
} from '@/types/administration'

class EntityService {
  private baseUrl = '/entities'

  /**
   * Récupérer toutes les entités avec pagination
   */
  async getAll(filters?: EntityFilters): Promise<EntityResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.entity_type) {
      params.append('entity_type_id', filters.entity_type)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    // if (filters?.per_page) {
    //   params.append('per_page', filters.per_page.toString())
    // }

    const response = await axiosInstance.get<EntityResponse>(
      `${this.baseUrl}?${params.toString()}&per_page=100000`
    )
    return response.data
  }

  /**
   * Récupérer une entité par ID
   */
  async getById(id: number): Promise<Entity> {
    const response = await axiosInstance.get<Entity>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer une nouvelle entité
   */
  async create(data: CreateEntityData): Promise<Entity> {
    const response = await axiosInstance.post<Entity>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour une entité
   */
  async update(id: number, data: UpdateEntityData): Promise<Entity> {
    const response = await axiosInstance.put<Entity>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer une entité
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Activer une entité
   */
  async enable(id: number): Promise<Entity> {
    const response = await axiosInstance.put<Entity>(`${this.baseUrl}/${id}/enable`)
    return response.data
  }

  /**
   * Désactiver une entité
   */
  async disable(id: number): Promise<Entity> {
    const response = await axiosInstance.put<Entity>(`${this.baseUrl}/${id}/disable`)
    return response.data
  }

  /**
   * Rechercher des entités
   */
  async search(query: string): Promise<EntityResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Récupérer les entités par statut
   */
  async getByStatus(status: string): Promise<EntityResponse> {
    return this.getAll({ status })
  }

  /**
   * Récupérer les entités par type
   */
  async getByEntityType(entityType: string): Promise<EntityResponse> {
    return this.getAll({ entity_type: entityType })
  }
}

// Export d'une instance singleton
export const entityService = new EntityService()
export default entityService 