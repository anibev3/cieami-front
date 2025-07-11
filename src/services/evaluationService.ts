import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { 
  EvaluationCalculationRequest,
  EvaluationCalculationResponse,
  EvaluationSubmissionRequest,
  EvaluationSubmissionResponse
} from '@/types/assignments'

class EvaluationService {
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
}

// Export d'une instance singleton
export const evaluationService = new EvaluationService()
export default evaluationService 