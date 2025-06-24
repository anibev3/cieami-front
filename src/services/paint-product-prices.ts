import axiosInstance from '@/lib/axios'
import {
  PaintProductPriceCreate,
  PaintProductPriceUpdate,
  PaintProductPricesResponse,
  PaintProductPriceResponse,
} from '@/types/paint-product-prices'

const BASE_URL = '/paint-product-prices'

export const paintProductPricesService = {
  // Récupérer tous les tarifs avec pagination
  getAll: async (page: number = 1): Promise<PaintProductPricesResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}?page=${page}`)
    return response.data
  },

  // Récupérer un tarif par ID
  getById: async (id: number): Promise<PaintProductPriceResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Créer un nouveau tarif
  create: async (data: PaintProductPriceCreate): Promise<PaintProductPriceResponse> => {
    const response = await axiosInstance.post(BASE_URL, data)
    return response.data
  },

  // Mettre à jour un tarif
  update: async (id: number, data: PaintProductPriceUpdate): Promise<PaintProductPriceResponse> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Supprimer un tarif
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
  },
} 