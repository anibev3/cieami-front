import axiosInstance from '@/lib/axios'
import { Assignment, AssignmentCreate, AssignmentUpdate, AssignmentApiResponse, AssignmentFilters } from '@/types/assignments'
import { API_CONFIG } from '@/config/api'

class AssignmentService {
  /**
   * Récupérer la liste des assignations avec pagination et filtres
   */
  async getAssignments(page: number = 1, filters?: AssignmentFilters): Promise<AssignmentApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status_code && { status_code: filters.status_code }),
      ...(filters?.client_id && { client_id: filters.client_id }),
      ...(filters?.expert_id && { expert_id: filters.expert_id }),
      ...(filters?.assignment_type_id && { assignment_type_id: filters.assignment_type_id }),
      ...(filters?.date_from && { date_from: filters.date_from }),
      ...(filters?.date_to && { date_to: filters.date_to }),
    })

    const response = await axiosInstance.get<AssignmentApiResponse>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}?${params}`)
    return response.data
  }

  async getAssignmentsEditionExpired(date_from: string, date_to: string, assignment_type_id: number): Promise<AssignmentApiResponse> {
    const response = await axiosInstance.get<AssignmentApiResponse>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS_EDITION_EXPIRED}?date_from=${date_from}&date_to=${date_to}&assignment_type_id=${assignment_type_id}`)
    return response.data
  }

  async getAssignmentsRecoveryExpired(date_from: string, date_to: string, assignment_type_id: number): Promise<AssignmentApiResponse> {
    const response = await axiosInstance.get<AssignmentApiResponse>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS_RECOVERY_EXPIRED}?date_from=${date_from}&date_to=${date_to}&assignment_type_id=${assignment_type_id}`)
    return response.data
  }

  /**
   * Récupérer une assignation par son ID
   */
  async getAssignment(id: number): Promise<Assignment> {
    const response = await axiosInstance.get<Assignment>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${id}`)
    return response.data
  }

  /**
   * Créer une nouvelle assignation
   */
  async createAssignment(assignmentData: AssignmentCreate): Promise<Assignment> {
    const response = await axiosInstance.post<Assignment>(API_CONFIG.ENDPOINTS.ASSIGNMENTS, assignmentData)
    return response.data
  }

  /**
   * Mettre à jour une assignation
   */
  async updateAssignment(id: number, assignmentData: AssignmentUpdate): Promise<Assignment> {
    const response = await axiosInstance.put<Assignment>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${id}`, assignmentData)
    return response.data
  }

  /**
   * Supprimer une assignation
   */
  async deleteAssignment(id: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${id}`)
  }

  /**
   * Changer le statut d'une assignation
   */
  async changeAssignmentStatus(id: number, statusId: number): Promise<Assignment> {
    const response = await axiosInstance.patch<Assignment>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${id}/status`, {
      status_id: statusId
    })
    return response.data
  }
}

// Export d'une instance singleton
export const assignmentService = new AssignmentService()
export default assignmentService 