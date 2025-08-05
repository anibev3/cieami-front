import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

export interface RealizeAssignmentPayload {
  expertise_date: string | null
  expertise_place: string | null
  point_noted: string | null
  directed_by: string
  repairer_id: string | null
}

export interface RealizeAssignmentResponse {
  data: {
    id: number
    reference: string
    status: {
      id: number
      code: string
      label: string
      description: string
    }
    realized_at: string
    realized_by: {
      id: number
      name: string
      email: string
    }
    directed_by: {
      id: number
      name: string
      email: string
    } | null
  }
}

class AssignmentRealizationService {
  /**
   * Réaliser un dossier
   */
  async realizeAssignment(
    assignmentId: number, 
    payload: RealizeAssignmentPayload
  ): Promise<RealizeAssignmentResponse> {
    const response = await axiosInstance.put<RealizeAssignmentResponse>(
      `${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/realize/${assignmentId}`, 
      payload
    )
    return response.data
  }

  async updateRealizeAssignment(
    assignmentId: number, 
    payload: RealizeAssignmentPayload
  ): Promise<RealizeAssignmentResponse> {
    const response = await axiosInstance.put<RealizeAssignmentResponse>(
      `${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/update-realize/${assignmentId}`, 
      payload
    )
    return response.data
  }

  /**
   * Récupérer les détails d'un dossier pour la réalisation
   */
  async getAssignmentDetails(assignmentId: number) {
    const response = await axiosInstance.get(
      `${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`
    )
    return response.data
  }
}

export const assignmentRealizationService = new AssignmentRealizationService()
export default assignmentRealizationService 