import axiosInstance from '@/lib/axios'
import {
  PaintingPriceCreate,
  PaintingPriceUpdate,
  PaintingPricesResponse,
  PaintingPriceResponse,
} from '@/types/painting-prices'

const BASE_URL = '/painting-prices'

export const paintingPricesService = {
  // Récupérer tous les prix avec pagination
  getAll: async (page: number = 1): Promise<PaintingPricesResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}?page=${page}`)
    return response.data
  },

  // Récupérer un prix par ID
  getById: async (id: number): Promise<PaintingPriceResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Créer un nouveau prix
  create: async (data: PaintingPriceCreate): Promise<PaintingPriceResponse> => {
    const response = await axiosInstance.post(BASE_URL, data)
    return response.data
  },

  // Mettre à jour un prix
  update: async (id: number, data: PaintingPriceUpdate): Promise<PaintingPriceResponse> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Supprimer un prix
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
  },
} 