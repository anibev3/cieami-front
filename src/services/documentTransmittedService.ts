import axiosInstance from '@/lib/axios'
import { 
  DocumentTransmitted, 
  DocumentTransmittedResponse, 
  CreateDocumentTransmittedData, 
  UpdateDocumentTransmittedData,
  DocumentTransmittedFilters 
} from '@/types/administration'

class DocumentTransmittedService {
  private baseUrl = '/document-transmitteds'

  /**
   * Récupérer tous les documents transmis avec pagination
   */
  async getAll(filters?: DocumentTransmittedFilters): Promise<DocumentTransmittedResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<DocumentTransmittedResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un document transmis par ID
   */
  async getById(id: number): Promise<DocumentTransmitted> {
    const response = await axiosInstance.get<DocumentTransmitted>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau document transmis
   */
  async create(data: CreateDocumentTransmittedData): Promise<DocumentTransmitted> {
    const response = await axiosInstance.post<DocumentTransmitted>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un document transmis
   */
  async update(id: number, data: UpdateDocumentTransmittedData): Promise<DocumentTransmitted> {
    const response = await axiosInstance.put<DocumentTransmitted>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un document transmis
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des documents transmis
   */
  async search(query: string): Promise<DocumentTransmittedResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Récupérer les documents transmis par statut
   */
  async getByStatus(status: string): Promise<DocumentTransmittedResponse> {
    return this.getAll({ status })
  }
}

// Export d'une instance singleton
export const documentTransmittedService = new DocumentTransmittedService()
export default documentTransmittedService 