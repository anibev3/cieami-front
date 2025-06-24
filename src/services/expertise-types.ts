import axiosInstance from '@/lib/axios'
import {
  ExpertiseType,
  ExpertiseTypeCreate,
  ExpertiseTypeUpdate,
  ExpertiseTypesResponse,
  ExpertiseTypeResponse,
} from '@/types/expertise-types'

export const getExpertiseTypes = async (params?: Record<string, string | number | undefined>): Promise<ExpertiseTypesResponse> => {
  const response = await axiosInstance.get<ExpertiseTypesResponse>('/expertise-types', { params })
  return response.data
}

export const getExpertiseTypeById = async (id: number | string): Promise<ExpertiseType> => {
  const response = await axiosInstance.get<ExpertiseTypeResponse>(`/expertise-types/${id}`)
  return response.data.data
}

export const createExpertiseType = async (data: ExpertiseTypeCreate): Promise<ExpertiseType> => {
  const response = await axiosInstance.post<ExpertiseTypeResponse>('/expertise-types', data)
  return response.data.data
}

export const updateExpertiseType = async (id: number | string, data: ExpertiseTypeUpdate): Promise<ExpertiseType> => {
  const response = await axiosInstance.put<ExpertiseTypeResponse>(`/expertise-types/${id}`, data)
  return response.data.data
}

export const deleteExpertiseType = async (id: number | string): Promise<void> => {
  await axiosInstance.delete(`/expertise-types/${id}`)
} 