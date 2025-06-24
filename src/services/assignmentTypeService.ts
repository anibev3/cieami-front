import axiosInstance from '@/lib/axios'
import { AssignmentType, AssignmentTypeCreate, AssignmentTypeUpdate, AssignmentTypeApiResponse, AssignmentTypeFilters } from '@/types/assignment-types'
import { API_CONFIG } from '@/config/api'

class AssignmentTypeService {
  /**
   * Récupérer la liste des types d'affectation avec pagination et filtres
   */
  async getAssignmentTypes(page: number = 1, filters?: AssignmentTypeFilters): Promise<AssignmentTypeApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status_id && { status_id: filters.status_id }),
    })

    const response = await axiosInstance.get<AssignmentTypeApiResponse>(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES}?${params}`)
    return response.data
  }

  /**
   * Récupérer un type d'affectation par son ID
   */
  async getAssignmentType(id: number): Promise<AssignmentType> {
    const response = await axiosInstance.get<AssignmentType>(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau type d'affectation
   */
  async createAssignmentType(assignmentTypeData: AssignmentTypeCreate): Promise<AssignmentType> {
    const response = await axiosInstance.post<AssignmentType>(API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES, assignmentTypeData)
    return response.data
  }

  /**
   * Mettre à jour un type d'affectation
   */
  async updateAssignmentType(id: number, assignmentTypeData: AssignmentTypeUpdate): Promise<AssignmentType> {
    const response = await axiosInstance.put<AssignmentType>(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES}/${id}`, assignmentTypeData)
    return response.data
  }

  /**
   * Supprimer un type d'affectation
   */
  async deleteAssignmentType(id: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_TYPES}/${id}`)
  }
}

// Export d'une instance singleton
export const assignmentTypeService = new AssignmentTypeService()
export default assignmentTypeService 