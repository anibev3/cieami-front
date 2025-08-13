/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import axiosInstance from '@/lib/axios'
import { 
  Assignment, 
  AssignmentCreate, 
  AssignmentUpdate, 
  AssignmentApiResponse, 
  AssignmentFilters,
  EvaluationCalculationRequest,
  EvaluationCalculationResponse,
  EvaluationSubmissionRequest,
  EvaluationSubmissionResponse
} from '@/types/assignments'
import { API_CONFIG } from '@/config/api'

class AssignmentService {
  /**
   * Récupérer la liste des assignations avec pagination et filtres
   */
  async getAssignments(page: number = 1, filters?: AssignmentFilters): Promise<AssignmentApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters?.search && { search: filters.search }),
      // ...(filters?.status_code && { status_code: filters.status_code }),
      ...(filters?.client_id && { client_id: filters.client_id }),
      ...(filters?.expert_id && { expert_id: filters.expert_id }),
      ...(filters?.assignment_type_id && { assignment_type_id: filters.assignment_type_id }),
      ...(filters?.date_from && { date_from: filters.date_from }),
      ...(filters?.date_to && { date_to: filters.date_to }),
    })

    const statusParam = filters?.status_code ? `&status_id=${filters.status_code}` : '';
    const isSelectedParam = filters?.is_selected ? `&per_page=100000` : '';
    const response = await axiosInstance.get<AssignmentApiResponse>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}?${params}${statusParam}${isSelectedParam}`)
    return response.data
  }

  async getAssignmentsEditionExpired(page: number = 1, filters?: AssignmentFilters): Promise<AssignmentApiResponse> {
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
    const response = await axiosInstance.get<AssignmentApiResponse>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS_EDITION_EXPIRED}?${params}`)
    console.log("================================================");
    console.log(response.data.data)
    console.log("================================================");
    return response.data.data
  }

  async getAssignmentsRecoveryExpired(page: number = 1, filters?: AssignmentFilters): Promise<AssignmentApiResponse> {
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
    const response = await axiosInstance.get<AssignmentApiResponse>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS_RECOVERY_EXPIRED}?${params}`)
    return response.data.data
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

  /**
   * Calculer l'évaluation d'une assignation
   */
  async calculateEvaluation(data: EvaluationCalculationRequest): Promise<EvaluationCalculationResponse> {
    const response = await axiosInstance.post<EvaluationCalculationResponse>(
      API_CONFIG.ENDPOINTS.CALCULATE_EVALUATION, 
      data
    )
    return response.data
  }

  /**
   * Soumettre l'évaluation d'une assignation
   */
  async submitEvaluation(assignmentId: number, data: EvaluationSubmissionRequest): Promise<EvaluationSubmissionResponse> {
    const response = await axiosInstance.post<EvaluationSubmissionResponse>(
      `${API_CONFIG.ENDPOINTS.EVALUATE}/${assignmentId}`, 
      data
    )
    return response.data
  }

  /**
   * Générer le rapport d'expertise
   */
  async generateReport(id: number): Promise<{ message: string | null, data: any }> {
    const response = await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${id}/generate`)
    return response.data
  }

  /**
   * Réorganiser l'ordre des chocs d'une assignation
   */
  async reorderShocks(assignmentId: number, shockIds: number[]): Promise<{ message: string }> {
    const response = await axiosInstance.put<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}/order-shocks`,
      { shocks: shockIds }
    )
    return response.data
  }

  /**
   * Réorganiser les travaux de choc (fournitures)
   */
  async reorderShockWorks(shockId: number, shockWorkIds: number[]): Promise<{ message: string }> {
    const response = await axiosInstance.put<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.SHOCKS}/${shockId}/order-shock-works`,
      { shock_works: shockWorkIds }
    )
    return response.data
  }

  /**
   * Réorganiser les main d'œuvre de choc
   */
  async reorderWorkforces(shockId: number, workforceIds: number[]): Promise<{ message: string }> {
    const response = await axiosInstance.put<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.SHOCKS}/${shockId}/order-workforces`,
      { workforces: workforceIds }
    )
    return response.data
  }

  /**
   * Supprimer un choc
   */
  async deleteShock(shockId: number): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.DELETE_SHOCK}/${shockId}`
    )
    return response.data
  }
}

// Export d'une instance singleton
export const assignmentService = new AssignmentService()
export default assignmentService 