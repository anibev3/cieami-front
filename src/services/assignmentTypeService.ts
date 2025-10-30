import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

interface AssignmentType {
  id: number
  code: string
  label: string
  description: string
  created_at: string
  updated_at: string
}

interface CreateAssignmentTypeData {
  code: string
  label: string
  description?: string
}

interface UpdateAssignmentTypeData {
  code?: string
  label?: string
  description?: string
}

interface AssignmentTypeApiResponse {
  data: AssignmentType[]
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

class AssignmentTypeService {
  /**
   * Récupérer la liste des types d'assignation
   */
  async getAssignmentTypes(page: number = 1): Promise<AssignmentTypeApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
    })

    const response = await axiosInstance.get<AssignmentTypeApiResponse>(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES}?${params}`)
    return response.data
  }

  /**
   * Récupérer un Type de mission par son ID
   */
  async getAssignmentType(id: number): Promise<AssignmentType> {
    const response = await axiosInstance.get<{status: number, message: string | null, data: AssignmentType}>(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES}/${id}`)
    return response.data.data
  }

  /**
   * Créer un nouveau Type de mission
   */
  async createAssignmentType(assignmentTypeData: CreateAssignmentTypeData): Promise<AssignmentType> {
    const response = await axiosInstance.post<{status: number, message: string | null, data: AssignmentType}>(API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES, assignmentTypeData)
    return response.data.data
  }

  /**
   * Mettre à jour un Type de mission
   */
  async updateAssignmentType(id: number, assignmentTypeData: UpdateAssignmentTypeData): Promise<AssignmentType> {
    const response = await axiosInstance.put<{status: number, message: string | null, data: AssignmentType}>(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES}/${id}`, assignmentTypeData)
    return response.data.data
  }

  /**
   * Supprimer un Type de mission
   */
  async deleteAssignmentType(id: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES}/${id}`)
  }
}

// Export d'une instance singleton
export const assignmentTypeService = new AssignmentTypeService()
export default assignmentTypeService 