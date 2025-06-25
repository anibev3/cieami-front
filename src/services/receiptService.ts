import axiosInstance from '@/lib/axios'
import { Receipt, ReceiptCreate, ReceiptUpdate } from '@/types/assignments'
import { API_CONFIG } from '@/config/api'

class ReceiptService {
  /**
   * Récupérer les quittances d'une assignation
   */
  async getReceiptsByAssignment(assignmentId: number): Promise<Receipt[]> {
    const response = await axiosInstance.get<Receipt[]>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}/receipts`)
    return response.data
  }

  /**
   * Créer une nouvelle quittance
   */
  async createReceipt(receiptData: ReceiptCreate): Promise<Receipt> {
    const response = await axiosInstance.post<Receipt>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${receiptData.assignment_id}/receipts`, receiptData)
    return response.data
  }

  /**
   * Mettre à jour une quittance
   */
  async updateReceipt(assignmentId: number, receiptId: number, receiptData: ReceiptUpdate): Promise<Receipt> {
    const response = await axiosInstance.put<Receipt>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}/receipts/${receiptId}`, receiptData)
    return response.data
  }

  /**
   * Supprimer une quittance
   */
  async deleteReceipt(assignmentId: number, receiptId: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}/receipts/${receiptId}`)
  }

  /**
   * Créer plusieurs quittances en une fois
   */
  async createMultipleReceipts(assignmentId: number, receipts: Omit<ReceiptCreate, 'assignment_id'>[]): Promise<Receipt[]> {
    const response = await axiosInstance.post<Receipt[]>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}/receipts/bulk`, {
      receipts: receipts.map(receipt => ({ ...receipt, assignment_id: assignmentId }))
    })
    return response.data
  }
}

// Export d'une instance singleton
export const receiptService = new ReceiptService()
export default receiptService 