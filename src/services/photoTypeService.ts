import axiosInstance from '@/lib/axios'
import { 
  PhotoType, 
  PhotoTypeResponse, 
  CreatePhotoTypeData, 
  UpdatePhotoTypeData,
  PhotoTypeFilters 
} from '@/types/gestion'

class PhotoTypeService {
  private baseUrl = '/photo-types'

  /**
   * Récupérer tous les types de photos avec pagination
   */
  async getAll(filters?: PhotoTypeFilters): Promise<PhotoTypeResponse> {
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

    const response = await axiosInstance.get<PhotoTypeResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un type de photo par ID
   */
  async getById(id: number): Promise<PhotoType> {
    const response = await axiosInstance.get<{ status: number; message: string; data: PhotoType }>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer un nouveau type de photo
   */
  async create(data: CreatePhotoTypeData): Promise<PhotoType> {
    const response = await axiosInstance.post<{ status: number; message: string; data: PhotoType }>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour un type de photo
   */
  async update(id: number, data: UpdatePhotoTypeData): Promise<PhotoType> {
    const response = await axiosInstance.post<{ status: number; message: string; data: PhotoType }>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer un type de photo
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des types de photos
   */
  async search(query: string): Promise<PhotoTypeResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const photoTypeService = new PhotoTypeService()
export default photoTypeService 