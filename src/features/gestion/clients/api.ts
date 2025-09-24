import axiosInstance from '@/lib/axios'
import { Client, ClientApiResponse, ClientFilters } from './types'
import { API_CONFIG } from '@/config/api'

const API_URL = API_CONFIG.BASE_URL + '/clients'

export const getClients = async (filters?: ClientFilters, token?: string): Promise<ClientApiResponse> => {
  const { data } = await axiosInstance.get(API_URL, {
    params: {
      per_page: 25, // Pagination par défaut
      ...filters
    },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const getClientById = async (id: number, token?: string): Promise<Client> => {
  const { data } = await axiosInstance.get(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const createClient = async (client: Partial<Client>, token?: string): Promise<Client> => {
  const { data } = await axiosInstance.post(API_URL, client, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const updateClient = async (id: number, client: Partial<Client>, token?: string): Promise<Client> => {
  const { data } = await axiosInstance.put(`${API_URL}/${id}`, client, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const deleteClient = async (id: number, token?: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
} 