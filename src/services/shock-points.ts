import axiosInstance from '@/lib/axios'
import {
  ShockPoint,
  ShockPointCreate,
  ShockPointUpdate,
  ShockPointsResponse,
  ShockPointResponse,
} from '@/types/shock-points'

export const getShockPoints = async (params?: Record<string, string | number | undefined>): Promise<ShockPointsResponse> => {
  const response = await axiosInstance.get<ShockPointsResponse>('/shock-points', { params })
  return response.data
}

export const getShockPointById = async (id: number | string): Promise<ShockPoint> => {
  const response = await axiosInstance.get<ShockPointResponse>(`/shock-points/${id}`)
  return response.data.data
}

export const createShockPoint = async (data: ShockPointCreate): Promise<ShockPoint> => {
  const response = await axiosInstance.post<ShockPointResponse>('/shock-points', data)
  return response.data.data
}

export const updateShockPoint = async (id: number | string, data: ShockPointUpdate): Promise<ShockPoint> => {
  const response = await axiosInstance.put<ShockPointResponse>(`/shock-points/${id}`, data)
  return response.data.data
}

export const deleteShockPoint = async (id: number | string): Promise<void> => {
  await axiosInstance.delete(`/shock-points/${id}`)
} 