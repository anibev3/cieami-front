/* eslint-disable no-console */
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

class AssignmentValidationService {
  async validateByRepairer(assignmentId: string) {
    console.log("================================================");
    console.log('validateByRepairer', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/validate-by-repairer/${assignmentId}`)
  }

  async unvalidateByRepairer(assignmentId: string) {
    console.log("================================================");
    console.log('unvalidateByRepairer', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/unvalidate-by-repairer/${assignmentId}`)
  }

  async validateByExpert(assignmentId: string) {
    console.log("================================================");
    console.log('validateByExpert', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/validate-work-sheet-by-expert/${assignmentId}`)
  }

  async unvalidateByExpert(assignmentId: string) {
    console.log("================================================");
    console.log('unvalidateByExpert', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/unvalidate-by-expert/${assignmentId}`)
  }
}

export const assignmentValidationService = new AssignmentValidationService()
export default assignmentValidationService


