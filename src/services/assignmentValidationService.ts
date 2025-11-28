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

  async validateQuoteByRepairer(assignmentId: string) {
    console.log("================================================");
    console.log('validateQuoteByRepairer', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/validate-quote-by-repairer/${assignmentId}`)
  }

  async unvalidateByRepairer(assignmentId: string) {
    console.log("================================================");
    console.log('unvalidateByRepairer', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/unvalidate-by-repairer/${assignmentId}`)
  }

  async unvalidateQuoteByRepairer(assignmentId: string) {
    console.log("================================================");
    console.log('unvalidateQuoteByRepairer', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/unvalidate-quote-by-repairer/${assignmentId}`)
  }

  async validateByExpert(assignmentId: string) {
    console.log("================================================");
    console.log('validateByExpert', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/validate-work-sheet-by-expert/${assignmentId}`)
  }

  async validateQuoteByExpert(assignmentId: string) {
    console.log("================================================");
    console.log('validateQuoteByExpert', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/validate-quote-by-expert/${assignmentId}`)
  }

  // validate-quote-with-conditions-by-expert
  async validateQuoteWithConditionsByExpert(assignmentId: string) {
    console.log("================================================");
    console.log('validateQuoteWithConditionsByExpert', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/validate-quote-with-conditions-by-expert/${assignmentId}`)
  }

  async unvalidateByExpert(assignmentId: string) {
    console.log("================================================");
    console.log('unvalidateByExpert', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/unvalidate-by-expert/${assignmentId}`)
  }

  async unvalidateQuoteByExpert(assignmentId: string) {
    console.log("================================================");
    console.log('unvalidateQuoteByExpert', assignmentId)
    console.log("================================================");
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/unvalidate-quote-by-expert/${assignmentId}`)
  }

  async validateByRepairerInvoiceByExpert(assignmentId: string) {
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/validate-by-expert/${assignmentId}`)
  }



  async validateEdition(assignmentId: string) {
    return axiosInstance.put(`${API_CONFIG.BASE_URL}/assignments/validate-edition/${assignmentId}`)
  }
}

export const assignmentValidationService = new AssignmentValidationService()
export default assignmentValidationService


