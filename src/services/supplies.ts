import axiosInstance from '@/lib/axios'
import {
  Supply,
  SupplyCreate,
  SupplyUpdate,
  SuppliesResponse,
  SupplyResponse,
  SupplyPrice,
  SupplyPriceRequest,
  SupplyPriceResponse,
  SupplyPriceFilters,
} from '@/types/supplies'

export const getSupplies = async (params?: Record<string, string | number | undefined>): Promise<SuppliesResponse> => {
  const response = await axiosInstance.get<SuppliesResponse>('/supplies', { params })
  return response.data
}

export const getSupplyById = async (id: number | string): Promise<Supply> => {
  const response = await axiosInstance.get<SupplyResponse>(`/supplies/${id}`)
  return response.data.data
}

export const createSupply = async (data: SupplyCreate): Promise<Supply> => {
  const response = await axiosInstance.post<SupplyResponse>('/supplies', data)
  return response.data.data
}

export const updateSupply = async (id: number | string, data: SupplyUpdate): Promise<Supply> => {
  const response = await axiosInstance.put<SupplyResponse>(`/supplies/${id}`, data)
  return response.data.data
}

export const deleteSupply = async (id: number | string): Promise<void> => {
  await axiosInstance.delete(`/supplies/${id}`)
}

// Services pour les prix des fournitures
export const getSupplyPrices = async (data: SupplyPriceRequest): Promise<SupplyPriceResponse> => {
  const response = await axiosInstance.post<SupplyPriceResponse>('/shock-works/get-supply-price-by-vehicle-brand-and-vehicle-model', data)
  return response.data
}

export const getSupplyPricesWithFilters = async (filters: SupplyPriceFilters): Promise<SupplyPriceResponse> => {
  const params = new URLSearchParams()
  
  if (filters.vehicle_model_id) {
    params.append('vehicle_model_id', filters.vehicle_model_id)
  }
  if (filters.supply_id) {
    params.append('supply_id', filters.supply_id.toString())
  }
  if (filters.date) {
    params.append('date', filters.date)
  }
  if (filters.page) {
    params.append('page', filters.page.toString())
  }
  if (filters.per_page) {
    params.append('per_page', filters.per_page.toString())
  }

  const response = await axiosInstance.get<SupplyPriceResponse>(`/shock-works/get-supply-price-by-vehicle-brand-and-vehicle-model?${params.toString()}`)
  return response.data
} 