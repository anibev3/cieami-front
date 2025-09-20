import axiosInstance from '@/lib/axios'
import { 
  Photo, 
  PhotoResponse, 
  CreatePhotoData, 
  UpdatePhotoData,
  PhotoFilters 
} from '@/types/gestion'

class PhotoService {
  private baseUrl = '/photos'

  /**
   * Récupérer toutes les photos avec pagination
   */
  async getAll(filters?: PhotoFilters): Promise<PhotoResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.assignment_id) {
      params.append('assignment_id', filters.assignment_id)
    }
    if (filters?.photo_type_id) {
      params.append('photo_type_id', filters.photo_type_id)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<PhotoResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer une photo par ID
   */
  async getById(id: number): Promise<Photo> {
    const response = await axiosInstance.get<{ status: number; message: string; data: Photo }>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer de nouvelles photos (upload multiple)
   */
  async create(data: CreatePhotoData): Promise<Photo[]> {
    const formData = new FormData()
    formData.append('assignment_id', data.assignment_id)
    formData.append('photo_type_id', data.photo_type_id)
    
    data.photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo)
    })

    const response = await axiosInstance.post<{ status: number; message: string; data: Photo[] }>(
      this.baseUrl, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  }

  /**
   * Mettre à jour une photo
   */
  async update(id: number, data: UpdatePhotoData): Promise<Photo> {
    const formData = new FormData()
    formData.append('photo_type_id', data.photo_type_id)
    formData.append('photo', data.photo)

    const response = await axiosInstance.post<{ status: number; message: string; data: Photo }>(
      `${this.baseUrl}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  }

  /**
   * Supprimer une photo
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Définir une photo comme photo de couverture
   */
  async setAsCover(id: number): Promise<Photo> {
    const response = await axiosInstance.put<{ status: number; message: string; data: Photo }>(
      `${this.baseUrl}/${id}/cover`
    )
    return response.data.data
  }

  /**
   * Rechercher des photos
   */
  async search(query: string): Promise<PhotoResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Récupérer les photos par assignation
   */
  async getByAssignment(assignmentId: string): Promise<PhotoResponse> {
    return this.getAll({ assignment_id: assignmentId })
  }

  /**
   * Récupérer les photos par type
   */
  async getByPhotoType(photoTypeId: string): Promise<PhotoResponse> {
    return this.getAll({ photo_type_id: photoTypeId })
  }

  /**
   * Réorganiser l'ordre des photos
   */
  async reorderPhotos(assignmentId: string, photoIds: number[]): Promise<void> {
    await axiosInstance.put(`/assignments/${assignmentId}/order-photos`, {
      photos: photoIds
    })
  }
}

// Export d'une instance singleton
export const photoService = new PhotoService()
export default photoService 