import axiosInstance from '@/lib/axios'
import {
  ReceiptType,
  ReceiptTypeResponse,
  CreateReceiptTypeData,
  UpdateReceiptTypeData,
  ReceiptTypeFilters
} from '@/types/administration'

class ReceiptTypeService {
  private baseUrl = '/receipt-types'

  async getAll(filters?: ReceiptTypeFilters): Promise<ReceiptTypeResponse> {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())
    const response = await axiosInstance.get<ReceiptTypeResponse>(`${this.baseUrl}?${params.toString()}`)
    return response.data
  }

  async getById(id: number | string): Promise<ReceiptType> {
    const response = await axiosInstance.get<ReceiptType>(`${this.baseUrl}/${id}`)
    return response.data
  }

  async create(data: CreateReceiptTypeData): Promise<ReceiptType> {
    const response = await axiosInstance.post<ReceiptType>(this.baseUrl, data)
    return response.data
  }

  async update(id: number | string, data: UpdateReceiptTypeData): Promise<ReceiptType> {
    const response = await axiosInstance.put<ReceiptType>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async delete(id: number | string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }
}

export const receiptTypeService = new ReceiptTypeService()
export default receiptTypeService 