import axiosInstance from '@/lib/axios'
import {
  Supply,
  SupplyCreate,
  SupplyUpdate,
  SuppliesResponse,
  SupplyResponse,
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