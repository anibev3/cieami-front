/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '@/lib/axios'
import { 
  AssignmentRequest, 
  AssignmentRequestApiResponse, 
  AssignmentRequestFilters,
  AssignmentRequestUpdate
} from '@/types/assignment-requests'
import { API_CONFIG } from '@/config/api'

class AssignmentRequestService {
  /**
   * Récupérer la liste des demandes d'expertise avec pagination et filtres
   */
  async getAssignmentRequests(page: number = 1, filters?: AssignmentRequestFilters): Promise<AssignmentRequestApiResponse> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.status_code) params.append('status_code', filters.status_code)
    if (filters?.insurer_id) params.append('insurer_id', filters.insurer_id.toString())
    if (filters?.repairer_id) params.append('repairer_id', filters.repairer_id.toString())
    if (filters?.client_id) params.append('client_id', filters.client_id.toString())
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id.toString())
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())

    const response = await axiosInstance.get<AssignmentRequestApiResponse>(
      `${API_CONFIG.ENDPOINTS.ASSIGNMENT_REQUESTS}?${params}`
    )
    return response.data
  }

  /**
   * Récupérer une demande d'expertise par son ID
   */
  async getAssignmentRequest(id: string): Promise<{ status: number; message: string | null; data: AssignmentRequest }> {
    const response = await axiosInstance.get<{ status: number; message: string | null; data: AssignmentRequest }>(
      `${API_CONFIG.ENDPOINTS.ASSIGNMENT_REQUESTS}/${id}`
    )
    return response.data
  }

  /**
   * Récupérer une demande d'expertise par son ID (alias pour getAssignmentRequest)
   */
  async getAssignmentRequestByAssignmentId(assignmentId: string): Promise<{ status: number; message: string | null; data: AssignmentRequest }> {
    return this.getAssignmentRequest(assignmentId)
  }

  /**
   * Mettre à jour une demande d'expertise
   */
  async updateAssignmentRequest(id: string, data: AssignmentRequestUpdate): Promise<AssignmentRequest> {
    const response = await axiosInstance.put<AssignmentRequest>(
      `${API_CONFIG.ENDPOINTS.ASSIGNMENT_REQUESTS}/${id}`,
      data
    )
    return response.data
  }

  /**
   * Supprimer une demande d'expertise
   */
  async deleteAssignmentRequest(id: string): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.ASSIGNMENT_REQUESTS}/${id}`)
  }

  /**
   * Rejeter une demande d'expertise
   */
  async rejectAssignmentRequest(id: string): Promise<AssignmentRequest> {
    const response = await axiosInstance.put<AssignmentRequest>(
      `${API_CONFIG.ENDPOINTS.ASSIGNMENT_REQUESTS}/${id}/reject`
    )
    return response.data
  }
}

// Export d'une instance singleton
export const assignmentRequestService = new AssignmentRequestService()
export default assignmentRequestService

