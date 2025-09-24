import axiosInstance from '@/lib/axios'
import {
  Receipt,
  ReceiptResponse,
  CreateReceiptData,
  CreateMultipleReceiptsData,
  UpdateReceiptData,
  ReceiptFilters,
  ReceiptCreateResponse,
  ReceiptUpdateResponse,
  ReceiptDeleteResponse
} from '@/types/administration'

class ReceiptsService {
  private baseUrl = '/receipts'

  async getAll(filters?: ReceiptFilters): Promise<ReceiptResponse> {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.receipt_type_id) params.append('receipt_type_id', filters.receipt_type_id.toString())
    if (filters?.status_id) params.append('status_id', filters.status_id.toString())
    if (filters?.assignment_id) params.append('assignment_id', filters.assignment_id.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())
    const response = await axiosInstance.get<ReceiptResponse>(`${this.baseUrl}?${params.toString()}`)
    return response.data
  }

  async getById(id: number): Promise<Receipt> {
    const response = await axiosInstance.get<Receipt>(`${this.baseUrl}/${id}`)
    return response.data
  }

  async create(data: CreateReceiptData): Promise<Receipt> {
    // L'API attend un format spécifique avec assignment_id en string et receipts en array
    const payload = {
      assignment_id: data.assignment_id.toString(),
      receipts: [{
        receipt_type_id: data.receipt_type_id.toString(),
        amount: data.amount
      }]
    }
    const response = await axiosInstance.post<ReceiptCreateResponse>(this.baseUrl, payload)
    return response.data.data
  }

  async createMultiple(data: CreateMultipleReceiptsData): Promise<Receipt[]> {
    // L'API attend un format spécifique avec assignment_id en string et receipts en array
    const payload = {
      assignment_id: data.assignment_id.toString(),
      receipts: data.receipts.map(r => ({
        receipt_type_id: r.receipt_type_id.toString(),
        amount: r.amount
      }))
    }
    const response = await axiosInstance.post<{ data: Receipt[] }>(this.baseUrl, payload)
    return response.data.data
  }

  async update(id: number | string, data: UpdateReceiptData): Promise<Receipt> {
    const response = await axiosInstance.put<ReceiptUpdateResponse>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  async delete(id: number | string): Promise<void> {
    const response = await axiosInstance.delete<ReceiptDeleteResponse>(`${this.baseUrl}/${id}`)
    // La réponse de suppression peut ne pas contenir de data, donc on ne retourne rien
  }

  // Méthodes qui retournent les réponses complètes avec messages
  async createWithResponse(data: CreateReceiptData): Promise<ReceiptCreateResponse> {
    // L'API attend un format spécifique avec assignment_id en string et receipts en array
    const payload = {
      assignment_id: data.assignment_id.toString(),
      receipts: [{
        receipt_type_id: data.receipt_type_id.toString(),
        amount: data.amount
      }]
    }
    const response = await axiosInstance.post<ReceiptCreateResponse>(this.baseUrl, payload)
    return response.data
  }

  async updateWithResponse(id: number | string, data: UpdateReceiptData): Promise<ReceiptUpdateResponse> {
    const response = await axiosInstance.put<ReceiptUpdateResponse>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async deleteWithResponse(id: number | string): Promise<ReceiptDeleteResponse> {
    const response = await axiosInstance.delete<ReceiptDeleteResponse>(`${this.baseUrl}/${id}`)
    return response.data
  }
}

export const receiptsService = new ReceiptsService()
export default receiptsService
