import axiosInstance from '@/lib/axios'
import { Reparateur, ReparateurApiResponse, ReparateurFilters } from './types'
import { CreateEntityData } from '@/types/administration'

const API_URL = 'https://back.roomcodetraining.com/api/v1/repairers'
const API_URL_ = 'https://back.roomcodetraining.com/api/v1/entities'

export const getReparateurs = async (filters?: ReparateurFilters, token?: string): Promise<ReparateurApiResponse> => {
  const { data } = await axiosInstance.get(API_URL + '?per_page=100000', {
    params: filters,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const getReparateurById = async (id: number, token?: string): Promise<Reparateur> => {
  const { data } = await axiosInstance.get(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const createReparateur = async (reparateur: CreateEntityData, token?: string): Promise<Reparateur> => {
  const { data } = await axiosInstance.post(API_URL_, reparateur, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const updateReparateur = async (id: number, reparateur: Partial<Reparateur>, token?: string): Promise<Reparateur> => {
  const { data } = await axiosInstance.put(`${API_URL}/${id}`, reparateur, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const deleteReparateur = async (id: number, token?: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
} 