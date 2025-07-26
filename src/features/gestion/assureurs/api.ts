import axiosInstance from '@/lib/axios'
import { Assureur, AssureurApiResponse, AssureurFilters } from './types'

const API_URL = 'https://back.roomcodetraining.com/api/v1/insurers'

export const getAssureurs = async (filters?: AssureurFilters, token?: string): Promise<AssureurApiResponse> => {
  const { data } = await axiosInstance.get(API_URL + '?per_page=100000', {
    params: filters,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const getAssureurById = async (id: number, token?: string): Promise<Assureur> => {
  const { data } = await axiosInstance.get(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const createAssureur = async (assureur: Partial<Assureur>, token?: string): Promise<Assureur> => {
  const { data } = await axiosInstance.post(API_URL, assureur, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const updateAssureur = async (id: number, assureur: Partial<Assureur>, token?: string): Promise<Assureur> => {
  const { data } = await axiosInstance.put(`${API_URL}/${id}`, assureur, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const deleteAssureur = async (id: number, token?: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
} 