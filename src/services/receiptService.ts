import axiosInstance from '@/lib/axios'
import { Receipt } from '@/types/assignments'
import { API_CONFIG } from '@/config/api'

interface ReceiptApiResponse {
  id: number
  assignment_id: number
  receipt_type_id: number
  amount: number
  created_at: string
  updated_at: string
}

interface ReceiptType {
  id: number
  code: string
  label: string
  description: string
}

class ReceiptService {
  /**
   * Récupérer les types de quittances
   */
  async getReceiptTypes(): Promise<ReceiptType[]> {
    const response = await axiosInstance.get<ReceiptType[]>(`${API_CONFIG.ENDPOINTS.RECEIPT_TYPES}`)
    return response.data
  }

  /**
   * Récupérer les quittances d'une assignation
   */
  async getReceiptsByAssignment(assignmentId: number): Promise<Receipt[]> {
    const response = await axiosInstance.get<ReceiptApiResponse[]>(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}/receipts`)
    return response.data.map(receipt => ({
      id: receipt.id,
      assignment_id: receipt.assignment_id,
      amount: receipt.amount,
      type: 'receipt',
      reference: `REC-${receipt.id}`,
      description: `Quittance ${receipt.id}`,
      created_at: receipt.created_at,
      updated_at: receipt.updated_at
    }))
  }

  /**
   * Créer une nouvelle quittance
   */
  async createReceipt(assignmentId: number, receiptData: { receipt_type_id: number; amount: number }): Promise<Receipt> {
    const response = await axiosInstance.put<ReceiptApiResponse>(`${API_CONFIG.ENDPOINTS.RECEIPTS}/sit`, {
      assignment_id: assignmentId,
      receipt_type_id: receiptData.receipt_type_id,
      amount: receiptData.amount
    })
    
    return {
      id: response.data.id,
      assignment_id: response.data.assignment_id,
      amount: response.data.amount,
      type: 'receipt',
      reference: `REC-${response.data.id}`,
      description: `Quittance ${response.data.id}`,
      created_at: response.data.created_at,
      updated_at: response.data.updated_at
    }
  }

  /**
   * Mettre à jour une quittance
   */
  async updateReceipt(receiptId: number, receiptData: { receipt_type_id: number; amount: number }): Promise<Receipt> {
    const response = await axiosInstance.put<ReceiptApiResponse>(`${API_CONFIG.ENDPOINTS.RECEIPTS}/${receiptId}`, receiptData)
    
    return {
      id: response.data.id,
      assignment_id: response.data.assignment_id,
      amount: response.data.amount,
      type: 'receipt',
      reference: `REC-${response.data.id}`,
      description: `Quittance ${response.data.id}`,
      created_at: response.data.created_at,
      updated_at: response.data.updated_at
    }
  }

  /**
   * Supprimer une quittance
   */
  async deleteReceipt(receiptId: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.RECEIPTS}/${receiptId}`)
  }

  /**
   * Créer plusieurs quittances en une fois
   */
  async createMultipleReceipts(assignmentId: number, receipts: { receipt_type_id: number; amount: number }[]): Promise<Receipt[]> {
    const promises = receipts.map(receipt => this.createReceipt(assignmentId, receipt))
    return Promise.all(promises)
  }
}

// Export d'une instance singleton
export const receiptService = new ReceiptService()
export default receiptService 