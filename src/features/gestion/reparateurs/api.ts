import axiosInstance from '@/lib/axios'
import { Reparateur, ReparateurApiResponse, ReparateurFilters } from './types'

const API_URL = 'https://e-expert-back.ddev.site/api/v1/repairers'

export const getReparateurs = async (filters?: ReparateurFilters, token?: string): Promise<ReparateurApiResponse> => {
  const { data } = await axiosInstance.get(API_URL, {
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

export const createReparateur = async (reparateur: Partial<Reparateur>, token?: string): Promise<Reparateur> => {
  const { data } = await axiosInstance.post(API_URL, reparateur, {
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