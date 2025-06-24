import axiosInstance from '@/lib/axios'
import {
  BodyworkCreate,
  BodyworkUpdate,
  BodyworksResponse,
  BodyworkResponse,
} from '@/types/bodyworks'

const BASE_URL = '/bodyworks'

export const bodyworksService = {
  // Récupérer toutes les carrosseries avec pagination
  getAll: async (page: number = 1): Promise<BodyworksResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}?page=${page}`)
    return response.data
  },

  // Récupérer une carrosserie par ID
  getById: async (id: number): Promise<BodyworkResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Créer une nouvelle carrosserie
  create: async (data: BodyworkCreate): Promise<BodyworkResponse> => {
    const response = await axiosInstance.post(BASE_URL, data)
    return response.data
  },

  // Mettre à jour une carrosserie
  update: async (id: number, data: BodyworkUpdate): Promise<BodyworkResponse> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Supprimer une carrosserie
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
  },
} 